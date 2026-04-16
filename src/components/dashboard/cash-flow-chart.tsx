
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { useIsClient } from "@/hooks/use-is-client"

const data = [
  { month: "Jan", income: 1860, expenses: 800 },
  { month: "Feb", income: 2050, expenses: 950 },
  { month: "Mar", income: 2370, expenses: 1200 },
  { month: "Apr", income: 1980, expenses: 1100 },
  { month: "May", income: 2540, expenses: 1300 },
  { month: "Jun", income: 2340, expenses: 1150 },
]

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--accent))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--primary))",
  },
}

export function CashFlowChart({ currency = 'FC' }: { currency?: string }) {
    const isClient = useIsClient();

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Cash Flow</CardTitle>
                    <CardDescription>Income vs. Expenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                        Loading Chart...
                    </div>
                </CardContent>
            </Card>
        );
    }
  return (
    <Card className="red-box-shadow">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Your income vs. expenses over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currency}${value}`} />
                  <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="income" fill={chartConfig.income.color} radius={4} />
                  <Bar dataKey="expenses" fill={chartConfig.expenses.color} radius={4} />
                  </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No cash flow data available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
