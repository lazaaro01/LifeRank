"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { activityCatalog } from "@/lib/constants";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Activity, ActivityType, GroupData, UserProfile } from "@/lib/types";
import {
  createId,
  getAchievements,
  getActivityPoints,
  getMonthKey,
  getRanking,
  getStreak,
  getTodayKey
} from "@/lib/utils";

export const XP_PER_LEVEL = 200;

export function useLifeRankStore() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const loadActivities = useCallback(async (groupId: string, userId: string) => {
    const { data: acts } = await supabase
      .from("activities")
      .select("*, profiles(name)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (acts) {
      setActivities(acts.map((a: any) => ({
        id: a.id,
        userId: a.profile_id,
        userName: a.profiles?.name || "Usuário",
        groupId: a.group_id,
        type: a.type,
        label: a.label,
        date: a.date,
        points: a.points,
        hours: a.hours,
        createdAt: a.created_at
      })));
    }
  }, []);

  const loadUserGroupAndActivities = useCallback(async (userId: string) => {
    const { data: membership } = await supabase
      .from("memberships")
      .select("group_id, groups(*)")
      .eq("profile_id", userId)
      .single();

    if (membership && membership.groups) {
      const g = membership.groups as any;
      
      const { data: members } = await supabase
        .from("memberships")
        .select("profiles(id, name, avatar_url)")
        .eq("group_id", g.id);

      const groupData: GroupData = {
        id: g.id,
        name: g.name,
        code: g.code,
        createdAt: g.created_at,
        members: (members || []).map((m: any) => ({
          id: m.profiles.id,
          name: m.profiles.name,
          avatar: m.profiles.avatar_url,
          isCurrentUser: m.profiles.id === userId
        }))
      };

      setGroup(groupData);
      await loadActivities(g.id, userId);
    }
  }, [loadActivities]);

  // 2. Inicialização
  useEffect(() => {
    async function init() {
      const localProfile = localStorage.getItem("liferank.profile");
      if (localProfile) {
        const p = JSON.parse(localProfile) as UserProfile;
        
        if (p.id.includes("user_")) {
          localStorage.removeItem("liferank.profile");
          setHydrated(true);
          return;
        }

        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", p.id)
          .single();
        
        if (dbProfile) {
          const mappedProfile: UserProfile = {
            id: dbProfile.id,
            name: dbProfile.name,
            phone: dbProfile.phone,
            avatar: dbProfile.avatar_url,
            createdAt: dbProfile.created_at
          };
          setProfile(mappedProfile);
          await loadUserGroupAndActivities(mappedProfile.id);
        }
      }
      setHydrated(true);
    }
    init();
  }, [loadUserGroupAndActivities]);

  useEffect(() => {
    if (!profile || !group) return;

    const channel = supabase
      .channel(`group-${group.id}`)
      .on(
        "postgres_changes" as any,
        { 
          event: "*", 
          schema: "public", 
          table: "activities", 
          filter: `group_id=eq.${group.id}` 
        },
        () => {
          loadActivities(group.id, profile.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, group?.id, loadActivities]);

  const monthKey = getMonthKey(getTodayKey());

  const ranking = useMemo(
    () => getRanking(group, profile, activities, monthKey),
    [activities, group, monthKey, profile]
  );

  const myStats = useMemo(() => {
    if (!profile) return { totalPoints: 0, monthlyPoints: 0, streak: 0, activitiesCount: 0 };
    const mine = activities.filter((a) => a.userId === profile.id);
    return {
      totalPoints: mine.reduce((t, a) => t + a.points, 0),
      monthlyPoints: mine
        .filter((a) => getMonthKey(a.date) === monthKey)
        .reduce((t, a) => t + a.points, 0),
      streak: getStreak(profile.id, activities),
      activitiesCount: mine.length
    };
  }, [activities, monthKey, profile]);

  const levelInfo = useMemo(() => {
    const totalPoints = myStats.totalPoints;
    const level = Math.floor(totalPoints / XP_PER_LEVEL) + 1;
    const currentXP = totalPoints % XP_PER_LEVEL;
    const progress = (currentXP / XP_PER_LEVEL) * 100;
    return { level, currentXP, progress, xpPerLevel: XP_PER_LEVEL };
  }, [myStats.totalPoints]);

  const achievements = useMemo(() => getAchievements(profile, activities), [activities, profile]);

  const createProfile = useCallback(async (input: { name: string; phone: string; avatar: string }) => {
    const id = profile?.id ?? createId();
    const nextProfile: UserProfile = {
      id,
      name: input.name,
      phone: input.phone,
      avatar: input.avatar,
      createdAt: profile?.createdAt ?? new Date().toISOString()
    };

    const { error } = await supabase.from("profiles").upsert({
      id: nextProfile.id,
      name: nextProfile.name,
      phone: nextProfile.phone,
      avatar_url: nextProfile.avatar,
      created_at: nextProfile.createdAt
    });

    if (!error) {
      setProfile(nextProfile);
      localStorage.setItem("liferank.profile", JSON.stringify(nextProfile));
      toast.success("Perfil salvo com sucesso!");
    } else {
      console.error("Erro Supabase (Profile):", error);
      toast.error("Erro ao salvar perfil.");
    }
  }, [profile]);

  const createGroup = useCallback(async (name: string) => {
    if (!profile) return;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const { data: newGroup } = await supabase
      .from("groups")
      .insert({ name, code, created_by: profile.id })
      .select()
      .single();

    if (newGroup) {
      await supabase
        .from("memberships")
        .insert({ profile_id: profile.id, group_id: newGroup.id });
      
      toast.success(`Grupo ${name} criado!`);
      await loadUserGroupAndActivities(profile.id);
    }
  }, [profile, loadUserGroupAndActivities]);

  const joinGroup = useCallback(async (code: string) => {
    if (!profile) return;
    const { data: g } = await supabase
      .from("groups")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (g) {
      const { error } = await supabase
        .from("memberships")
        .insert({ profile_id: profile.id, group_id: g.id });

      if (!error) {
        toast.success(`Entrou no grupo ${g.name}!`);
        await loadUserGroupAndActivities(profile.id);
      } else {
        toast.error("Você já está no grupo ou erro ao entrar.");
      }
    } else {
      toast.error("Código inválido.");
    }
  }, [profile, loadUserGroupAndActivities]);

  const addActivity = useCallback(async (input: { type: ActivityType; label?: string; date: string; hours?: number }) => {
    if (!profile || !group) return;
    const typeConfig = activityCatalog[input.type];
    const points = getActivityPoints(input.type, input.hours);

    const { error } = await supabase.from("activities").insert({
      profile_id: profile.id,
      group_id: group.id,
      type: input.type,
      label: input.label?.trim() || typeConfig.label,
      points: points,
      hours: input.type === "study" ? Number(input.hours ?? 1) : null,
      date: input.date
    });

    if (!error) {
      toast.success(`+${points} pontos!`, { icon: typeConfig.emoji });
    } else {
      toast.error("Erro ao salvar atividade.");
    }
  }, [profile, group]);

  const loginByName = useCallback(async (name: string) => {
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*")
      .ilike("name", name)
      .single();

    if (dbProfile) {
      const mappedProfile: UserProfile = {
        id: dbProfile.id,
        name: dbProfile.name,
        phone: dbProfile.phone,
        avatar: dbProfile.avatar_url,
        createdAt: dbProfile.created_at
      };
      setProfile(mappedProfile);
      localStorage.setItem("liferank.profile", JSON.stringify(mappedProfile));
      await loadUserGroupAndActivities(mappedProfile.id);
      toast.success(`Bem-vindo de volta, ${mappedProfile.name}!`);
      return true;
    } else {
      toast.error("perfil não encontrado com este nome.");
      return false;
    }
  }, [loadUserGroupAndActivities]);

  const logout = useCallback(() => {
    setProfile(null);
    setGroup(null);
    setActivities([]);
    localStorage.removeItem("liferank.profile");
  }, []);

  return useMemo(() => ({
    hydrated,
    profile,
    group,
    activities,
    ranking,
    myStats,
    levelInfo,
    achievements,
    createProfile,
    createGroup,
    joinGroup,
    addActivity,
    loginByName,
    logout
  }), [
    hydrated,
    profile,
    group,
    activities,
    ranking,
    myStats,
    levelInfo,
    achievements,
    createProfile,
    createGroup,
    joinGroup,
    addActivity,
    loginByName,
    logout
  ]);
}