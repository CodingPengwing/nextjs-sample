import "@/app/ui/global.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { inter } from "@/app/ui/fonts";
import AuthProvider from "./context/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AuthProvider>
          <body className={`${inter.className} antialiased`}>{children}</body>
        </AuthProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
