import { defineConfig } from "spark";
// process.env.ANALYZE = 'true';
process.env.PROXY_SERVER = "http://localhost:8000";
export default defineConfig({
  npmClient: 'yarn',
  base: "/",
  publicPath: "/",
  routes: [
    {
      path: "/",
      component: "@/pages/Home/index",
    },
    {
      path: "/docs",
      component: "@/pages/Docs/index",
    },
    {
      path: "/template",
      component: "@/pages/Template/index",
    },
    {
      path: "/variable",
      component: "@/pages/Variable/index",
    },
    {
      path: "/preview",
      component: "@/pages/Preview/index",
    },
  ],
  vue: {},
  mock: {},
  pinia: {},
  request: {},
  plugins: [],
  ark: {
    slave: {},
  },
  buildSplitting: {
    asyncVendors: [],
    jsStrategy: "singleChunks",
  },
  // login: {
  //   envLists: [
  //     { name: `UAT(http://172.16.7.65)`, value: `http://172.16.7.65/` },
  //   ],
  //   accountLists: [
  //     {
  //       name: "cs004",
  //       value: { username: "cs004", password: "1" },
  //     },
  //     {
  //       name: "cs006",
  //       value: { username: "cs006", password: "1" },
  //     },
  //   ],
  // },
});
