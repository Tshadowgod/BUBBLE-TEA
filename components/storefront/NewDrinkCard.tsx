import { DrinkArt } from "@/components/DrinkArt";
import type { PlainDrink } from "@/lib/types";

export function NewDrinkCard({
  drink,
  onSelect,
}: {
  drink: PlainDrink;
  onSelect: (drink: PlainDrink) => void;
}) {
  const [dollars, cents] = drink.price.toFixed(2).split(".");

  return (
    <button
      type="button"
      onClick={() => onSelect(drink)}
      className="brand-card group flex w-[11.5rem] shrink-0 flex-col overflow-hidden rounded-[1.25rem] text-left transition hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-neutral-100">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="lg"
          rounded="xl"
          className="!h-full !w-full !rounded-none transition duration-300 group-hover:scale-105"
        />
        <span className="brand-accent absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wide text-white">
          Nuevo
        </span>
        <span className="brand-ink absolute bottom-2.5 right-2.5 rounded-full px-2.5 py-1 font-display text-sm font-semibold text-white">
          Bs {dollars}
          <sup className="text-[10px]">{cents}</sup>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        {drink.tag && (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
            {drink.tag}
          </span>
        )}
        <div className="flex items-end justify-between gap-2">
          <span className="font-display text-[15px] font-semibold leading-tight text-ink">
            {drink.name}
          </span>
          <span className="brand-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
