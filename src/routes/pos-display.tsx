import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/pos-display")({
  beforeLoad: () => {
    throw redirect({ to: "/pos" });
  },
});
