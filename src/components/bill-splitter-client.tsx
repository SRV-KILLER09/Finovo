
"use client";

import { useActionState, useState, useEffect } from "react";
import { splitBillAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as TF } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Users, Check, Bell } from "lucide-react";

type Split = {
    person: string;
    amount: number;
    items: string[];
    paid: boolean;
}

type BillResult = {
    totalAmount: number;
    splits: Split[];
}

type BillSplitterState = {
    output: { totalAmount: number; splits: { person: string; amount: number; items: string[] }[] } | null;
    error: string | null;
}

const initialState: BillSplitterState = {
  output: null,
  error: null,
};

export function BillSplitterClient() {
  const [state, formAction] = useActionState(splitBillAction, initialState);
  const [billResult, setBillResult] = useState<BillResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.output) {
      setBillResult({
        totalAmount: state.output.totalAmount,
        splits: state.output.splits.map(s => ({ ...s, paid: false })),
      });
    }
  }, [state.output]);

  const togglePaidStatus = (personName: string) => {
    setBillResult(prev => {
        if (!prev) return null;
        return {
            ...prev,
            splits: prev.splits.map(split => 
                split.person === personName ? { ...split, paid: !split.paid } : split
            )
        }
    });
  }

  const sendReminder = (personName: string) => {
    toast({
      title: "Reminder Sent!",
      description: `A friendly reminder has been sent to ${personName} to settle their bill.`,
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Describe the Bill</CardTitle>
            <CardDescription>Let AI do the hard work. Just tell us who got what.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {state.error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Bill Details</Label>
              <Textarea
                id="description"
                name="description"
                rows={8}
                placeholder="Example: Me and Rahul split a pizza for 500. I also got a coke for 50."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">
              Split Bill
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>Split Breakdown</CardTitle>
          <CardDescription>Here's how the bill is divided among everyone.</CardDescription>
        </CardHeader>
        <CardContent>
          {billResult ? (
            <div className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Person</TableHead>
                            <TableHead className="text-right">Amount (FC)</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {billResult.splits.map((split) => (
                            <TableRow key={split.person}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground"/>
                                        {split.person}
                                    </div>
                                     <div className="text-xs text-muted-foreground pl-6">({split.items.join(', ')})</div>
                                </TableCell>
                                <TableCell className="text-right font-mono">FC {split.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={split.paid ? "secondary" : "outline"} className="cursor-pointer" onClick={() => togglePaidStatus(split.person)}>
                                        {split.paid ? "Paid" : "Unpaid"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {!split.paid ? (
                                        <Button variant="ghost" size="sm" onClick={() => sendReminder(split.person)}>
                                            <Bell className="h-4 w-4 mr-1"/> Remind
                                        </Button>
                                    ) : (
                                        <div className="flex justify-end items-center text-green-500">
                                            <Check className="h-4 w-4 mr-1"/> Settled
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TF>
                        <TableRow>
                            <TableCell colSpan={1} className="font-bold">Total</TableCell>
                            <TableCell colSpan={3} className="text-right font-bold font-mono">FC {billResult.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    </TF>
                </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Waiting for a bill to split...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
