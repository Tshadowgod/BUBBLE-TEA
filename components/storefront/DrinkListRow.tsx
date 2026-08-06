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
      className="brand-card group flex w-full items-center gap-3.5 rounded-[1.15rem] px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative shrink-0 overflow-hidden rounded-2xl">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="sm"
          className="!h-[4.25rem] !w-[4.25rem] !rounded-2xl transition duration-300 group-hover:scale-105"
        />
        {drink.isNew && (
          <span className="brand-accent absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
            Nuevo
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-semibold text-ink">
          {drink.name}
        </p>
        {drink.tag && (
          <p className="mt-0.5 text-xs font-semibold text-neutral-500">{drink.tag}</p>
        )}
        <div className="mt-1 flex items-baseline gap-1.5">
          {drink.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatMoney(drink.originalPrice)}
            </span>
          )}
          <span className="font-display text-sm font-bold text-ink">
            {formatMoney(drink.price)}
          </span>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="brand-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition group-hover:scale-110"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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
