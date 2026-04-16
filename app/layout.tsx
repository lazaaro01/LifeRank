import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
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
        <Toaster position="top-center" richColors />
        <LifeRankProvider>{children}</LifeRankProvider>
      </body>
    </html>
  );
}