# H&B Monthly Report

This project has:

- a public read-only dashboard at `/dashboard`
- a password-protected admin portal at `/admin`
- a canonical published report file at [src/data/publishedReport.json](C:\Users\csah0\OneDrive\Desktop\H&B_MonthlyReport\src\data\publishedReport.json)

## Local development

1. Copy `.env.example` to `.env` and set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
2. Run `npm install`.
3. Run `npm run dev -- --host`.

Notes:

- `localhost` works only on your machine.
- `npm run dev -- --host` allows other devices on the same local network to open the app if your firewall/network allows it.
- This does not make the app public on the internet.

## Manual publish workflow

1. Sign in to `/admin`.
2. Edit the local draft.
3. Export the report JSON.
4. Replace the contents of [src/data/publishedReport.json](C:\Users\csah0\OneDrive\Desktop\H&B_MonthlyReport\src\data\publishedReport.json) with the exported JSON.
5. Redeploy the site.

Public visitors only see the published JSON that was bundled into the deployed app.

## Deploy on Vercel

1. Create a Vercel project from this folder.
2. Set these environment variables in Vercel:
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
3. Deploy.

After deployment:

- `/dashboard` is public
- `/admin` requires the configured password
- direct route access works through `vercel.json`
