"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/server/actions/auth.actions";

type NavLink = { href: string; label: string };

type MobileNavProps = {
  links: NavLink[];
  pathname: string | null;
  user?: {
    name: string;
    avatarUrl?: string | null;
  } | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function MobileNav({ links, pathname, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
          />
        }
      >
        <Menu className="size-5" />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/30 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex h-full w-72 max-w-[80vw] translate-x-full flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out data-open:translate-x-0">
          <div className="flex items-center justify-between border-b p-6">
            <span className="font-heading text-primary text-2xl uppercase">
              Menu
            </span>
            <DialogPrimitive.Close
              render={
                <Button variant="ghost" size="icon" aria-label="Fechar menu" />
              }
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {user && (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b p-6"
            >
              <Avatar className="border-primary border-2">
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                )}
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="font-heading text-lg uppercase">
                {user.name}
              </span>
            </Link>
          )}

          <nav className="flex flex-1 flex-col gap-1 p-4">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-heading rounded-lg px-4 py-3 text-lg uppercase ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 border-t p-6">
            {user ? (
              <>
                <Button
                  render={<Link href="/clubs/new" onClick={() => setOpen(false)} />}
                  className="w-full rounded-full uppercase"
                >
                  Criar clube
                </Button>
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full rounded-full uppercase"
                  >
                    <LogOut className="size-4" />
                    Sair
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button
                  render={<Link href="/register" onClick={() => setOpen(false)} />}
                  className="w-full rounded-full uppercase"
                >
                  Criar conta
                </Button>
                <Button
                  render={<Link href="/login" onClick={() => setOpen(false)} />}
                  variant="outline"
                  className="w-full rounded-full uppercase"
                >
                  Entrar
                </Button>
              </>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
