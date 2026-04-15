"use client";

import { useEffect, useMemo, useState } from "react";
import { activityCatalog } from "@/lib/constants";
import { defaultStorage, readStorage, writeStorage } from "@/lib/storage";
import { Activity, ActivityType, GroupData, StorageShape, UserProfile } from "@/lib/types";
import {
  createId,
  getAchievements,
  getActivityPoints,
  getDemoMembers,
  getMonthKey,
  getRanking,
  getStreak,
  getTodayKey
} from "@/lib/utils";

type CreateProfileInput = {
  name: string;
  phone: string;
  avatar: string;
};

type AddActivityInput = {
  type: ActivityType;
  label?: string;
  date: string;
  hours?: number;
};

function createSeededActivities(groupId: string) {
  return [
    {
      id: createId("activity"),
      userId: "member_sofia",
      userName: "Sofia",
      groupId,
      type: "study" as const,
      label: activityCatalog.study.label,
      date: getTodayKey(),
      createdAt: new Date().toISOString(),
      points: 20,
      hours: 2
    },
    {
      id: createId("activity"),
      userId: "member_caio",
      userName: "Caio",
      groupId,
      type: "gym" as const,
      label: activityCatalog.gym.label,
      date: getTodayKey(),
      createdAt: new Date().toISOString(),
      points: 10
    }
  ];
}

export function useLifeRankStore() {
  const [storage, setStorage] = useState<StorageShape>(defaultStorage);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const nextStorage = readStorage();
    setStorage(nextStorage);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(storage);
  }, [storage, hydrated]);

  const profile = storage.profile;
  const group = storage.group;
  const activities = storage.activities;
  const monthKey = getMonthKey(getTodayKey());

  const ranking = useMemo(
    () => getRanking(group, profile, activities, monthKey),
    [activities, group, monthKey, profile]
  );

  const myStats = useMemo(() => {
    if (!profile) {
      return {
        totalPoints: 0,
        monthlyPoints: 0,
        streak: 0,
        activitiesCount: 0
      };
    }

    const mine = activities.filter(
      (activity) => activity.userId === profile.id && (!group || activity.groupId === group.id)
    );
    return {
      totalPoints: mine.reduce((total, activity) => total + activity.points, 0),
      monthlyPoints: mine
        .filter((activity) => getMonthKey(activity.date) === monthKey)
        .reduce((total, activity) => total + activity.points, 0),
      streak: getStreak(profile.id, activities),
      activitiesCount: mine.length
    };
  }, [activities, group, monthKey, profile]);

  const achievements = useMemo(() => getAchievements(profile, activities), [activities, profile]);

  function createProfile(input: CreateProfileInput) {
    const nextProfile: UserProfile = {
      id: profile?.id ?? createId("user"),
      name: input.name,
      phone: input.phone,
      avatar: input.avatar,
      createdAt: profile?.createdAt ?? new Date().toISOString()
    };

    setStorage((current) => {
      const updatedGroup =
        current.group && current.group.members.some((member) => member.id === nextProfile.id)
          ? {
              ...current.group,
              members: current.group.members.map((member) =>
                member.id === nextProfile.id
                  ? { ...member, name: nextProfile.name, avatar: nextProfile.avatar }
                  : member
              )
            }
          : current.group;

      return {
        ...current,
        profile: nextProfile,
        group: updatedGroup
      };
    });
  }

  function createGroup(name: string) {
    if (!profile) return;

    const nextGroup: GroupData = {
      id: createId("group"),
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      name,
      createdAt: new Date().toISOString(),
      members: getDemoMembers(profile)
    };

    setStorage((current) => ({
      ...current,
      group: nextGroup,
      activities: [
        ...createSeededActivities(nextGroup.id),
        ...current.activities.filter(
          (activity) => activity.userId === profile.id && activity.groupId === nextGroup.id
        )
      ]
    }));
  }

  function joinGroup(code: string) {
    if (!profile) return;

    const nextGroup: GroupData = {
      id: createId("group"),
      code: code.toUpperCase(),
      name: `Grupo ${code.toUpperCase()}`,
      createdAt: new Date().toISOString(),
      members: getDemoMembers(profile)
    };

    setStorage((current) => ({
      ...current,
      group: nextGroup,
      activities: [
        ...createSeededActivities(nextGroup.id),
        ...current.activities.filter(
          (activity) => activity.userId === profile.id && activity.groupId === nextGroup.id
        )
      ]
    }));
  }

  function addActivity(input: AddActivityInput) {
    if (!profile || !group) return;

    const typeConfig = activityCatalog[input.type];
    const nextActivity: Activity = {
      id: createId("activity"),
      userId: profile.id,
      userName: profile.name,
      groupId: group.id,
      type: input.type,
      label: input.label?.trim() || typeConfig.label,
      date: input.date,
      createdAt: new Date().toISOString(),
      points: getActivityPoints(input.type, input.hours),
      hours: input.type === "study" ? Number(input.hours ?? 1) : undefined
    };

    setStorage((current) => ({
      ...current,
      activities: [nextActivity, ...current.activities]
    }));
  }

  function resetMonthlySimulation() {
    setStorage((current) => ({
      ...current,
      monthlyResetAt: new Date().toISOString()
    }));
  }

  return {
    hydrated,
    profile,
    group,
    activities,
    ranking,
    myStats,
    achievements,
    monthlyResetAt: storage.monthlyResetAt,
    createProfile,
    createGroup,
    joinGroup,
    addActivity,
    resetMonthlySimulation
  };
}