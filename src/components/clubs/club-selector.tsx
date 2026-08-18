import Link from "next/link";

type ClubSelectorProps = {
  clubs: { id: string; name: string }[];
  selectedClubId: string | null;
  /** Builds the href for a given club id, preserving other search params (e.g. month/year on the calendar). */
  buildHref: (clubId: string) => string;
};

export function ClubSelector({ clubs, selectedClubId, buildHref }: ClubSelectorProps) {
  if (clubs.length < 2) return null;

  return (
    <div className="bg-muted flex items-center gap-2 overflow-x-auto rounded-full p-2">
      {clubs.map((club) => {
        const isActive = club.id === selectedClubId;
        return (
          <Link
            key={club.id}
            href={buildHref(club.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {club.name}
          </Link>
        );
      })}
    </div>
  );
}
