
"use client";

import { useFormState } from "react-dom";
import { generateReportAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type FinancialReportState = {
    output: { summary: string; recommendations: string[] } | null;
    error: string | null;
};

const initialState: FinancialReportState = {
  output: null,
  error: null,
};

export function FinancialReportClient() {
  const [state, formAction] = useFormState(generateReportAction, initialState);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Financial Report</CardTitle>
          <CardDescription>Fill in your details to get a Finovo-powered financial health report.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Income (₹)</Label>
                <Input id="income" name="income" type="number" placeholder="3000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenses">Expenses (₹)</Label>
                <Input id="expenses" name="expenses" type="number" placeholder="1500" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="savings">Total Savings (₹)</Label>
              <Input id="savings" name="savings" type="number" placeholder="5000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Financial Goals</Label>
              <Textarea
                id="goals"
                name="goals"
                placeholder="e.g., Save for a new laptop, build an emergency fund"
                required
              />
              <p className="text-sm text-muted-foreground">Separate multiple goals with a comma.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Report Period</Label>
              <Select name="period" defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">Generate Report</SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>Your Finovo Report</CardTitle>
          <CardDescription>The generated report and recommendations will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.output ? (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{state.output.summary}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-primary">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {state.output.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Your report is waiting...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
