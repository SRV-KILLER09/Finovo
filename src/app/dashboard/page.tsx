

'use client';

import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Banknote,
  PiggyBank,
  Target,
  Trophy,
  PlusCircle,
  XCircle,
  Plus,
  QrCode,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { TwoFactorSetup } from "@/components/dashboard/two-factor-setup";
import { useState } from "react";
import { CreateBudgetDialog } from "@/components/dashboard/create-budget-dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCodeDialog } from "@/components/dashboard/qr-code-dialog";
import { useSearchParams } from "next/navigation";

export interface BudgetScenario {
  title: string;
  total: number;
  spent: number;
  progress: number;
  category: string;
  period: string;
}

const initialBudgetScenarios: BudgetScenario[] = [
  { title: "Monthly Groceries", total: 1000, spent: 450, progress: 45, category: "groceries", period: "monthly" },
  { title: "Weekend Trip", total: 2500, spent: 2200, progress: 88, category: "entertainment", period: "one-time" },
  { title: "Diwali Gifts", total: 3000, spent: 3100, progress: 103, category: "other", period: "one-time" },
];

const initialRewards: any[] = [
  { title: "First Budget Created", points: 50 },
  { title: "On-time Bill Payment", points: 10 },
  { title: "Savings Goal Met", points: 100 },
];

const initialTransactions: any[] = [
    { date: "2025-07-28", description: "Zomato Order", category: "Food", type: "Expense", status: "Completed", amount: -250, isAccent: false, currency: 'FC' },
    { date: "2025-07-27", description: "Pocket Money", category: "Income", type: "Credit", status: "Completed", amount: 1000, isAccent: true, currency: 'FC' },
    { date: "2025-07-26", description: "Netflix Subscription", category: "Entertainment", type: "Expense", status: "Completed", amount: -199, isAccent: false, currency: 'FC' },
    { date: "2025-07-25", description: "Book Store", category: "Education", type: "Expense", status: "Completed", amount: -600, isAccent: false, currency: 'FC' },
];

// For demonstration purposes, we'll use a hardcoded admin email.
const ADMIN_EMAIL = "vardaansaxena096@Gmail.com";


export default function DashboardPage() {
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get('new_user') === 'true';

  // In a real app, you'd get the user's email from your auth session.
  const userEmail = "vardaansaxena096@Gmail.com"; // Example user
  const isAdmin = userEmail === ADMIN_EMAIL;
  const userName = userEmail.split('@')[0];
  
  const [balance, setBalance] = useState(5000);
  const [income, setIncome] = useState(1000);
  const [expenses, setExpenses] = useState(1049);
  const [savingsProgress, setSavingsProgress] = useState(15);
  const [budgetScenarios, setBudgetScenarios] = useState<BudgetScenario[]>(initialBudgetScenarios);
  const [rewards, setRewards] = useState(initialRewards);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [userPoints, setUserPoints] = useState(160);
  const [adminAddAmount, setAdminAddAmount] = useState('');


  const handleAddMoney = () => {
    const amount = parseFloat(adminAddAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance(prev => prev + amount);
      setIncome(prev => prev + amount);
      setAdminAddAmount('');
      // Optionally, you could add a transaction record here.
    }
  };

  const handleAddBudget = (newBudget: Omit<BudgetScenario, 'spent' | 'progress'>) => {
    // For demonstration, we'll add some mock spending.
    const spent = Math.random() * newBudget.total;
    const budgetToAdd: BudgetScenario = {
      ...newBudget,
      spent: spent,
      progress: (spent / newBudget.total) * 100,
    };
    setBudgetScenarios(prev => [...prev, budgetToAdd]);
  };

  const handleDeleteBudget = (title: string) => {
    setBudgetScenarios(prev => prev.filter(scenario => scenario.title !== title));
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return "bg-destructive"; // Danger
    if (progress >= 75) return "bg-primary/50"; // Warning
    return "bg-primary"; // Default
  }

  return (
    <>
      <TwoFactorSetup isNewUser={isNewUser} />
      {isAdmin && (
          <Card className="mb-4">
              <CardHeader>
                  <CardTitle>Welcome, {userName}!</CardTitle>
                  <CardDescription className="text-muted-foreground">You have access to special administrator privileges.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="add-money">Add Money to Account</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="add-money"
                      type="number"
                      placeholder="Enter amount"
                      value={adminAddAmount}
                      onChange={(e) => setAdminAddAmount(e.target.value)}
                    />
                    <Button onClick={handleAddMoney} disabled={!adminAddAmount}>
                      <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
          </Card>
      )}
      <div className="flex flex-col gap-4 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card className="red-box-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">FC {balance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="red-box-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Income
                </CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+FC {income.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Stipends, part-time job
                </p>
              </CardContent>
            </Card>
            <Card className="red-box-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-FC {expenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +18.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="red-box-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsProgress}% Achieved</div>
                <p className="text-xs text-muted-foreground">
                  Total goal: FC 1,00,000
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CashFlowChart currency="FC" />
            </div>
            <Card className="red-box-shadow">
                <CardHeader>
                    <CardTitle>Budgeting Scenarios</CardTitle>
                    <CardDescription>Your budgets for different scenarios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgetScenarios.length > 0 ? budgetScenarios.map(scenario => (
                        <div key={scenario.title}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{scenario.title}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary" className="capitalize">{scenario.category}</Badge>
                                    <Badge variant="outline" className="capitalize">{scenario.period}</Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">FC {scenario.spent.toLocaleString()}/FC {scenario.total.toLocaleString()}</span>
                                  <button onClick={() => handleDeleteBudget(scenario.title)} className="text-muted-foreground hover:text-destructive">
                                      <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2.5">
                                <div 
                                    className={cn("h-2.5 rounded-full", getProgressBarColor(scenario.progress))}
                                    style={{width: `${scenario.progress > 100 ? 100 : scenario.progress}%`}}>
                                </div>
                            </div>
                        </div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No budgeting scenarios yet.</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <CreateBudgetDialog onAddBudget={handleAddBudget}>
                    <Button variant="secondary" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Budget
                    </Button>
                  </CreateBudgetDialog>
                  <QrCodeDialog email={userEmail}>
                    <Button variant="outline" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" /> My QR
                    </Button>
                  </QrCodeDialog>
                </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2 red-box-shadow">
                  <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-2">
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                          Auto-imported from your linked accounts.
                      </CardDescription>
                      </div>
                      <Button asChild size="sm" className="ml-auto gap-1">
                      <Link href="#">
                          View All
                          <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      </Button>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead className="hidden xl:table-column">
                          Type
                        </TableHead>
                        <TableHead className="hidden xl:table-column">
                          Status
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length > 0 ? transactions.map(tx => (
                        <TableRow key={tx.date + tx.description}>
                            <TableCell>
                            <div className="font-medium">{tx.description}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {tx.category}
                            </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                            <Badge className="text-xs" variant="outline">
                                {tx.type}
                            </Badge>
                            </TableCell>
                            <TableCell className="hidden xl:table-column">
                            <Badge className="text-xs" variant="outline">
                                {tx.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{tx.date}</TableCell>
                            <TableCell className={`text-right ${tx.amount > 0 ? 'text-accent' : ''}`}>
                                {tx.amount > 0 ? '+':''}{tx.currency} {tx.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">No recent transactions.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </CardContent>
              </Card>

              <Card className="red-box-shadow">
                  <CardHeader>
                      <CardTitle>Gamification & Rewards</CardTitle>
                      <CardDescription>Earn points for good financial habits.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                      <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Your Points</span>
                          <div className="flex items-center gap-2">
                             <Trophy className="h-5 w-5 text-yellow-500" />
                             <span className="font-bold text-lg">{userPoints.toLocaleString()} pts</span>
                          </div>
                      </div>
                       <div className="space-y-4">
                          <h4 className="text-sm font-medium">Recent Achievements</h4>
                          {rewards.length > 0 ? rewards.map(reward => (
                               <div key={reward.title} className="flex items-center">
                                  <div>{reward.title}</div>
                                  <div className="ml-auto font-medium text-accent">+{reward.points} pts</div>
                               </div>
                          )) : (
                            <p className="text-sm text-muted-foreground">No recent achievements.</p>
                          )}
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Button variant="secondary" className="w-full">Redeem Rewards</Button>
                  </CardFooter>
              </Card>
          </div>
        </div>
    </>
  )
}
