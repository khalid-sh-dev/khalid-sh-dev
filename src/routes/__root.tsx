import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "خالد الشريف" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:site_name", content: "المهندس خالد الشريف" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/uh0EqmZz67W574EXlJwu0gFVTpD3/social-images/social-1777470075755-1777394175947.webp" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:alt", content: "المهندس خالد الشريف — أتمتة التسويق والنمو" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/uh0EqmZz67W574EXlJwu0gFVTpD3/social-images/social-1777470075755-1777394175947.webp" },
      { name: "twitter:image:alt", content: "المهندس خالد الشريف — أتمتة التسويق والنمو" },
      { name: "theme-color", content: "#0b1426" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "خالد الشريف" },
      { title: "المهندس خالد الشريف | Khalid Sh" },
      { property: "og:title", content: "المهندس خالد الشريف | Khalid Sh" },
      { name: "twitter:title", content: "المهندس خالد الشريف | Khalid Sh" },
      { name: "description", content: "A professional Arabic website for Engineer Khalid Alsharif, specializing in marketing automation and growth." },
      { property: "og:description", content: "A professional Arabic website for Engineer Khalid Alsharif, specializing in marketing automation and growth." },
      { name: "twitter:description", content: "A professional Arabic website for Engineer Khalid Alsharif, specializing in marketing automation and growth." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icons/icon-512.png" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
    ],
    scripts: GA_ID
      ? [
          { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
          {
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
          },
        ]
      : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
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
  return <Outlet />;
}
