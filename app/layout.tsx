import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/store/StoreProvider";
import ToastProvider from "@/components/toast/ToastProvider"

export const metadata: Metadata = {
  title: "Summarist Home Page",
  description: "Gain more knowledge in less time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
