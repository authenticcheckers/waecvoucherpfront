import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "VoucherHub Ghana | Official WAEC E-Vouchers",
  description: "Instant delivery of WASSCE, BECE, and School Placement checkers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-grid">{children}</body>
    </html>
  );
}
