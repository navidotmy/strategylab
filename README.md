# Strategy Lab — US equities historical backtester

A mobile-first static PWA. Open `index.html` in a modern browser, or publish these files together to GitHub Pages (HTTPS) for a fully installable PWA. No brokerage API keys or backend required.

1. Enter US stock tickers and choose 2, 5, or 10 years.
2. Choose a stock universe: all, screened proxy, excluded-business, or unverified.
3. Press **Load real stock history** (requires internet). The app fetches daily OHLCV from Yahoo Finance via the third-party public `cors.dev` proxy; market data is cached in IndexedDB.
4. In **Custom strategies**, create your own entry rules (AND/OR), optional exit conditions, and optional maximum holding time. Save up to 10, enable up to 4 at once, and import/export strategy JSON backups.
5. Press **Run all backtests**. The total updates dynamically: 255 for eight built-in methods; up to 4,095 with four custom strategies enabled.
6. Inspect the rankings, individual trades, and price plots; export ranked summaries and trade logs as CSV.
7. If the price provider is blocked, import your own daily OHLCV CSV data (one per symbol named `AAPL.csv`, or include a `Symbol` column). Required headers: `Date,Open,High,Low,Close,Volume`. Add a `SPY.csv` for the benchmark. The CSV must contain at least 100 valid rows per ticker.

## Disclosures

- Historical backtests are **computed in your browser only after actual data loads**; no fake demo performance is bundled.
- With eight built-in and 0–4 enabled custom strategies, the test runs `2^(8 + enabled custom) - 1` subsets (255–4,095); conjunction requires same-day agreement. Some combinations will never signal, particularly breakout + mean reversion.
- Minervini VCP, Darvas box, Weinstein Stage 2 and CAN SLIM are rule-based price **approximations**, not full formulations. CAN SLIM's fundamental growth factors are unavailable without point-in-time earnings data.
- The "Shariah screened proxy" category is based on examples from SPUS public holdings dated 2026-10-23. It is not an as-of-date Shariah certification, and its retrospective use causes survivorship/look-ahead bias. Excluded conventional banking/finance/tobacco/alcohol/gambling examples are sector-only classifications. Unlisted tickers are unverified. User overrides are assumptions.
- The app models long-only daily-bar backtests, next-open entries, conservative intraday stop-first ambiguity, a hypothetical independent $1,000 notional per trade, and editable costs. It is **not** a fully capital-constrained portfolio backtester, a live/paper-trading bot, or financial advice.
- The proxy and Yahoo's unofficial endpoint may stop working, impose new limits, or restrict redistribution. For production, use a licensed data feed served from your own secure backend.
- Custom strategy definitions are saved to browser localStorage and can be imported/exported to JSON. Do not include personal identifiers or executable code in definitions.
- Offline app shell is cached via service worker; cached stock history is stored in the browser, not synchronized across devices.

Sources: https://www.sp-funds.com/SPUS/ ; https://www.sc.com.my/development/icm/shariah-compliant-securities/shariah-compliant-securities-screening-methodology ; https://cors.dev/docs