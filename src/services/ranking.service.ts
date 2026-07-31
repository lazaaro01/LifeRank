import { userRepository } from "@/repositories/user.repository";

export const rankingService = {
  async getGlobalRanking(currentUserId: string, limit = 50) {
    const topUsers = await userRepository.listTopByXp(limit);

    const ranked = topUsers.map((user, index) => ({
      rank: index + 1,
      user,
    }));

    const isCurrentUserRanked = ranked.some((entry) => entry.user.id === currentUserId);

    let currentUserEntry = ranked.find((entry) => entry.user.id === currentUserId) ?? null;

    if (!isCurrentUserRanked) {
      const currentUser = await userRepository.findById(currentUserId);
      if (currentUser) {
        const higherCount = await userRepository.countWithHigherXp(currentUser.xp);
        currentUserEntry = { rank: higherCount + 1, user: currentUser };
      }
    }

    return { ranked, currentUserEntry };
  },
};

export type GlobalRanking = Awaited<
  ReturnType<typeof rankingService.getGlobalRanking>
>;
