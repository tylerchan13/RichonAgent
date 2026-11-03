# Richon Agent · Web Demo

A working, privacy-first business analytics demo for RichonAgent. React + Vite, with CSV parsing and deterministic calculations entirely in the browser.

## Run locally

Requires Node.js 22+ and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. To build and verify:

```sh
pnpm test
pnpm build
```

`dist/` is a static site and can be deployed on any static host. No API key or backend is required. Hash navigation supports Overview, Dataset, and Report without special host rewrites.

## Demo flow

1. Open the original project's 36-row sales dataset. The sample has revenue 21,500, profit 4,247.50, margin 19.76%, and monthly revenue of 7,800 / 6,400 / 7,300.
2. Switch to the synthetic Hong Kong boutique retail dataset for six months of data.
3. Filter by region and switch the trend chart between revenue and profit.
4. Upload a UTF-8 CSV, confirm column mapping and the source currency, then calculate actual results.
5. Inspect or search the normalized data, then download a Markdown report or print the report as PDF.

## CSV contract

The first row must contain unique, non-empty headers. Required fields are date and sales/revenue; profit, units, product, and region are optional. Common Chinese and English names are detected automatically and can be manually mapped. Each source column may only be mapped once.

- Dates: `YYYY-MM-DD` or `YYYY/MM/DD` (ISO datetime values are also accepted and grouped by the date prefix).
- Numbers: plain signed decimals, optionally with commas and a leading HK$, US$, USD, HKD, CNY, RMB, ¥, ￥ or $ symbol.
- Limit: 5 MB, 50,000 rows. Invalid rows are reported and block analysis until corrected; rows are not silently discarded.
- Use an actual profit column. Profit's accounting definition is not inferred. Missing optional metrics display as unavailable.
- Source currencies: HKD, USD, CNY. The selector labels the original figures; it does not perform foreign exchange conversion. The legacy sample has no currency metadata, so HKD is explicitly marked as a demo display unit.

## Calculation and privacy

Revenue and profit are sums of mapped fields. Margin is total profit divided by positive total revenue. Units are quantities, never inferred order counts. Trends aggregate by calendar month. Growth is calculated only for consecutive months with a positive baseline. Missing months are not silently treated as zero; the last month may have incomplete coverage.

Insights and reports are rule-based, not AI-generated. This frontend does not invoke the original Python/OpenAI agent. CSV contents are processed in memory in the current browser tab, are never sent to a server, and disappear on refresh. Fonts may load from Google Fonts; system fonts provide a fallback.

## UI direction

Cool white, graphite, silver rules, and a restrained champagne accent. No green. Original generated concept: `docs/design-concept.png`. The working UI deliberately uses Chinese labels and the original dataset's actual products, regions, and quantities instead of invented values in the concept.
