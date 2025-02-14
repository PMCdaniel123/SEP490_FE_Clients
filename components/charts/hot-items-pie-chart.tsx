"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "p1", visitors: 275, fill: "var(--color-p1)" },
  { browser: "p2", visitors: 200, fill: "var(--color-p2)" },
  { browser: "p3", visitors: 287, fill: "var(--color-p3)" },
  { browser: "p4", visitors: 173, fill: "var(--color-p4)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Lượt mua",
  },
  p1: {
    label: "Trà sữa chân châu đường đen",
    color: "#67CADF",
  },
  p2: {
    label: "Matcha Latte",
    color: "#27D095",
  },
  p3: {
    label: "Cà phê muối",
    color: "#FF8E29",
  },
  p4: {
    label: "Coco Matcha",
    color: "#F54F5F",
  },
  other: {
    label: "Khác",
    color: "#fcba03",
  },
} satisfies ChartConfig;

export default function HotItemsPieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center mt-4">
        <CardTitle>Các sản phẩm nổi bật</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Lượt mua
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="flex flex-col gap-4 items-start"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
