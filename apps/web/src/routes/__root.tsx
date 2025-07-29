import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "minekraft",
      },
      {
        name: "description",
        content: "minekraft is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex h-screen w-screen flex-col">
          {isFetching && (
            <div className="fixed top-0 left-0 z-50 h-1 w-full">
              <div className="h-full animate-pulse bg-primary" />
            </div>
          )}
          <Outlet />
        </div>
        <Toaster />
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  );
}
