export const metadata = {
  title: "AppYourStyle",
  description:
    "KI für Größen, Outfits, Reisen und passende Style-Empfehlungen.",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
