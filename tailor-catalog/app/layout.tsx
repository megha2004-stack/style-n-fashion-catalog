import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style N Fashion",
  description: "Boutique Blouse Design Archive",
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