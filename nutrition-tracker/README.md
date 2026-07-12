# Daily Plate — personal nutrition log

A single-file, offline nutrition tracker built around a plant-forward eating
plan. Open `index.html` in any browser — no build step, no server, no account.
All data is stored in the browser's `localStorage`.

## What it does

- **Scan a meal photo (AI)** — photograph a plate and a Claude vision model
  identifies the foods and estimates their nutrition. You review and correct the
  estimates before they're logged. See **AI meal scanning** below for setup and
  limits.
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

## AI meal scanning

Open **AI meal scanning** in the app, paste your own
[Anthropic API key](https://console.anthropic.com/settings/keys), and pick a
model (Opus 4.8 is most accurate; Sonnet 5 / Haiku 4.5 are faster and cheaper).
Then tap **Scan a meal photo**, choose or take a picture, and review the detected
items before adding them to the log.

Two real limits:

- **It only works when you open `index.html` locally** (or self-host it).
  Scanning makes a direct browser call to `api.anthropic.com`, which the
  claude.ai artifact page blocks — you'll see a clear message there. The app
  downscales images before sending to keep requests small.
- **The key is stored in your browser** (`localStorage`) and is visible to the
  page, so use a key you're comfortable keeping on your own machine. Requests go
  only to Anthropic; nothing else leaves your browser.

Every estimate is the model's best guess — the review step lets you fix portions,
and you can still edit any logged item afterward.

## Notes

- Nutrition values are typical references for the listed serving sizes. Edit any
  food to match the exact numbers on your labels.
- Besides AI scanning, there's no external food-database lookup — the manual food
  list is what's preloaded plus what you add. That's a deliberate trade for
  working fully offline.
- Not medical advice.

## Data & privacy

Everything lives in `localStorage` under the key `dailyPlate.v1` in the browser
you use it in. Clearing site data resets the tracker. Nothing is sent anywhere.
