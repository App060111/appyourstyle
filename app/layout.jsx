import './globals.css';

export const metadata = {
  title: 'AppYourStyle — Universal Size Converter',
  description: 'Google Translate für Fashiongrößen. Finde sofort deine passende Größe bei jeder Marke.',
  metadataBase: new URL('https://appyourstyle.com')
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
