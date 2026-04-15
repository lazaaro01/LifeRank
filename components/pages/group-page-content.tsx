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
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="grid gap-6">
        <Panel>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Criar grupo</p>
          <h2 className="mt-2 text-2xl font-semibold text-accent-slate">Monte seu squad de produtividade</h2>

          <div className="mt-5 grid gap-4">
            <input
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400"
              placeholder="Nome do grupo"
            />
            <button
              onClick={() => groupName.trim() && createGroup(groupName.trim())}
              className="rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white"
            >
              Criar grupo
            </button>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Entrar em grupo</p>
          <p className="mt-2 text-sm text-slate-500">
            Como nao existe backend, o codigo e ficticio e cria um grupo local para validacao do fluxo.
          </p>
          <div className="mt-5 grid gap-4">
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-400"
              placeholder="Codigo do grupo"
            />
            <button
              onClick={() => inviteCode.trim() && joinGroup(inviteCode.trim())}
              className="rounded-2xl bg-accent-coral px-4 py-3 font-semibold text-white"
            >
              Entrar com codigo
            </button>
          </div>
        </Panel>
      </div>

      <Panel className="bg-[linear-gradient(145deg,#ffffff,#fff7e8)]">
        {group ? (
          <>
            <p className="text-sm uppercase tracking-[0.22em] text-brand-600">Grupo atual</p>
            <h2 className="mt-2 text-2xl font-semibold text-accent-slate">{group.name}</h2>
            <p className="mt-2 text-sm text-slate-500">Codigo do grupo: {group.code}</p>

            <div className="mt-6 grid gap-3">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 rounded-3xl bg-white p-4">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-brand-100">
                    {member.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-semibold text-accent-slate">{member.name}</p>
                    <p className="text-sm text-slate-500">
                      {member.id === profile.id ? "Voce" : "Membro do grupo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-2xl font-semibold text-accent-slate">Nenhum grupo configurado</h2>
            <p className="mt-3 text-sm text-slate-500">
              Crie um grupo ou use um codigo ficticio para habilitar ranking, calendario e comparacao com outros membros.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}