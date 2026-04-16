
"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bitcoin, ArrowUp, ArrowDown, LineChart, Banknote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

type Crypto = "BTC" | "ETH";

type PriceData = {
  name: string;
  BTC: number;
  ETH: number;
};

const INITIAL_FC_BALANCE = 25000;
const INITIAL_BTC_PRICE = 5500000; // in FC
const INITIAL_ETH_PRICE = 300000; // in FC

const generatePriceHistory = (): PriceData[] => {
  const data = [];
  let btc = INITIAL_BTC_PRICE;
  let eth = INITIAL_ETH_PRICE;
  for (let i = 11; i >= 0; i--) {
    btc += btc * (Math.random() - 0.45) * 0.2;
    eth += eth * (Math.random() - 0.45) * 0.2;
    data.push({
      name: `${i}m ago`,
      BTC: Math.max(0, btc),
      ETH: Math.max(0, eth),
    });
  }
  return data.reverse();
};

const chartConfig = {
  BTC: { label: "BTC", color: "hsl(var(--chart-1))" },
  ETH: { label: "ETH", color: "hsl(var(--chart-2))" },
};

export function DigiBitcoinClient() {
  const { toast } = useToast();
  const isClient = useIsClient();

  const [prices, setPrices] = useState({ BTC: INITIAL_BTC_PRICE, ETH: INITIAL_ETH_PRICE });
  const [balances, setBalances] = useState({ FC: INITIAL_FC_BALANCE, BTC: 0, ETH: 0 });
  const [priceHistory, setPriceHistory] = useState<PriceData[]>(generatePriceHistory());
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<Crypto>("BTC");
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [priceChanges, setPriceChanges] = useState({ BTC: 0, ETH: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices => {
        const btcChange = (Math.random() - 0.5) * 0.02;
        const ethChange = (Math.random() - 0.5) * 0.03;
        const newBtcPrice = Math.max(100000, prevPrices.BTC * (1 + btcChange));
        const newEthPrice = Math.max(10000, prevPrices.ETH * (1 + ethChange));
        
        setPriceChanges({ BTC: btcChange * 100, ETH: ethChange * 100 });

        setPriceHistory(prevHistory => {
            const newHistory = [...prevHistory.slice(1), { name: "now", BTC: newBtcPrice, ETH: newEthPrice }];
            return newHistory.map((d, i) => ({...d, name: i === newHistory.length -1 ? 'now' : `${11-i}m ago`}));
        });
        
        return { BTC: newBtcPrice, ETH: newEthPrice };
      });
    }, 3000); // Update prices every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const totalCryptoValue = balances.BTC * prices.BTC + balances.ETH * prices.ETH;
  const totalPortfolioValue = balances.FC + totalCryptoValue;
  const initialPortfolioValue = INITIAL_FC_BALANCE;
  const portfolioChange = totalPortfolioValue - initialPortfolioValue;
  const portfolioChangePercent = (portfolioChange / initialPortfolioValue) * 100;

  const handleTransaction = () => {
    const fcAmount = parseFloat(amount);
    if (isNaN(fcAmount) || fcAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive FC amount.", variant: "destructive" });
      return;
    }

    if (tradeAction === 'buy') {
      if (fcAmount > balances.FC) {
        toast({ title: "Insufficient Funds", description: "You don't have enough FC.", variant: "destructive" });
        return;
      }
      const cryptoAmount = fcAmount / prices[activeTab];
      setBalances(prev => ({
        ...prev,
        FC: prev.FC - fcAmount,
        [activeTab]: prev[activeTab] + cryptoAmount,
      }));
      toast({ title: "Purchase Successful!", description: `You bought ${cryptoAmount.toFixed(6)} ${activeTab}.` });
    } else { // Sell
      const cryptoAmountToSell = fcAmount / prices[activeTab];
      if (cryptoAmountToSell > balances[activeTab]) {
        toast({ title: "Insufficient Crypto", description: `You don't have enough ${activeTab} to sell.`, variant: "destructive" });
        return;
      }
      setBalances(prev => ({
        ...prev,
        FC: prev.FC + fcAmount,
        [activeTab]: prev[activeTab] - cryptoAmountToSell,
      }));
      toast({ title: "Sale Successful!", description: `You sold ${cryptoAmountToSell.toFixed(6)} ${activeTab}.` });
    }
    setAmount("");
  };
  
  const PriceCard = ({ crypto, price, change }: { crypto: Crypto, price: number, change: number }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{crypto} Price</CardTitle>
        <Bitcoin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">FC {price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <p className={cn("text-xs flex items-center", change >= 0 ? "text-green-500" : "text-red-500")}>
          {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {change.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );

  if (!isClient) {
    return <div className="h-96 w-full rounded-lg bg-muted animate-pulse"></div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PriceCard crypto="BTC" price={prices.BTC} change={priceChanges.BTC} />
        <PriceCard crypto="ETH" price={prices.ETH} change={priceChanges.ETH} />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">FC {totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <p className={cn("text-xs flex items-center", portfolioChange >= 0 ? "text-green-500" : "text-red-500")}>
                    {portfolioChange >= 0 ? "+" : ""}
                    {portfolioChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    ({portfolioChangePercent.toFixed(2)}%)
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Your Balances</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span>FC:</span> <span className="font-mono">{balances.FC.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>BTC:</span> <span className="font-mono">{balances.BTC.toFixed(6)}</span></div>
                <div className="flex justify-between"><span>ETH:</span> <span className="font-mono">{balances.ETH.toFixed(6)}</span></div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Crypto Price History</CardTitle>
            <CardDescription>Volatility means prices can change rapidly. Never invest more than you can afford to lose.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart data={priceHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `FC ${value / 1000}k`} />
                    <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                    <Area type="monotone" dataKey="BTC" stroke={chartConfig.BTC.color} fillOpacity={0.2} fill="url(#colorBTC)" />
                    <Area type="monotone" dataKey="ETH" stroke={chartConfig.ETH.color} fillOpacity={0.2} fill="url(#colorETH)" />
                     <defs>
                        <linearGradient id="colorBTC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartConfig.BTC.color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartConfig.BTC.color} stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorETH" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartConfig.ETH.color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartConfig.ETH.color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as Crypto)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="BTC">BTC</TabsTrigger>
                <TabsTrigger value="ETH">ETH</TabsTrigger>
            </TabsList>
            <TabsContent value="BTC">
                <TradeCard crypto="BTC" balances={balances} prices={prices} action={tradeAction} onActionChange={setTradeAction} amount={amount} onAmountChange={setAmount} onTrade={handleTransaction} />
            </TabsContent>
            <TabsContent value="ETH">
                <TradeCard crypto="ETH" balances={balances} prices={prices} action={tradeAction} onActionChange={setTradeAction} amount={amount} onAmountChange={setAmount} onTrade={handleTransaction}/>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface TradeCardProps {
    crypto: Crypto;
    balances: { FC: number; BTC: number; ETH: number };
    prices: { BTC: number; ETH: number };
    action: 'buy' | 'sell';
    onActionChange: (action: 'buy' | 'sell') => void;
    amount: string;
    onAmountChange: (amount: string) => void;
    onTrade: () => void;
}

function TradeCard({ crypto, balances, prices, action, onActionChange, amount, onAmountChange, onTrade }: TradeCardProps) {
    const cryptoBalance = balances[crypto];
    const price = prices[crypto];
    const fcAmount = parseFloat(amount);
    const cryptoAmount = isNaN(fcAmount) ? 0 : fcAmount / price;
    
    return (
        <Tabs value={action} onValueChange={(val) => onActionChange(val as 'buy' | 'sell')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy"><ArrowUp className="mr-2 h-4 w-4 text-green-500" /> Buy {crypto}</TabsTrigger>
                <TabsTrigger value="sell"><ArrowDown className="mr-2 h-4 w-4 text-red-500" /> Sell {crypto}</TabsTrigger>
            </TabsList>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>{action === 'buy' ? 'Buy' : 'Sell'} {crypto}</CardTitle>
                    <CardDescription>
                        {action === 'buy' ? `FC Balance: ${balances.FC.toFixed(2)}` : `${crypto} Balance: ${cryptoBalance.toFixed(6)}`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${action}-amount`}>Amount in FC</Label>
                        <Input 
                            id={`${action}-amount`}
                            type="number"
                            placeholder="e.g., 1000"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                        {amount ? `You will ${action} approx. ${cryptoAmount.toFixed(6)} ${crypto}.` : `1 ${crypto} ≈ FC ${price.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={onTrade} variant={action === 'sell' ? 'destructive' : 'default'}>
                        {action === 'buy' ? 'Buy Now' : 'Sell Now'}
                    </Button>
                </CardFooter>
            </Card>
        </Tabs>
    );
}
