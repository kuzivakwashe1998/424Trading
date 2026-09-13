-- ============================================================================
-- 424 TRADING — Supabase schema
-- Run this whole file once in: Supabase Dashboard → SQL Editor → New query.
-- Creates: tables, the submit_order function, storage bucket + policies.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  -- NULL price means "Request a Quote" on the website.
  price numeric(12,2),
  image_url text not null default '',
  stock integer not null default 0,
  available boolean not null default true,
  featured boolean not null default false,
  -- Product line within a category, e.g. "Floodlights", "VSD Drives".
  subcategory text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  address text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  total numeric(12,2) not null default 0,
  status text not null default 'pending',
  delivery_method text not null default 'collection',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  price numeric(12,2),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company text not null default '',
  email text not null,
  phone text not null default '',
  product text not null,
  quantity text not null default '',
  requirements text not null default '',
  delivery_location text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_available on public.products(available);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- ---------------------------------------------------------------------------
-- SECURE ORDER SUBMISSION (used by the website checkout)
-- Reuses the customer if the email already exists; computes the total from
-- current product prices; snapshots the price on each order line.
-- ---------------------------------------------------------------------------

create or replace function public.submit_order(p jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid := gen_random_uuid();
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_price numeric(12,2);
begin
  -- find or create the customer
  select id into v_customer_id
  from public.customers
  where lower(email) = lower(p->'customer'->>'email');

  if v_customer_id is null then
    insert into public.customers (name, email, phone, company, address)
    values (
      p->'customer'->>'name',
      p->'customer'->>'email',
      coalesce(p->'customer'->>'phone', ''),
      coalesce(p->'customer'->>'company', ''),
      coalesce(p->'customer'->>'address', '')
    )
    returning id into v_customer_id;
  else
    update public.customers set
      name    = p->'customer'->>'name',
      phone   = coalesce(p->'customer'->>'phone', phone),
      company = coalesce(p->'customer'->>'company', company),
      address = coalesce(p->'customer'->>'address', address)
    where id = v_customer_id;
  end if;

  -- order header (total computed below, then updated)
  insert into public.orders (id, customer_id, total, status, delivery_method, notes)
  values (
    v_order_id,
    v_customer_id,
    0,
    'pending',
    coalesce(p->>'delivery_method', 'collection'),
    coalesce(p->>'notes', '')
  );

  -- order lines with price snapshot
  for v_item in select * from jsonb_array_elements(coalesce(p->'items', '[]'::jsonb))
  loop
    select price into v_price
    from public.products
    where id = (v_item->>'product_id')::uuid;

    insert into public.order_items (order_id, product_id, quantity, price)
    values (
      v_order_id,
      (v_item->>'product_id')::uuid,
      greatest(1, (v_item->>'quantity')::int),
      v_price
    );

    v_total := v_total + coalesce(v_price, 0) * greatest(1, (v_item->>'quantity')::int);
  end loop;

  update public.orders set total = v_total where id = v_order_id;
  return v_order_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public read for the catalogue; public write for orders/quotes/customers.
-- The admin dashboard uses the anon key + the app-level password gate.
-- Tighten with Supabase Auth if you later add real admin accounts.
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (true);
drop policy if exists categories_public_write on public.categories;
create policy categories_public_write on public.categories
  for all using (true) with check (true);

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (true);
drop policy if exists products_public_write on public.products;
create policy products_public_write on public.products
  for all using (true) with check (true);

drop policy if exists customers_public_write on public.customers;
create policy customers_public_write on public.customers
  for all using (true) with check (true);

drop policy if exists orders_public_all on public.orders;
create policy orders_public_all on public.orders
  for all using (true) with check (true);

drop policy if exists order_items_public_all on public.order_items;
create policy order_items_public_all on public.order_items
  for all using (true) with check (true);

drop policy if exists quotes_public_all on public.quote_requests;
create policy quotes_public_all on public.quote_requests
  for all using (true) with check (true);

-- submit_order runs as the definer, so it bypasses RLS safely.
grant execute on function public.submit_order(jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- STORAGE: public product-images bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists product_images_public_write on storage.objects;
create policy product_images_public_write on storage.objects
  for insert with check (bucket_id = 'product-images');

drop policy if exists product_images_public_update on storage.objects;
create policy product_images_public_update on storage.objects
  for update using (bucket_id = 'product-images');
