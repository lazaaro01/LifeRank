"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { useLifeRank } from "@/components/providers/life-rank-provider";

export function GroupPageContent() {
  const { profile, group, createGroup, joinGroup } = useLifeRank();
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  if (!profile) {
    return (
      <EmptyState
        title="Crie seu perfil antes do grupo"
        description="O grupo usa seu nome e sua foto para formar o ranking e o feed."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-6">
        <Panel className="p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-brand-600 font-black">Criar grupo</p>
          <h2 className="mt-2 text-xl md:text-2xl font-bold text-accent-slate">Monte seu squad</h2>

          <div className="mt-6 flex flex-col gap-3">
            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 outline-none transition-all focus:border-brand-400 focus:bg-white"
              placeholder="Nome do grupo (Ex: Os Brutos)"
            />
            <button
              onClick={() => groupName.trim() && createGroup(groupName.trim())}
              className="rounded-2xl bg-brand-600 px-4 py-4 font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-700 active:scale-95"
            >
              Criar grupo agora
            </button>
          </div>
        </Panel>

        <Panel className="p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-brand-600 font-black">Entrar em grupo</p>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Insira o código enviado pelo seu líder.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 outline-none transition-all focus:border-brand-400 focus:bg-white text-center font-bold tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
              placeholder="Código LIFE123"
            />
            <button
              onClick={() => inviteCode.trim() && joinGroup(inviteCode.trim())}
              className="rounded-2xl bg-accent-slate px-4 py-4 font-bold text-white shadow-lg shadow-slate-500/10 transition-all hover:bg-black active:scale-95"
            >
              Entrar no Squad
            </button>
          </div>
        </Panel>
      </div>

      <Panel className="p-6 md:p-10 bg-[linear-gradient(145deg,#ffffff,#fffcf5)] border-brand-100">
        {group ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-600 font-black">Grupo ativo</p>
                <h2 className="mt-2 text-3xl font-black text-accent-slate">{group.name}</h2>
              </div>
              <div className="rounded-2xl bg-brand-50 px-4 py-2 border border-brand-100">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest leading-none">Código</p>
                <p className="text-sm font-black text-accent-slate mt-1">{group.code}</p>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Membros do Squad ({group.members.length})</p>
            <div className="grid gap-3">
              {group.members.map((member) => (
                <div key={member.id} className="group flex items-center gap-4 rounded-3xl bg-white/50 p-4 border border-slate-50 transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                    {member.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                       <div className="flex h-full w-full items-center justify-center text-slate-300">
                         <span className="text-xl font-bold">{member.name[0]}</span>
                       </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-accent-slate">{member.name}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {member.id === profile.id ? "Você (Líder)" : "Membro ativo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col justify-center text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-[32px] bg-brand-50 flex items-center justify-center text-3xl grayscale opacity-50">
              👥
            </div>
            <h2 className="text-2xl font-bold text-accent-slate">Nenhum grupo ativo</h2>
            <p className="mx-auto mt-4 max-w-[280px] text-sm text-slate-500 leading-relaxed">
              Crie um novo grupo ou entre em um através de um convite para começar a competir.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}