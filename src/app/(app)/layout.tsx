import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        user={{
          name: session.user.name ?? session.user.username,
          avatarUrl: session.user.avatarUrl,
        }}
      />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
