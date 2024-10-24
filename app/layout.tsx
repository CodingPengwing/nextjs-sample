import "@/app/ui/global.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { inter } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </AppRouterCacheProvider>
    </html>
  );
}
