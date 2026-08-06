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
      className="brand-card group flex w-full items-center gap-3.5 rounded-[1.15rem] px-3 py-3 text-left transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative shrink-0 overflow-hidden rounded-2xl">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="sm"
          className="!h-[4.25rem] !w-[4.25rem] !rounded-2xl"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[15px] font-semibold text-ink">
          {drink.name}
        </p>
        {drink.tag && (
          <p className="mt-0.5 text-xs font-semibold text-neutral-500">{drink.tag}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        {drink.originalPrice && (
          <p className="text-xs text-neutral-400 line-through">
            {formatMoney(drink.originalPrice)}
          </p>
        )}
        <p className="font-display text-sm font-bold text-ink transition group-hover:text-accent-500">
          {formatMoney(drink.price)}
        </p>
      </div>
    </button>
  );
}
