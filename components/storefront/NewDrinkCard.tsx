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
      className="group flex w-[11.75rem] shrink-0 flex-col overflow-hidden rounded-[1.35rem] bg-white text-left shadow-[0_8px_28px_rgba(26,18,12,0.16)] transition hover:-translate-y-1 active:scale-[0.98] lg:w-full"
    >
      <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-[#f4efe8] lg:h-48">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="lg"
          rounded="xl"
          className="!h-full !w-full !rounded-none transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wide text-white">
          Nuevo
        </span>
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-display text-sm font-bold text-ink shadow-sm">
          {drink.priceLarge !== null && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-neutral-400">
              Desde
            </span>
          )}
          Bs {dollars}
          <sup className="text-[10px]">{cents}</sup>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        {drink.tag && (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
            {drink.tag}
          </span>
        )}
        <div className="flex items-end justify-between gap-2">
          <span className="font-display text-[15px] font-semibold leading-tight text-ink">
            {drink.name}
          </span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white transition group-hover:bg-accent-600">
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
