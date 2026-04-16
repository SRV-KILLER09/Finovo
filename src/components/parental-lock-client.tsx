
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { LayoutDashboard, CreditCard, Sparkles, FileText, Gem, Settings, ShieldCheck, ShieldOff, Building2, ShieldAlert, Calculator, Scale, Bitcoin, AreaChart, FileSignature, Target, Lightbulb, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useParentalLock } from "@/contexts/parental-lock-context";


const features = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "pay", label: "Send & Receive Money", icon: CreditCard },
    { id: "bill-splitter", label: "AI Bill Splitter", icon: Calculator },
    { id: "reports", label: "AI Financial Reports", icon: FileText },
    { id: "itr-filing", label: "ITR Filing", icon: FileSignature },
    { id: "digigold", label: "DigiGold Investing", icon: Gem },
    { id: "digibitcoin", label: "DigiBitcoin Trading", icon: Bitcoin },
    { id: 'digistock', label: "DigiStock Trading", icon: AreaChart },
    { id: 'bank-simulator', label: "Bank Simulator", icon: Building2 },
    { id: 'scam-hunter', label: "Scam Hunter", icon: ShieldAlert },
    { id: 'policy-challenges', label: "Policy Challenges", icon: Scale },
    { id: 'developer', label: "Developer Page", icon: Code },
    { id: "settings", label: "Account Settings", icon: Settings },
];

export function ParentalLockClient() {
  const { 
    parentalPin, 
    setParentalPin, 
    isUnlocked, 
    setIsUnlocked, 
    enabledFeatures, 
    setEnabledFeatures 
  } = useParentalLock();

  const [showPinSetup, setShowPinSetup] = useState(!parentalPin);
  const [pinInput, setPinInput] = useState("");
  const [tempPin, setTempPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const handleSetPin = () => {
    if (tempPin.length !== 4 || !/^\d{4}$/.test(tempPin)) {
        toast({ title: "Invalid PIN", description: "PIN must be exactly 4 digits.", variant: "destructive" });
        return;
    }
    if (tempPin !== confirmPin) {
        toast({ title: "PINs Do Not Match", description: "Please re-enter your confirmation PIN.", variant: "destructive" });
        return;
    }
    setParentalPin(tempPin);
    setIsUnlocked(true);
    setShowPinSetup(false);
    toast({ title: "PIN Set Successfully!", description: "Parental controls are now active." });
  };

  const handleUnlock = () => {
    if (pinInput === parentalPin) {
      setIsUnlocked(true);
      setPinInput("");
       toast({ title: "Controls Unlocked", description: "You can now manage features." });
    } else {
      toast({ title: "Incorrect PIN", description: "The PIN you entered is incorrect.", variant: "destructive" });
      setPinInput("");
    }
  };
  
  const handleLock = () => {
    setIsUnlocked(false);
    toast({ title: "Controls Locked", description: "A PIN is required to make changes." });
  };

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures(prev => ({ ...prev, [featureId]: !prev[featureId] }));
  };

  const allFeaturesEnabled = useMemo(() => Object.values(enabledFeatures).every(Boolean), [enabledFeatures]);

  const toggleAllFeatures = () => {
    const targetState = !allFeaturesEnabled;
    const newFeatures: Record<string, boolean> = {};
    for (const feature of features) {
        newFeatures[feature.id] = targetState;
    }
    setEnabledFeatures(newFeatures);
  }


  if (!parentalPin) {
    return (
        <Dialog open={showPinSetup} onOpenChange={setShowPinSetup}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Setup Parental Lock</DialogTitle>
                    <DialogDescription>
                        Create a 4-digit PIN to secure the parental controls. Only this PIN will be able to change settings.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="pin">Create 4-Digit PIN</Label>
                        <Input 
                            id="pin" 
                            type="password" 
                            maxLength={4}
                            value={tempPin}
                            onChange={(e) => setTempPin(e.target.value)}
                            className="text-center text-2xl tracking-[1rem]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-pin">Confirm PIN</Label>
                        <Input 
                            id="confirm-pin" 
                            type="password" 
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            className="text-center text-2xl tracking-[1rem]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSetPin} className="w-full">Set PIN and Activate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  if (!isUnlocked) {
    return (
        <Card className="max-w-md mx-auto shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle>Controls Locked</CardTitle>
                <CardDescription>Enter your 4-digit parental PIN to manage features.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <ShieldCheck className="w-24 h-24 text-primary" />
                <div className="space-y-2 w-full">
                    <Label htmlFor="unlock-pin" className="sr-only">PIN</Label>
                    <Input 
                        id="unlock-pin" 
                        type="password" 
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="text-center text-4xl tracking-[1rem] h-16"
                        placeholder="••••"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUnlock} className="w-full">Unlock Controls</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle>Manage Features</CardTitle>
            <CardDescription>Toggle features your child can access in the app.</CardDescription>
        </div>
        <Button variant="destructive" onClick={handleLock}>
            <ShieldOff className="mr-2 h-4 w-4" />
            Lock Controls
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div>
                <h4 className="font-semibold">{allFeaturesEnabled ? "Disable All Features" : "Enable All Features"}</h4>
                <p className="text-sm text-muted-foreground">Quickly turn all features on or off.</p>
            </div>
            <Switch 
                checked={allFeaturesEnabled}
                onCheckedChange={toggleAllFeatures}
                aria-label="Toggle all features"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
                <div 
                    key={feature.id} 
                    className={cn(
                        "rounded-lg border p-4 flex flex-col justify-between transition-all",
                        enabledFeatures[feature.id] ? "bg-card shadow" : "bg-muted/30"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <feature.icon className={cn("h-6 w-6", enabledFeatures[feature.id] ? "text-primary" : "text-muted-foreground")} />
                            <h3 className="font-semibold text-card-foreground">{feature.label}</h3>
                        </div>
                         <Switch 
                            checked={enabledFeatures[feature.id]}
                            onCheckedChange={() => toggleFeature(feature.id)}
                            aria-label={`Toggle ${feature.label}`}
                         />
                    </div>
                    <p className={cn("text-xs", enabledFeatures[feature.id] ? "text-muted-foreground" : "text-muted-foreground/50")}>
                        {enabledFeatures[feature.id] ? "Feature is currently enabled." : "Feature is currently disabled."}
                    </p>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
