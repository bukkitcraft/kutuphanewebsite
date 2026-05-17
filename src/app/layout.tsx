import type { Metadata } from "next";
import "./globals.css";
import { NavShell } from "@/components/NavShell";

export const metadata: Metadata = {
  title: "Kütüphane ve Haber Blog",
  description: "Kütüphane ve haber içerik platformu"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <NavShell />
        <main className="container-main py-8">{children}</main>
      </body>
    </html>
  );
}
