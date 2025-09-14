import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_vmUndfwH.mjs';
import { manifest } from './manifest_Cdp7mT_6.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/categories.astro.mjs');
const _page3 = () => import('./pages/api/init-db.astro.mjs');
const _page4 = () => import('./pages/api/products/_id_.astro.mjs');
const _page5 = () => import('./pages/api/products.astro.mjs');
const _page6 = () => import('./pages/api/whatsapp.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/categories.ts", _page2],
    ["src/pages/api/init-db.ts", _page3],
    ["src/pages/api/products/[id].ts", _page4],
    ["src/pages/api/products.ts", _page5],
    ["src/pages/api/whatsapp.ts", _page6],
    ["src/pages/index.astro", _page7]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
