import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Begin loading the next route as soon as a user shows intent to open it.
    // These routes use TanStack Router loaders directly (not React Query), so
    // a zero preload stale time caused the same data to be fetched again on click.
    defaultPreload: "intent",
    defaultPreloadDelay: 25,
    defaultPreloadStaleTime: 60_000,
    // Revisiting a recent page should paint immediately. After this short
    // window TanStack Router keeps the previous view visible while refreshing.
    defaultStaleTime: 15_000,
    defaultStaleReloadMode: "background",
  });

  return router;
};
