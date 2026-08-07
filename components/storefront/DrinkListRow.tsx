import { DrinkArt } from "@/components/DrinkArt";
import { formatMoney } from "@/lib/format";
import type { PlainDrink } from "@/lib/types";

export function DrinkListRow({
  drink,
  onSelect,
}: {
  drink: PlainDrink;
  onSelect: (drink: PlainDrink) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(drink)}
      className="group flex h-full w-full items-center gap-3.5 rounded-[1.2rem] bg-white px-3 py-3 text-left shadow-[0_4px_16px_rgba(120,70,20,0.07)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(120,70,20,0.12)] active:scale-[0.99] lg:px-4 lg:py-3.5"
    >
      <div className="relative shrink-0 overflow-hidden rounded-2xl bg-[#f4efe8]">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="sm"
          className="!h-[4.35rem] !w-[4.35rem] !rounded-2xl transition duration-300 group-hover:scale-105 lg:!h-[4.75rem] lg:!w-[4.75rem]"
        />
        {drink.isNew && (
          <span className="absolute left-1 top-1 rounded-full bg-accent-500 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
            Nuevo
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-semibold text-ink">
          {drink.name}
        </p>
        {drink.tag && (
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-400">
            {drink.tag}
          </p>
        )}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          {drink.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatMoney(drink.originalPrice)}
            </span>
          )}
          <span className="font-display text-sm font-bold text-accent-500">
            {drink.priceLarge !== null && (
              <span className="mr-1 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                Desde
              </span>
            )}
            {formatMoney(drink.price)}
          </span>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white shadow-sm transition group-hover:scale-110 group-hover:bg-accent-600"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}
