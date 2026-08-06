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
      className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/55 text-left shadow-sm backdrop-blur-xl transition hover:shadow-md"
    >
      <div className="relative flex h-32 shrink-0 items-center justify-center bg-white/30">
        <DrinkArt
          colorway={drink.colorway}
          imageUrl={drink.imageUrl}
          alt={drink.name}
          size="lg"
          rounded="full"
          backdrop
          className="!h-24 !w-24"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
          NEW!
        </span>
        <span className="absolute right-2 top-2 text-sm font-extrabold text-neutral-800">
          ${dollars}
          <sup className="text-[10px]">{cents}</sup>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {drink.tag && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
            {drink.tag}
          </span>
        )}
        <div className="flex items-end justify-between gap-2">
          <span className="text-sm font-semibold leading-tight text-neutral-800">
            {drink.name}
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
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
