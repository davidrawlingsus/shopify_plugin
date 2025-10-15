import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.shopify.com/shopifycloud/app-bridge.css" },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Survey & Session Replay App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
