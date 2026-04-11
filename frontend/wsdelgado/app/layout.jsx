import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const garet = localFont({
  src: [
    {
      path: "../components/fonts/Garet-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/fonts/Garet-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-garet",
});

export const metadata = {
  title: "WSDelgado Builders | Expert Construction & Renovation Services",
  description: "WSDelgado Builders provides professional demolition, glassworks, and renovation services with precision and excellence. Build your dreams with the best in the industry.",
  keywords: "construction, renovation, demolition, glassworks, WSDelgado, builders, Philippines",
  author: "WSDelgado Builders",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "WSDelgado Builders | Premium Construction Services",
    description: "Expert demolition, glassworks, and renovation services building dreams with precision.",
    type: "website",
    url: "https://wsdelgado.com",
    siteName: "WSDelgado Builders",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${garet.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
