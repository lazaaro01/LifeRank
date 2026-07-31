export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-2 px-6 text-center">
        <span className="font-heading pb-4 text-4xl uppercase sm:text-5xl">
          LifeRank
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-8 pb-8 text-sm font-medium tracking-wide uppercase opacity-80">
          <span>Termos</span>
          <span>Privacidade</span>
          <span>Suporte</span>
          <span>Contato</span>
        </nav>
        <p className="text-xs tracking-wide uppercase opacity-60">
          © {new Date().getFullYear()} LifeRank. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
