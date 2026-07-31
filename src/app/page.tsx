import { auth } from "@/server/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { AchievementsTeaser } from "@/components/landing/achievements-teaser";
import { CtaSection } from "@/components/landing/cta-section";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        user={
          session?.user
            ? {
                name: session.user.name ?? session.user.username,
                avatarUrl: session.user.avatarUrl,
              }
            : null
        }
      />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <AchievementsTeaser />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
