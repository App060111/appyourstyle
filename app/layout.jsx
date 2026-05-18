import './globals.css';

export const metadata = {
  title: 'AppYourStyle — Fashion Size Intelligence',
  description: 'Google Translate für Fashiongrößen. Marken, Fits, Schuhe, Babygrößen und internationale Größenlogik.',
  metadataBase: new URL('https://appyourstyle.com'),
  openGraph: {
    title: 'AppYourStyle — Fashion Size Intelligence',
    description: 'Google Translate für Fashiongrößen.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return <html lang="de"><body>{children}</body></html>;
}
