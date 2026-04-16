
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Send, ArrowLeft, User, Heart, Banknote, Star } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { sendMoneyAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "./submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type ScannedRecipient = {
    name: string;
    upiId: string;
    avatar: string;
    avatarHint: string;
}

const mockRecipient: ScannedRecipient = {
    name: "Priya Sharma",
    upiId: "priya.sharma@finovo",
    avatar: PlaceHolderImages.find(img => img.id === 'avatar3')?.imageUrl || '',
    avatarHint: PlaceHolderImages.find(img => img.id === 'avatar3')?.imageHint || 'woman smiling',
}


export function PaymentClient() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState<ScannedRecipient | null>(null);

  const handlePaymentAction = async (formData: FormData) => {
    const result = await sendMoneyAction(formData);

    if (result.success) {
      toast({
        title: "Payment Successful!",
        description: result.message,
      });
      setRecipient(null); // Go back to the main payment screen
    } else {
      toast({
        title: "Payment Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleScan = () => {
    // In a real app, this would open a camera scanner.
    // For this demo, we'll just simulate a successful scan.
    setRecipient(mockRecipient);
  };
  
  if (recipient) {
      return (
          <form action={handlePaymentAction}>
             <input type="hidden" name="upiId" value={recipient.upiId} />
             <Card className="max-w-md mx-auto">
                 <CardHeader className="text-center relative">
                     <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => setRecipient(null)}>
                        <ArrowLeft />
                     </Button>
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={recipient.avatar} alt={recipient.name} data-ai-hint={recipient.avatarHint} />
                        <AvatarFallback><User size={40}/></AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">Paying {recipient.name}</CardTitle>
                    <CardDescription>{recipient.upiId}</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4 px-8">
                     <div className="space-y-2">
                        <Label htmlFor="amount" className="sr-only">Amount</Label>
                        <Input 
                            id="amount"
                            name="amount"
                            type="number" 
                            placeholder="Enter amount (FC)" 
                            required
                            className="text-center text-3xl h-16"
                        />
                    </div>
                     <div className="space-y-2">
                         <Label htmlFor="note" className="sr-only">Note</Label>
                        <Textarea 
                            id="note"
                            name="note"
                            placeholder="Add a note (optional)" 
                        />
                    </div>
                 </CardContent>
                 <CardFooter className="flex-col gap-4 px-8 pb-8">
                    <SubmitButton className="w-full h-12 text-lg">
                        <Send className="mr-2 h-5 w-5" />
                        Pay
                    </SubmitButton>
                     <div className="grid grid-cols-2 gap-2 w-full">
                         <Button variant="outline" className="w-full" type="button">
                            <Banknote className="mr-2 h-4 w-4" />
                            Request
                        </Button>
                         <Button variant="outline" className="w-full" type="button">
                            <Star className="mr-2 h-4 w-4" />
                            Add to Favorites
                        </Button>
                    </div>
                </CardFooter>
             </Card>
          </form>
      )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={handlePaymentAction}>
        <Card>
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>Enter the recipient's UPI ID, amount, and an optional note.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">Recipient's UPI ID</Label>
              <Input 
                id="upiId"
                name="upiId"
                placeholder="user@finovo" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (FC)</Label>
              <Input 
                id="amount"
                name="amount"
                type="number" 
                placeholder="100.00" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea 
                id="note"
                name="note"
                placeholder="e.g., For lunch" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Pay Now
            </SubmitButton>
            <Button variant="outline" className="w-full" type="button" onClick={handleScan}>
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Balance</CardTitle>
            <CardDescription>Your current available FinovoCurrency balance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">FC 0.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receive Payments</CardTitle>
            <CardDescription>Share your QR code to receive money.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Image 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=vardaansaxena096@finovo"
                width={200}
                height={200}
                alt="Your UPI QR Code"
                className="rounded-lg border p-2 bg-white"
                data-ai-hint="qr code"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
