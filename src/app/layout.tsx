import type { Metadata } from "next";
import ThemeRegistry from "@/app/ThemeRegistry";
import '@/app/global.css';
import { roboto } from '@/app/fonts';

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "Track and analyze your trades",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
