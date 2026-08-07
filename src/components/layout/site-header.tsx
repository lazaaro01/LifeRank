"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/server/actions/auth.actions";
import { MobileNav } from "@/components/layout/mobile-nav";

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

            <MobileNav links={NAV_LINKS} pathname={pathname} user={user} />

            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <>
                  <Button
                    render={<Link href="/clubs/new" />}
                    className="rounded-full uppercase"
                  >
                    Criar clube
                  </Button>
                  <form action={logoutAction}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Sair"
                      title="Sair"
                    >
                      <LogOut />
                    </Button>
                  </form>
                  <Link href="/profile">
                    <Avatar className="border-primary border-2">
                      {user.avatarUrl && (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      )}
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    render={<Link href="/login" />}
                    variant="outline"
                    className="rounded-full uppercase"
                  >
                    Entrar
                  </Button>
                  <Button
                    render={<Link href="/register" />}
                    className="rounded-full uppercase"
                  >
                    Criar conta
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
