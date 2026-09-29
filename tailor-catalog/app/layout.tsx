import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Design Catalog | Style-N-Fashion",
    template: "%s | Style-N-Fashion",
  },
  description:
    "Browse hundreds of blouse, kurti, chudidar, lehenga and gown stitching designs from Style-N-Fashion, Nagarbhavi, Bengaluru. Find your inspiration, then visit us to place your order.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
