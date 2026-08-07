"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardData } from "@/services/dashboard.service";

const chartConfig = {
  points: {
    label: "Pontos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function EvolutionChart({ data }: { data: DashboardData["evolution"] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[160px] w-full sm:h-[220px]">
      <AreaChart data={data} margin={{ left: 0, right: 0 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.3} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: string) =>
            new Date(value).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })
              }
            />
          }
        />
        <defs>
          <linearGradient id="pointsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-points)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-points)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="points"
          type="monotone"
          fill="url(#pointsFill)"
          stroke="var(--color-points)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
