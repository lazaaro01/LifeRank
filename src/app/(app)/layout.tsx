import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { userService } from "@/services/user.service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await userService.getProfile(session.user.id);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        user={{
          name: session.user.name ?? session.user.username,
          avatarUrl: profile?.avatarUrl ?? null,
        }}
      />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
