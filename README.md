# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Supabase Edge Functions

### `upload-image`

Accepts an image, reads it into a `Uint8Array` buffer, and returns **base64** (plus optional `dataUrl`).

- **Multipart (recommended):** `POST` with `Content-Type: multipart/form-data` and field **`file`**.
- **Raw body:** `POST` with the raw bytes (e.g. `image/png`) and optional `Content-Type`.

**Local serve**

```bash
npx supabase start
npx supabase functions serve upload-image
```

**Deploy to hosted Supabase**

1. Install CLI: [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Log in and link the project (once):

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

3. Deploy:

```bash
npm run supabase:deploy:upload-image
```

Or: `npx supabase functions deploy upload-image`

Invoke after deploy:

`POST https://<PROJECT_REF>.supabase.co/functions/v1/upload-image`  
Send header `Authorization: Bearer <anon-or-user-jwt>` and `apikey: <anon-key>` (same as client).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
