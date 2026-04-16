
"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AreaChart as AreaChartIcon, Banknote, TrendingUp, TrendingDown, Newspaper } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type Stock = "AAPL" | "TSLA" | "RELIANCE";

type StockData = {
  ticker: Stock;
  name: string;
  price: number;
  change: number;
  history: { month: string; price: number }[];
};

const initialStocks: Record<Stock, StockData> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 150,
    change: 0,
    history: Array.from({ length: 6 }, (_, i) => ({ month: `${i + 1}`, price: 140 + Math.random() * 20 })),
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 250,
    change: 0,
    history: Array.from({ length: 6 }, (_, i) => ({ month: `${i + 1}`, price: 230 + Math.random() * 40 })),
  },
  RELIANCE: {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    price: 2800,
    change: 0,
    history: Array.from({ length: 6 }, (_, i) => ({ month: `${i + 1}`, price: 2700 + Math.random() * 200 })),
  },
};

const marketEvents = [
    { title: "AI BOOM!", effect: { AAPL: 1.1, TSLA: 1.05, RELIANCE: 1.02 }, description: "A breakthrough in AI has boosted tech stocks!" },
    { title: "MARKET CRASH!", effect: { AAPL: 0.85, TSLA: 0.8, RELIANCE: 0.9 }, description: "Global markets are in turmoil. Stocks are plummeting!" },
    { title: "NEW GOVT BUDGET!", effect: { AAPL: 1.02, TSLA: 0.98, RELIANCE: 1.15 }, description: "The new budget favors domestic industries. Reliance soars!" },
    { title: "INTEREST RATE HIKE!", effect: { AAPL: 0.95, TSLA: 0.9, RELIANCE: 0.98 }, description: "Central bank raises rates, making borrowing more expensive." },
];

const chartConfig = {
  price: { label: "Price", color: "hsl(var(--chart-1))" },
};

export function DigiStockClient() {
  const { toast } = useToast();
  const isClient = useIsClient();
  const [stocks, setStocks] = useState(initialStocks);
  const [portfolio, setPortfolio] = useState<Record<Stock, number>>({ AAPL: 0, TSLA: 0, RELIANCE: 0 });
  const [cashBalance, setCashBalance] = useState(100000);
  const [selectedStock, setSelectedStock] = useState<Stock>("AAPL");
  const [quantity, setQuantity] = useState("");
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [currentEvent, setCurrentEvent] = useState<typeof marketEvents[0] | null>(null);

  useEffect(() => {
    const priceInterval = setInterval(() => {
      setStocks(prevStocks => {
        const newStocks = { ...prevStocks };
        for (const ticker in newStocks) {
          const stock = newStocks[ticker as Stock];
          const change = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5% change
          const newPrice = Math.max(1, stock.price * (1 + change));
          const newHistory = [...stock.history.slice(1), { month: 'now', price: newPrice }];
          newStocks[ticker as Stock] = { ...stock, price: newPrice, change, history: newHistory };
        }
        return newStocks;
      });
    }, 3000); // Update prices every 3 seconds

    const eventInterval = setInterval(() => {
        const event = marketEvents[Math.floor(Math.random() * marketEvents.length)];
        setCurrentEvent(event);
        toast({
            title: `MARKET EVENT: ${event.title}`,
            description: event.description,
            duration: 5000,
        });
        setStocks(prevStocks => {
            const newStocks = { ...prevStocks };
            for (const ticker in event.effect) {
                const stock = newStocks[ticker as Stock];
                const multiplier = event.effect[ticker as Stock];
                newStocks[ticker as Stock] = { ...stock, price: stock.price * multiplier };
            }
            return newStocks;
        });
    }, 20000); // New event every 20 seconds

    return () => {
        clearInterval(priceInterval);
        clearInterval(eventInterval);
    }
  }, []);

  const totalStockValue = useMemo(() => {
    return Object.entries(portfolio).reduce((acc, [ticker, shares]) => {
      return acc + shares * stocks[ticker as Stock].price;
    }, 0);
  }, [portfolio, stocks]);

  const totalPortfolioValue = cashBalance + totalStockValue;
  const initialPortfolioValue = 100000;
  const portfolioChange = totalPortfolioValue - initialPortfolioValue;
  const portfolioChangePercent = (portfolioChange / initialPortfolioValue) * 100;

  const handleTrade = () => {
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a positive number of shares.", variant: "destructive" });
      return;
    }
    
    const stock = stocks[selectedStock];
    const tradeValue = numQuantity * stock.price;

    if (tradeAction === "buy") {
      if (tradeValue > cashBalance) {
        toast({ title: "Insufficient Funds", description: "You don't have enough cash to make this purchase.", variant: "destructive" });
        return;
      }
      setCashBalance(prev => prev - tradeValue);
      setPortfolio(prev => ({ ...prev, [selectedStock]: prev[selectedStock] + numQuantity }));
      toast({ title: "Purchase Successful", description: `You bought ${numQuantity} shares of ${selectedStock}.` });
    } else { // sell
      if (numQuantity > portfolio[selectedStock]) {
        toast({ title: "Insufficient Shares", description: `You don't own enough shares of ${selectedStock} to sell.`, variant: "destructive" });
        return;
      }
      setCashBalance(prev => prev + tradeValue);
      setPortfolio(prev => ({ ...prev, [selectedStock]: prev[selectedStock] - numQuantity }));
      toast({ title: "Sale Successful", description: `You sold ${numQuantity} shares of ${selectedStock}.` });
    }
    setQuantity("");
  };

  if (!isClient) return <div className="h-96 w-full rounded-lg bg-muted animate-pulse"></div>;

  const activeStockData = stocks[selectedStock];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">FC {totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className={cn("text-xs flex items-center", portfolioChange >= 0 ? "text-green-500" : "text-red-500")}>
              {portfolioChange >= 0 ? "+" : ""}FC {portfolioChange.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({portfolioChangePercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">FC {cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Stocks Value</CardTitle>
                <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">FC {totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </CardContent>
        </Card>
        {currentEvent && (
            <Card className="bg-primary/10 border-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-primary">Market Event</CardTitle>
                    <Newspaper className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-primary">{currentEvent.title}</div>
                    <p className="text-xs text-primary/80">{currentEvent.description}</p>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>{activeStockData.name} ({activeStockData.ticker})</CardTitle>
                            <CardDescription>Price: FC {activeStockData.price.toFixed(2)}</CardDescription>
                        </div>
                        <Tabs value={selectedStock} onValueChange={(val) => setSelectedStock(val as Stock)} className="w-fit">
                            <TabsList>
                                <TabsTrigger value="AAPL">AAPL</TabsTrigger>
                                <TabsTrigger value="TSLA">TSLA</TabsTrigger>
                                <TabsTrigger value="RELIANCE">RELIANCE</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart data={activeStockData.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `FC ${value}`} domain={['dataMin - 10', 'dataMax + 10']} />
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Area type="monotone" dataKey="price" stroke={chartConfig.price.color} fillOpacity={0.2} fill="url(#colorPrice)" />
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
            <Tabs value={tradeAction} onValueChange={(val) => setTradeAction(val as 'buy' | 'sell')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy"><TrendingUp className="mr-2 h-4 w-4 text-green-500" /> Buy {selectedStock}</TabsTrigger>
                    <TabsTrigger value="sell"><TrendingDown className="mr-2 h-4 w-4 text-red-500" /> Sell {selectedStock}</TabsTrigger>
                </TabsList>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedStock} Shares</CardTitle>
                        <CardDescription>You have: {portfolio[selectedStock]} shares</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Number of Shares</Label>
                            <Input id="quantity" type="number" placeholder="e.g., 10" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        {quantity && <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                            Total Cost: FC {(parseInt(quantity) * activeStockData.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleTrade} variant={tradeAction === "sell" ? "destructive" : "default"}>
                           {tradeAction === 'buy' ? 'Execute Buy' : 'Execute Sell'}
                        </Button>
                    </CardFooter>
                </Card>
            </Tabs>
        </div>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>Summary of your stock holdings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {(Object.keys(portfolio) as Stock[]).filter(key => portfolio[key] > 0).length > 0 ? (
                    (Object.keys(portfolio) as Stock[]).map(ticker => {
                        const shares = portfolio[ticker];
                        if (shares > 0) {
                            const stock = stocks[ticker];
                            const value = shares * stock.price;
                            return (
                                <div key={ticker} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-bold">{ticker}</p>
                                        <p className="text-xs text-muted-foreground">{shares} shares</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold">FC {value.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                                        <p className={cn("text-xs flex items-center justify-end", stock.change >= 0 ? "text-green-500" : "text-red-500")}>
                                            {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                                            {(stock.change * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })
                 ) : (
                    <p className="text-center text-muted-foreground py-10">You do not own any stocks. Start by buying some!</p>
                 )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
