import "./globals.css";

export const metadata = {
  title: "Waec e-Vouchers Hub",
  description: "Purchase WAEC vouchers instantly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
