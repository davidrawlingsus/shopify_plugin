var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx",
          lineNumber: 66,
          columnNumber: 7
        },
        this
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx",
          lineNumber: 116,
          columnNumber: 7
        },
        this
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var links = () => [
  { rel: "stylesheet", href: "https://cdn.shopify.com/shopifycloud/app-bridge.css" }
], meta = () => [
  { charset: "utf-8" },
  { title: "Survey & Session Replay App" },
  { name: "viewport", content: "width=device-width,initial-scale=1" }
];
function App() {
  return /* @__PURE__ */ jsxDEV2("html", { children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 25,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 24,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { children: [
      /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 32,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}

// app/routes/auth.tsx
var auth_exports = {};
__export(auth_exports, {
  loader: () => loader
});
import { redirect } from "@remix-run/node";

// app/shopify.server.ts
import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
var sessionStorage = {
  async storeSession(session) {
    return console.log("Storing session:", session.id), !0;
  },
  async loadSession(id) {
    console.log("Loading session:", id);
  },
  async deleteSession(id) {
    return console.log("Deleting session:", id), !0;
  },
  async deleteSessions(ids) {
    return console.log("Deleting sessions:", ids), !0;
  },
  async findSessionsByShop(shop) {
    return console.log("Finding sessions for shop:", shop), [];
  }
}, shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY || "your-api-key",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "your-api-secret",
  appUrl: process.env.SHOPIFY_APP_URL || "https://your-app-url.com",
  scopes: ["read_products", "write_products", "read_orders"],
  hostName: process.env.HOST || "localhost",
  sessionStorage,
  restResources
});
var addDocumentResponseHeaders = shopify.addDocumentResponseHeaders, authenticate = shopify.authenticate, unauthenticated = shopify.unauthenticated;

// app/routes/auth.tsx
var loader = async ({ request }) => {
  let { admin } = await authenticate.admin(request), shop = new URL(request.url).searchParams.get("shop");
  throw shop ? redirect(`/app?shop=${shop}`) : redirect("/app");
};

// app/routes/app.tsx
var app_exports = {};
__export(app_exports, {
  default: () => App2,
  loader: () => loader2
});
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { useLoaderData, useFetcher } from "@remix-run/react";

// app/data/surveyStore.ts
var SurveyStore = class {
  responses = [];
  async saveSurveyResponse(data) {
    let response = {
      id: `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...data
    };
    return this.responses.push(response), console.log("Survey response saved:", response), response;
  }
  async getSurveyResponses(shopDomain) {
    let filtered = this.responses;
    return shopDomain && (filtered = this.responses.filter((r) => r.shopDomain === shopDomain)), filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getSurveyResponse(id) {
    return this.responses.find((r) => r.id === id);
  }
  async getSurveyResponseBySessionKey(sessionKey) {
    return this.responses.find((r) => r.sessionKey === sessionKey);
  }
  // For debugging - get all responses
  getAllResponses() {
    return [...this.responses];
  }
}, surveyStore = new SurveyStore();

// app/routes/app.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var loader2 = async ({ request }) => {
  let { admin, session } = await authenticate.admin(request);
  return { responses: await surveyStore.getSurveyResponses(session.shop), shop: session.shop };
};
function App2() {
  let { responses, shop } = useLoaderData(), fetcher = useFetcher(), formatDate = (dateString) => new Date(dateString).toLocaleString(), getRatingStars = (rating) => "\u2605".repeat(rating) + "\u2606".repeat(5 - rating);
  return /* @__PURE__ */ jsxDEV3(AppProvider, { apiKey: process.env.SHOPIFY_API_KEY || "dev-key", children: /* @__PURE__ */ jsxDEV3("div", { style: { padding: "20px", fontFamily: "system-ui, sans-serif" }, children: [
    /* @__PURE__ */ jsxDEV3("h1", { children: "\u{1F4CA} Survey & Session Replay Dashboard" }, void 0, !1, {
      fileName: "app/routes/app.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV3("p", { children: [
      "Shop: ",
      /* @__PURE__ */ jsxDEV3("strong", { children: shop }, void 0, !1, {
        fileName: "app/routes/app.tsx",
        lineNumber: 32,
        columnNumber: 18
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/app.tsx",
      lineNumber: 32,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { style: { marginTop: "30px" }, children: [
      /* @__PURE__ */ jsxDEV3("h2", { children: [
        "Survey Responses (",
        responses.length,
        ")"
      ] }, void 0, !0, {
        fileName: "app/routes/app.tsx",
        lineNumber: 35,
        columnNumber: 11
      }, this),
      responses.length === 0 ? /* @__PURE__ */ jsxDEV3("div", { style: {
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        border: "2px dashed #ccc"
      }, children: /* @__PURE__ */ jsxDEV3("p", { style: { color: "#666", fontSize: "18px" }, children: "No survey responses yet. Once customers complete checkout and fill out the survey, you'll see their feedback here." }, void 0, !1, {
        fileName: "app/routes/app.tsx",
        lineNumber: 45,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/routes/app.tsx",
        lineNumber: 38,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV3("div", { style: { display: "grid", gap: "20px" }, children: responses.map((response) => /* @__PURE__ */ jsxDEV3("div", { style: {
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#fafafa"
      }, children: [
        /* @__PURE__ */ jsxDEV3("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }, children: [
          /* @__PURE__ */ jsxDEV3("div", { children: [
            /* @__PURE__ */ jsxDEV3("h3", { style: { margin: "0 0 5px 0", fontSize: "16px" }, children: [
              "Order #",
              response.orderNumber
            ] }, void 0, !0, {
              fileName: "app/routes/app.tsx",
              lineNumber: 61,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV3("p", { style: { margin: "0", color: "#666", fontSize: "14px" }, children: formatDate(response.createdAt) }, void 0, !1, {
              fileName: "app/routes/app.tsx",
              lineNumber: 64,
              columnNumber: 23
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/app.tsx",
            lineNumber: 60,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { style: {
            backgroundColor: "#e3f2fd",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#1976d2"
          }, children: [
            "Session: ",
            response.sessionKey.slice(-8)
          ] }, void 0, !0, {
            fileName: "app/routes/app.tsx",
            lineNumber: 68,
            columnNumber: 21
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/app.tsx",
          lineNumber: 59,
          columnNumber: 19
        }, this),
        response.answers.satisfaction && /* @__PURE__ */ jsxDEV3("div", { style: { marginBottom: "15px" }, children: [
          /* @__PURE__ */ jsxDEV3("p", { style: { margin: "0 0 5px 0", fontWeight: "500" }, children: "Satisfaction Rating:" }, void 0, !1, {
            fileName: "app/routes/app.tsx",
            lineNumber: 82,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { style: { fontSize: "20px", color: "#ff9800" }, children: [
            getRatingStars(response.answers.satisfaction),
            " (",
            response.answers.satisfaction,
            "/5)"
          ] }, void 0, !0, {
            fileName: "app/routes/app.tsx",
            lineNumber: 85,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/app.tsx",
          lineNumber: 81,
          columnNumber: 21
        }, this),
        response.answers.feedback && /* @__PURE__ */ jsxDEV3("div", { children: [
          /* @__PURE__ */ jsxDEV3("p", { style: { margin: "0 0 5px 0", fontWeight: "500" }, children: "Additional Feedback:" }, void 0, !1, {
            fileName: "app/routes/app.tsx",
            lineNumber: 94,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV3("div", { style: {
            backgroundColor: "#fff",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            fontStyle: "italic"
          }, children: [
            '"',
            response.answers.feedback,
            '"'
          ] }, void 0, !0, {
            fileName: "app/routes/app.tsx",
            lineNumber: 97,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/app.tsx",
          lineNumber: 93,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { style: { marginTop: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }, children: /* @__PURE__ */ jsxDEV3("p", { style: { margin: "0", fontSize: "12px", color: "#666" }, children: "\u{1F52E} Session replay will be available in the next phase" }, void 0, !1, {
          fileName: "app/routes/app.tsx",
          lineNumber: 111,
          columnNumber: 21
        }, this) }, void 0, !1, {
          fileName: "app/routes/app.tsx",
          lineNumber: 110,
          columnNumber: 19
        }, this)
      ] }, response.id, !0, {
        fileName: "app/routes/app.tsx",
        lineNumber: 53,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/app.tsx",
        lineNumber: 51,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/app.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/app.tsx",
    lineNumber: 30,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/app.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-ZBFX2CSW.js", imports: ["/build/_shared/chunk-O4BRYNJ4.js", "/build/_shared/chunk-MJEOVNB2.js", "/build/_shared/chunk-GDLVTR7C.js", "/build/_shared/chunk-XGOTYLZ5.js", "/build/_shared/chunk-U4FRFQSK.js", "/build/_shared/chunk-7M6SC7J5.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-Q5K5QJO6.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-UYQ3UWUM.js", imports: ["/build/_shared/chunk-B43JI2TA.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-Y5GF3WRX.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "8b7e95c9", hmr: { runtime: "/build/_shared/chunk-GDLVTR7C.js", timestamp: 1760573944614 }, url: "/build/manifest-8B7E95C9.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
