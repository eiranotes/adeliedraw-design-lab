# Adelie Draw — Design Lab (2026-10-08)

Independent, **static design-comparison preview** for the Adelie Draw website family.

## Boundaries

- No changes to `adeliedraw.com`, Cafe24 skins, store configuration, existing repositories or DNS.
- No checkout, payment, live inventory writes, user accounts, analytics or tracking.
- Catalog of 85 public items copied from the 2026-10-07 verified storefront catalog, including KO/EN/JA text and display prices.
- This is a design prototype, not an active sales channel.
- `<meta name="robots" content="noindex,nofollow,noarchive">` and robots.txt disallow crawling.

## Pages

- `?page=home` — editorial brand gateway
- `?page=info` — portfolio and selected works
- `?page=shop` — Korean shop, 85-item demo catalog
- `?page=shop&lang=en` — English shop
- `?page=shop&lang=ja` — Japanese shop
- `?page=apps` — Adelie Pages presentation
- `?page=compare` — original vs preview navigation

## Preview interactions

- Filter category, search, sort, load-more, product detail sheet.
- In-memory demo bag; no requests to Cafe24 commerce APIs.
- Responsive shell, local illustrations/assets, responsive cards and menus.
- All original-site links open in new tabs.

## Data and assets

Images belong to Adelie Draw, copied to a separate preview from local canonical sources and published Adelie Pages public assets. Fonts are distributed separately here only under their existing OFL license. No proprietary source repository, credentials, tokens or checkout scripts are included.

Preview should be accessible at a separate GitHub Pages project address after its workflow completes.

## Local run

```sh
python3 -m http.server 4178
```

Open `http://localhost:4178/?page=compare`.

## Verification

```sh
node --check app.js
node --test scripts/test-site.mjs
```
