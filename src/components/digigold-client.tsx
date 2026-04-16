
"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gem, ArrowUp, ArrowDown, LineChart, Banknote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { useIsClient } from "@/hooks/use-is-client";

const GOLD_PRICE_FC = 7000; // Current price of 1 gram of gold in FinovoCurrency

const goldPriceHistory = [
  { month: "Jan", price: 6800 },
  { month: "Feb", price: 6850 },
  { month: "Mar", price: 6950 },
  { month: "Apr", price: 7100 },
  { month: "May", price: 7050 },
  { month: "Jun", price: 7000 },
];

const chartConfig = {
  price: {
    label: "Price (FC)",
    color: "hsl(var(--accent))",
  },
}


export function DigiGoldClient() {
  const { toast } = useToast();
  const isClient = useIsClient();

  const [goldBalanceGrams, setGoldBalanceGrams] = useState(0);
  const [fcBalance, setFcBalance] = useState(10000); // User's starting money
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("buy");

  const goldValue = goldBalanceGrams * GOLD_PRICE_FC;

  const handleTransaction = () => {
    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive number.", variant: "destructive" });
      return;
    }

    if (activeTab === 'buy') {
      if (transactionAmount > fcBalance) {
        toast({ title: "Insufficient Funds", description: "You don't have enough FC to make this purchase.", variant: "destructive" });
        return;
      }
      const goldPurchased = transactionAmount / GOLD_PRICE_FC;
      setFcBalance(prev => prev - transactionAmount);
      setGoldBalanceGrams(prev => prev + goldPurchased);
      toast({ title: "Purchase Successful!", description: `You bought ${goldPurchased.toFixed(4)}g of gold.` });
    } else { // Sell
      const goldToSell = transactionAmount / GOLD_PRICE_FC;
       if (goldToSell > goldBalanceGrams) {
        toast({ title: "Insufficient Gold", description: "You don't have enough gold to sell.", variant: "destructive" });
        return;
      }
      setFcBalance(prev => prev + transactionAmount);
      setGoldBalanceGrams(prev => prev - goldToSell);
      toast({ title: "Sale Successful!", description: `You sold ${goldToSell.toFixed(4)}g of gold.` });
    }

    setAmount("");
  };

  if (!isClient) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
         <div className="h-40 w-full rounded-lg bg-muted animate-pulse"></div>
         <div className="h-40 w-full rounded-lg bg-muted animate-pulse"></div>
         <div className="h-40 w-full rounded-lg bg-muted animate-pulse"></div>
         <div className="lg:col-span-2 h-96 w-full rounded-lg bg-muted animate-pulse"></div>
         <div className="h-96 w-full rounded-lg bg-muted animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-yellow-500/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Gold Price</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">FC {GOLD_PRICE_FC.toLocaleString()}<span className="text-base font-normal text-muted-foreground">/gram</span></div>
            <p className="text-xs text-green-500 flex items-center">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-yellow-500/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Gold Vault</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{goldBalanceGrams.toFixed(4)} g</div>
            <p className="text-xs text-muted-foreground">Current Value: FC {goldValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-yellow-500/20 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your FC Balance</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">FC {fcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Available to spend or invest.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Gold Price History (6 Months)</CardTitle>
            <CardDescription>Understanding the value of investments over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart data={goldPriceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `FC ${value / 1000}k`} />
                    <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area type="monotone" dataKey="price" stroke={chartConfig.price.color} fillOpacity={0.4} fill={`url(#colorPrice)`} />
                     <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">
                    <ArrowUp className="mr-2 h-4 w-4 text-green-500" /> Buy Gold
                </TabsTrigger>
                <TabsTrigger value="sell">
                    <ArrowDown className="mr-2 h-4 w-4 text-red-500" /> Sell Gold
                </TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
                <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Buy DigiGold</CardTitle>
                    <CardDescription>Invest your FinovoCurrency in digital gold.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="buy-amount">Amount in FC</Label>
                        <Input 
                            id="buy-amount"
                            type="number"
                            placeholder="e.g., 1000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                        {amount ? `You will get approx. ${(parseFloat(amount) / GOLD_PRICE_FC).toFixed(4)}g of gold.` : `1 gram of gold is FC ${GOLD_PRICE_FC}.`}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleTransaction}>Buy Now</Button>
                </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="sell">
                <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Sell DigiGold</CardTitle>
                    <CardDescription>Convert your digital gold back to FinovoCurrency.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sell-amount">Amount in FC</Label>
                        <Input 
                            id="sell-amount"
                            type="number"
                            placeholder="e.g., 700"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                         {amount ? `You will sell approx. ${(parseFloat(amount) / GOLD_PRICE_FC).toFixed(4)}g of gold.` : `Your balance: ${goldBalanceGrams.toFixed(4)}g`}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" className="w-full" onClick={handleTransaction}>Sell Now</Button>
                </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
