"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SiteHeaderProps = {
  variant?: "full" | "minimal";
  user?: {
    name: string;
    avatarUrl?: string | null;
  } | null;
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ranking", label: "Ranking" },
  { href: "/activities", label: "Histórico" },
  { href: "/clubs", label: "Clubes" },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SiteHeader({ variant = "full", user }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <Link
          href={user ? "/dashboard" : "/"}
          className="font-heading text-primary text-3xl tracking-tight uppercase sm:text-4xl"
        >
          LifeRank
        </Link>

        {variant === "full" && (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-heading pb-2 text-lg uppercase transition-colors ${
                      isActive
                        ? "border-primary text-primary border-b-4"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <Button
                render={<Link href={user ? "/clubs/new" : "/register"} />}
                className="rounded-full uppercase"
              >
                {user ? "Criar clube" : "Criar conta"}
              </Button>
              {user && (
                <Link href="/profile">
                  <Avatar className="border-primary border-2">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
