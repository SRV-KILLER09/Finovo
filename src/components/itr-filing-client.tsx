
"use client";

import { useState, useMemo, useActionState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, FileSignature, CheckCircle, Award, Lightbulb, Sparkles } from "lucide-react";
import { validateItrAction } from "@/lib/actions";
import { SubmitButton } from "./submit-button";
import { Separator } from "./ui/separator";

type ItrItem = {
  id: string;
  name: string;
  amount: number;
};

const incomeOptions = ["Salary", "Freelance Income", "Interest from Savings", "Interest from FD"];
const deductionOptions = ["Section 80C (ELSS, PPF)", "Section 80D (Health Insurance)", "Section 80G (Donations)", "Standard Deduction"];

type ItrState = {
    output: { isValid: boolean; explanation: string; suggestions: string[] } | null;
    error: string | null;
};

const initialState: ItrState = {
  output: null,
  error: null,
};

export function ItrFilingClient() {
  const [incomeItems, setIncomeItems] = useState<ItrItem[]>([]);
  const [deductionItems, setDeductionItems] = useState<ItrItem[]>([]);
  
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  
  const [state, formAction] = useActionState(validateItrAction, initialState);

  useEffect(() => {
    if (state.output) {
      if (state.output.isValid && !earnedBadges.includes("Tax Pro")) {
        setEarnedBadges(prev => [...prev, "Tax Pro"]);
      }
      setShowResultDialog(true);
    }
  }, [state.output, earnedBadges]);

  const grossTotalIncome = useMemo(() => incomeItems.reduce((acc, item) => acc + item.amount, 0), [incomeItems]);
  const totalDeductions = useMemo(() => deductionItems.reduce((acc, item) => acc + item.amount, 0), [deductionItems]);
  const netTaxableIncome = useMemo(() => grossTotalIncome - totalDeductions, [grossTotalIncome, totalDeductions]);

  const handleAddItem = (type: "income" | "deduction", name: string, amountStr: string) => {
    const amount = parseFloat(amountStr);
    if (!name || isNaN(amount) || amount <= 0) return;

    const newItem: ItrItem = { id: Date.now().toString(), name, amount };

    if (type === "income") {
      setIncomeItems(prev => [...prev, newItem]);
    } else {
      // Add standard deduction automatically if salary is added
      if (name === "Salary" && !deductionItems.some(d => d.name === "Standard Deduction")) {
          setDeductionItems(prev => [...prev, {id: Date.now().toString() + 'sd', name: 'Standard Deduction', amount: 50000}]);
      }
      setDeductionItems(prev => [...prev, newItem]);
    }
  };

  const handleRemoveItem = (type: "income" | "deduction", id: string) => {
    if (type === "income") {
      setIncomeItems(prev => prev.filter(item => item.id !== id));
    } else {
      setDeductionItems(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const resetForm = () => {
    setIncomeItems([]);
    setDeductionItems([]);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form action={formAction} className="lg:col-span-2 space-y-6">
            <input type="hidden" name="incomeData" value={JSON.stringify(incomeItems.map(({id, ...rest}) => rest))} />
            <input type="hidden" name="deductionData" value={JSON.stringify(deductionItems.map(({id, ...rest}) => rest))} />

            {/* Income Section */}
            <CategoryCard 
                title="Income Sources" 
                description="Add your sources of income for the financial year."
                items={incomeItems}
                options={incomeOptions}
                onAddItem={(name, amount) => handleAddItem('income', name, amount)}
                onRemoveItem={(id) => handleRemoveItem('income', id)}
                type="income"
            />
            
            {/* Deductions Section */}
            <CategoryCard 
                title="Tax Deductions" 
                description="Add your investments and expenses that qualify for deductions."
                items={deductionItems}
                options={deductionOptions}
                onAddItem={(name, amount) => handleAddItem('deduction', name, amount)}
                onRemoveItem={(id) => handleRemoveItem('deduction', id)}
                type="deduction"
            />
             <Card>
                <CardFooter className="flex-col gap-2">
                  <SubmitButton disabled={incomeItems.length === 0} className="w-full">
                    <FileSignature className="mr-2 h-4 w-4"/>
                    File My ITR (Simulated)
                  </SubmitButton>
                   <Button onClick={resetForm} type="button" variant="outline" className="w-full">
                    Reset
                  </Button>
                </CardFooter>
            </Card>
        </form>

        <div className="space-y-6">
          <Card className="shadow-lg sticky top-20">
            <CardHeader>
              <CardTitle>Your Tax Summary</CardTitle>
              <CardDescription>This is a real-time calculation based on your inputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gross Total Income</span>
                <span className="font-bold">FC {grossTotalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-red-500">
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="font-bold">- FC {totalDeductions.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-primary">Net Taxable Income</span>
                <span className="font-bold text-primary">FC {netTaxableIncome.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award className="text-yellow-500"/> Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                    {earnedBadges.length > 0 ? (
                         <div className="flex flex-wrap gap-2 items-center">
                            {earnedBadges.map(badge => <Badge key={badge} variant="secondary">{badge}</Badge>)}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">File your first ITR to earn the 'Tax Pro' badge!</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
      
       <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <CheckCircle className="text-green-500"/>
                    ITR Filed Successfully! (Simulation)
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Congratulations! You've completed your first ITR filing simulation. Here's the AI's analysis of your filing:
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                {state.output && (
                    <>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> AI Explanation</h3>
                            <p className="text-muted-foreground mt-1">{state.output.explanation}</p>
                        </div>
                        <div>
                             <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500"/> AI Suggestions</h3>
                            <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                                {state.output.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </>
                )}
                 {state.error && <p className="text-destructive">{state.error}</p>}
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowResultDialog(false)}>Got it!</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface CategoryCardProps {
    title: string;
    description: string;
    items: ItrItem[];
    options: string[];
    onAddItem: (name: string, amount: string) => void;
    onRemoveItem: (id: string) => void;
    type: 'income' | 'deduction';
}

function CategoryCard({title, description, items, options, onAddItem, onRemoveItem, type}: CategoryCardProps) {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [amount, setAmount] = useState("");

    const handleAdd = () => {
        onAddItem(selectedOption, amount);
        setAmount("");
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${type}-item`}>Select Item</Label>
                        <select 
                            id={`${type}-item`} 
                            value={selectedOption} 
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`${type}-amount`}>Amount (FC)</Label>
                        <div className="flex gap-2">
                            <Input 
                                id={`${type}-amount`}
                                type="number"
                                placeholder="e.g., 500000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                             <Button type="button" onClick={handleAdd} disabled={!amount}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    {items.length > 0 ? items.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-4">
                                <span className="font-mono">FC {item.amount.toLocaleString()}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6" type="button" onClick={() => onRemoveItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                        </div>
                    )) : <p className="text-center text-sm text-muted-foreground py-4">No items added yet.</p>}
                </div>

            </CardContent>
        </Card>
    )
}
