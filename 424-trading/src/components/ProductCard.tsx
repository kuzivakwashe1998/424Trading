import { Link } from "react-router-dom";
import type { Product } from "../lib/db";
import { COMPANY, waLink } from "../lib/config";
import { useCart } from "../context/CartContext";
import { CartIcon, TagIcon, WhatsAppIcon } from "./Icons";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="group relative bg-white border border-ink-100 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-ink-950/8 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-ink-50"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.available && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink-950/80 text-white text-[11px] font-bold tracking-wide">
            OUT OF STOCK
          </span>
        )}
        {product.featured && product.available && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-accent-600 text-white text-[11px] font-bold tracking-wide">
            FEATURED
          </span>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className="text-[11px] font-bold tracking-[0.14em] text-accent-600 uppercase">
          {product.category_name || product.subcategory}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-1.5 font-semibold text-ink-900 leading-snug hover:text-accent-600 transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-ink-500 line-clamp-1">
          {product.subcategory}
        </p>

        <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between gap-2 mt-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-ink-950 text-white text-[11px] font-bold tracking-wide">
            <TagIcon className="w-3.5 h-3.5 text-accent-500" />
            REQUEST A QUOTE
          </span>

          <div className="flex items-center gap-2">
            {product.available && (
              <button
                onClick={() => add(product.id, 1)}
                title="Add to order"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-ink-950 text-ink-950 text-xs font-bold hover:bg-ink-950 hover:text-white active:scale-95 transition-all"
              >
                <CartIcon className="w-4 h-4" />
                Add
              </button>
            )}
            <a
              href={waLink(
                `Hello ${COMPANY.name}, I would like to request a quote for: ${product.name}.`
              )}
              target="_blank"
              rel="noreferrer"
              title="Request a quote on WhatsApp"
              aria-label={`Request a quote for ${product.name} on WhatsApp`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent-600 text-white hover:bg-accent-700 active:scale-95 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
