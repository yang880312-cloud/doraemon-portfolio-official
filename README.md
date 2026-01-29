# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 部署 (Deployment)

### Vercel (推薦)
1. Fork 此專案到 GitHub。
2. 在 Vercel 新增專案，選擇 GitHub 儲存庫。
3. Framework Preset 選擇 `Vite`。
4. 點擊 Deploy。

### Netlify
1. New site from Git -> GitHub.
2. Build command: `npm run build`
3. Publish directory: `dist`

### SEO 設定
本專案使用 `@vueuse/head` 管理 Meta Tags。若要修改標題與描述，請至 `src/views/` 下的各個頁面檔案中修改 `useHead` 設定。

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
