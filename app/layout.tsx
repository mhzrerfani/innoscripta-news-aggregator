import type React from "react";
import { Lora } from "next/font/google";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Lora({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={playfair.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
