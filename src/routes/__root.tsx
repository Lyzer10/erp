import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getLanguage, useTranslate } from "../lib/i18n";

function NotFoundComponent() {
  const lang = getLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md p-10 text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {lang === "en" ? "Page not found" : "Ukurasa haujapatikana"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "en" 
            ? "The page you're looking for doesn't exist or has been moved." 
            : "Ukurasa unaotafuta haupo au umehamishwa."
          }
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            {lang === "en" ? "Go to Dashboard" : "Nenda Dashibodi"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const lang = getLanguage();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {lang === "en" ? "This page didn't load" : "Ukurasa huu haukupakizwa"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "en" 
            ? "Something went wrong. Try refreshing or head back home." 
            : "Kuna kitu kimeenda vibaya. Jaribu kupakia upya au rudi nyumbani."
          }
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {lang === "en" ? "Try again" : "Jaribu tena"}
          </button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            {lang === "en" ? "Go home" : "Rudi Nyumbani"}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "DeveleERP — Enterprise Suite" },
      { name: "description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { name: "author", content: "DeveleICT" },
      { property: "og:title", content: "DeveleERP — Enterprise Suite" },
      { property: "og:description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://develeerp.vercel.app/" },
      { property: "og:image", content: "https://develeerp.vercel.app/devele-logo.png" },
      { property: "og:image:alt", content: "DeveleERP — Enterprise Suite" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "DeveleERP — Enterprise Suite" },
      { name: "twitter:description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { name: "twitter:image", content: "https://develeerp.vercel.app/devele-logo.png" },
    ],
    links: [
      { rel: "icon", href: "/devele-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/devele-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = getLanguage();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
