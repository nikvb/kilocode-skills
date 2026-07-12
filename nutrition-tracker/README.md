# Daily Plate — personal nutrition log

A single-file, offline nutrition tracker built around a plant-forward eating
plan. Open `index.html` in any browser — no build step, no server, no account.
All data is stored in the browser's `localStorage`.

## What it does

- **Daily totals against your targets** — calories as a budget, plus macro bars
  for protein, net carbs (total carbs − fiber), fiber, and fat. Goals turn green
  when reached; budgets turn red when exceeded.
- **Focus nutrients** — iron and vitamin B12 are surfaced on their own cards,
  the two that matter most to watch on a plant-forward plate.
- **Macro split** — a donut showing where your calories come from (protein /
  net carb / fat).
- **Food log per day** — add foods with a serving multiplier, remove entries,
  and move between days.
- **Editable food library** — 21 plant-forward foods preloaded with typical
  values (legumes, tofu/tempeh, greens, nuts, seeds, oils, fortified soy milk
  and nutritional yeast). Add your own foods with full macros + iron + B12.
- **Editable targets** — tune calories, protein, net carbs, fiber, fat, iron,
  and B12 to your own plan.
- **Light & dark themes**, responsive down to phone width.

## Notes

- Nutrition values are typical references for the listed serving sizes. Edit any
  food to match the exact numbers on your labels.
- There's no external food-database API — the food list is what's preloaded plus
  what you add. That's a deliberate trade for working fully offline.
- Not medical advice.

## Data & privacy

Everything lives in `localStorage` under the key `dailyPlate.v1` in the browser
you use it in. Clearing site data resets the tracker. Nothing is sent anywhere.
