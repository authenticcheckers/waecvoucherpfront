import "./globals.css";

export const metadata = {
  title: "WAEC E-Voucher Portal",
  description: "Purchase WAEC BECE & SHS school placement checker vouchers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
