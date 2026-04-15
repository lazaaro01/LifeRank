import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { LifeRankProvider } from "@/components/providers/life-rank-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LifeRank",
  description: "MVP de gamificacao de produtividade com ranking, calendario e streaks."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans`}>
        <LifeRankProvider>{children}</LifeRankProvider>
      </body>
    </html>
  );
}