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
      className="flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-2.5 text-left shadow-sm backdrop-blur-xl transition hover:shadow-md"
    >
      <DrinkArt
        colorway={drink.colorway}
        imageUrl={drink.imageUrl}
        alt={drink.name}
        size="sm"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-neutral-800">{drink.name}</p>
      </div>
      <div className="text-right">
        {drink.originalPrice && (
          <p className="text-xs text-neutral-400 line-through">
            {formatMoney(drink.originalPrice)}
          </p>
        )}
        <p className="text-sm font-bold text-brand-600">{formatMoney(drink.price)}</p>
      </div>
    </button>
  );
}
