import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeRank",
  description:
    "Transforme hábitos e atividades do dia a dia em uma experiência gamificada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
