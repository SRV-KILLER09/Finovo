
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Scale, PiggyBank, HandCoins, AlertTriangle, ShieldCheck, Trophy, Banknote } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type LoanRequest = {
  id: number;
  amount: number;
  risk: "low" | "medium" | "high";
  return: number;
  term: number; // in months
};

const riskProfiles = {
  low: { defaultChance: 0.05, returnMultiplier: 1.1 },
  medium: { defaultChance: 0.15, returnMultiplier: 1.25 },
  high: { defaultChance: 0.3, returnMultiplier: 1.5 },
};

const generateLoanRequest = (id: number): LoanRequest => {
  const amount = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
  const risk = (["low", "medium", "high"] as const)[Math.floor(Math.random() * 3)];
  return {
    id,
    amount,
    risk,
    return: amount * riskProfiles[risk].returnMultiplier,
    term: [12, 24, 36][Math.floor(Math.random() * 3)],
  };
};

const INITIAL_CAPITAL = 100000; // Bank's own money
const INITIAL_DEPOSITS = 500000; // Customer deposits

export function BankSimulatorClient() {
  const { toast } = useToast();
  const [bankerScore, setBankerScore] = useState(100);
  const [capital, setCapital] = useState(INITIAL_CAPITAL);
  const [deposits, setDeposits] = useState(INITIAL_DEPOSITS);
  const [depositInterestRate, setDepositInterestRate] = useState(2); // in percent
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(() =>
    Array.from({ length: 3 }, (_, i) => generateLoanRequest(i + 1))
  );
  const [activeLoans, setActiveLoans] = useState<LoanRequest[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const totalAssets = capital + deposits;
  const liquidity = deposits > 0 ? (capital / deposits) * 100 : 100;
  const capitalAdequacy = totalAssets > 0 ? (capital / totalAssets) * 100 : 100;


  const handleLoanDecision = (loan: LoanRequest, decision: "approve" | "reject") => {
    setLoanRequests(prev => prev.filter(l => l.id !== loan.id));
    
    if (decision === 'approve') {
      if (loan.amount > capital) {
        toast({ title: "Decision Blocked", description: "You don't have enough capital to approve this loan.", variant: "destructive" });
        return;
      }

      setCapital(prev => prev - loan.amount);
      setActiveLoans(prev => [...prev, loan]);
      
      const willDefault = Math.random() < riskProfiles[loan.risk].defaultChance;
      
      setTimeout(() => {
        if (willDefault) {
          toast({ title: `Loan #${loan.id} Defaulted!`, description: `A high-risk loan of FC ${loan.amount.toLocaleString()} defaulted. You lost the capital.`, variant: "destructive" });
          setBankerScore(prev => Math.max(0, prev - 20));
        } else {
          const profit = loan.return - loan.amount;
          setCapital(prev => prev + loan.return);
          toast({ title: `Loan #${loan.id} Repaid!`, description: `You earned a profit of FC ${profit.toLocaleString()}.`});
          setBankerScore(prev => prev + 10);
        }
        setActiveLoans(prev => prev.filter(l => l.id !== loan.id));
      }, loan.term * 100); // Simplified term duration
    } else {
        setBankerScore(prev => prev + 1)
        toast({ title: `Loan #${loan.id} Rejected`, description: `You chose to avoid the risk.` });
    }
    
    // Add a new loan request to keep the queue full
    setTimeout(() => {
        setLoanRequests(prev => [...prev, generateLoanRequest(Date.now())])
    }, 1000);
  };

  useEffect(() => {
    // Game over condition
    if (capital < 0) {
      setIsGameOver(true);
    }
  }, [capital]);

  const restartGame = () => {
    setCapital(INITIAL_CAPITAL);
    setDeposits(INITIAL_DEPOSITS);
    setBankerScore(100);
    setActiveLoans([]);
    setLoanRequests(Array.from({ length: 3 }, (_, i) => generateLoanRequest(i + 1)));
    setIsGameOver(false);
  }

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
      if (risk === 'low') return 'text-green-500';
      if (risk === 'medium') return 'text-yellow-500';
      return 'text-red-500';
  }

  return (
    <>
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Bank Capital</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">FC {capital.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Your bank's own funds.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Customer Deposits</CardTitle>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">FC {deposits.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Money held for customers.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Capital Adequacy</CardTitle>
                    <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{capitalAdequacy.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">A measure of bank health.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Banker Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bankerScore}</div>
                    <p className="text-xs text-muted-foreground">Your stability rating.</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Incoming Loan Requests</CardTitle>
                        <CardDescription>Approve or reject loans. Be careful, some loans might default!</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {loanRequests.slice(0,3).map(loan => (
                            <Card key={loan.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>Loan #{loan.id}</CardTitle>
                                    <CardDescription className="flex items-center justify-between">
                                        <span>Amount: FC {loan.amount.toLocaleString()}</span>
                                        <span className={`font-bold capitalize ${getRiskColor(loan.risk)}`}>{loan.risk} Risk</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2">
                                    <div>
                                        <p className="text-sm font-medium">Potential Return</p>
                                        <p className="text-green-500 font-bold">FC {loan.return.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Term</p>
                                        <p className="text-muted-foreground">{loan.term} months</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="destructive" onClick={() => handleLoanDecision(loan, 'reject')}>Reject</Button>
                                    <Button size="sm" variant="outline" onClick={() => handleLoanDecision(loan, 'approve')}>Approve</Button>
                                </CardFooter>
                            </Card>
                        ))}
                         {loanRequests.length === 0 && (
                            <p className="text-muted-foreground col-span-3 text-center py-8">No new loan requests at the moment.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Interest Rates</CardTitle>
                        <CardDescription>Attract more deposits with higher rates, but it will cost you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="interest-rate">Deposit Rate</Label>
                            <span className="font-bold text-primary text-lg">{depositInterestRate.toFixed(1)}%</span>
                        </div>
                        <Slider 
                            id="interest-rate"
                            min={0.5}
                            max={10}
                            step={0.1}
                            value={[depositInterestRate]}
                            onValueChange={([val]) => setDepositInterestRate(val)}
                        />
                         <Button className="w-full" onClick={() => toast({title: "Rate Updated!", description: `Deposit interest rate is now ${depositInterestRate.toFixed(1)}%`})}>Set Rate</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Active Loans</CardTitle>
                        <CardDescription>{activeLoans.length} loans currently being repaid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">FC {activeLoans.reduce((acc, loan) => acc + loan.amount, 0).toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
      <AlertDialog open={isGameOver}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Bank Failure!</AlertDialogTitle>
            <AlertDialogDescription>
                Your bank has run out of capital due to too many defaulted loans or high expenses. This is a critical learning moment in banking. You need to balance risk and reward carefully.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={restartGame}>Start Over</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
