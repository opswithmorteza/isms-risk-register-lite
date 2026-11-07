# ISMS Risk Register Lite

A tiny, bilingual information-security risk register by **Morteza Rajabi**. Identify assets and threats, assign ownership, prioritize risks and record the next action — all in one page.

**[Open live demo](https://opswithmorteza.github.io/isms-risk-register-lite/)** · [Portfolio](https://mortezarajabi.ir/)

## Features

- English / فارسی with right-to-left layout.
- Add, edit and remove risks with asset, scenario, owner, treatment and status.
- Likelihood × impact scoring (1–5 each), with an interactive 5×5 risk matrix.
- Search, severity filtering and active-priority counters.
- CSV export with spreadsheet formula-injection protection.
- Versioned JSON backup / restore. Restore adds missing IDs; existing IDs are kept unchanged.
- Browser-local persistence. No login, server, analytics, external fonts or dependencies.
- Fictional Oracle, DevSecOps and access-review examples, loaded only on request.

## Run

Serve this directory with any static server, for example:

```sh
python -m http.server 8787
```

Then open `http://localhost:8787`. GitHub Pages can serve the `main` branch's root directory directly.

Tests require Node.js 18 or newer, with no installation step:

```sh
node --test test.cjs
```

## Assessment model

Likelihood: 1 rare, 2 unlikely, 3 possible, 4 likely, 5 almost certain.
Impact: 1 negligible, 2 minor, 3 moderate, 4 major, 5 severe.

| Score | Label |
|---|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–14 | High |
| 15–25 | Critical |

These are **illustrative criteria**, not thresholds prescribed by ISO. Agree criteria and acceptance authority within your organization. The map includes all risks except closed; the active-priority counter excludes accepted and closed risks. Status does not change the recorded score. Residual risk and approval workflows are outside this intentionally small tool.

## Data and scope

Data stays in localStorage on the current browser and origin, is not encrypted and is not sent to a server. Export backups regularly; clearing browser data removes the register. Backup restores support up to 500 records and 2 MB. When stored data is unreadable, the app refuses to overwrite it; recover the original storage or use a separate browser profile to restore a known-good backup. Use fictional or sanitized data on shared devices. This working register is not a full ISMS, audit trail or certification assessment.

## Background and license

Original implementation, conceptually inspired by risk-register workflows in [CISO Assistant Community](https://github.com/intuitem/ciso-assistant-community). No upstream code, assets or ISO standard text are copied. This project is independent and is not an official CISO Assistant or ISO product.

MIT © 2026 Morteza Rajabi. See [LICENSE](LICENSE).

## فارسی

ابزار کوچک ثبت ریسک امنیت اطلاعات: دارایی، تهدید، مسئول، احتمال، اثر و اقدام بعدی را ثبت کن. با دکمهٔ «فارسی» زبان رابط تغییر می‌کند. برای شروع از نمونه‌های فرضی استفاده کن. داده‌ها فقط در مرورگر ذخیره می‌شوند؛ از خروجی JSON پشتیبان بگیر و CSV را برای گزارش استفاده کن.
