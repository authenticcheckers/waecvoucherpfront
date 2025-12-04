import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "WAEC e-Vouchers Hub",
  description: "Purchase WAEC WASSCE, BECE and School Placement vouchers instantly."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
