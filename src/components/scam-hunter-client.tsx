
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ShieldCheck, ShieldAlert, Award, Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type ScamScenario = {
  id: number;
  type: "email" | "text" | "call" | "social";
  title: string;
  sender: string;
  subject?: string;
  message: React.ReactNode;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  redFlags: string[];
  badgeAwarded: string;
};

const allScamScenarios: ScamScenario[] = [
  {
    id: 1,
    type: "email",
    title: "Unexpected Lottery Win",
    sender: "National Lottery Commission <winner@e-lotto-prizedraw.com>",
    subject: "CONGRATULATIONS! You have won!",
    message: (
      <p>
        Dear lucky winner, <br /><br />
        You have won **FC 10,00,000** in the international prize draw! To claim your prize, please click the link below and provide your bank details and a small processing fee of FC 5,000.
        <br /><br />
        <a href="#" className="text-blue-500 underline">https://bit.ly/claim-your-w1nnings</a>
        <br /><br />
        Hurry, this offer expires in 24 hours!
      </p>
    ),
    options: [
      { text: "Click link and pay the fee", isCorrect: false },
      { text: "Delete the email and report as spam", isCorrect: true },
      { text: "Reply to ask for more information", isCorrect: false },
    ],
    explanation: "This is a classic advance-fee fraud. Legitimate lotteries never ask for a fee to claim a prize. The urgent tone and suspicious link are major red flags.",
    redFlags: ["Urgency (24 hours)", "Request for a fee", "Suspicious sender email", "Shortened URL"],
    badgeAwarded: "Fraud Detective",
  },
  {
    id: 2,
    type: "text",
    title: "Fake Delivery Notification",
    sender: "+91-555-010-1234",
    message: <p>Your package delivery from Finovo has failed. Please update your address and confirm by paying a small redelivery fee of FC 50 here: <a href="#" className="text-blue-500 underline">finovo-tracking.info/update</a></p>,
    options: [
        { text: "Ignore the message", isCorrect: true },
        { text: "Pay the redelivery fee", isCorrect: false },
        { text: "Call the number to complain", isCorrect: false },
    ],
    explanation: "Smishing (SMS phishing) uses text messages to trick you. Delivery companies don't typically charge redelivery fees via text. The URL is not the official company website.",
    redFlags: ["Unexpected request", "Small payment request", "Non-official URL", "Sense of problem/urgency"],
    badgeAwarded: "Cyber Shield",
  },
  {
    id: 3,
    type: "text",
    title: "Urgent Bank Alert",
    sender: "888-777",
    message: <p>FINOVO-BANK ALERT: We have detected suspicious activity on your account. Please log in immediately at <a href="#" className="text-blue-500 underline">finovobank-security-verify.com</a> to secure your account. Failure to do so may result in account suspension.</p>,
    options: [
      { text: "Log in using the link provided", isCorrect: false },
      { text: "Open your banking app separately to check", isCorrect: true },
      { text: "Text back 'STOP' to end the alerts", isCorrect: false },
    ],
    explanation: "Scammers create fake bank websites to steal your login details. Never click links in unexpected security alerts. Always access your bank's website or app directly.",
    redFlags: ["Sense of urgency", "Threat of account suspension", "Non-official URL", "Asks for login details"],
    badgeAwarded: "Bank Guard",
  },
  {
    id: 4,
    type: "email",
    title: "Job Offer Too Good to Be True",
    sender: "HR Department <careers@global-solutions-inc.net>",
    subject: "IMMEDIATE HIRING: Remote Data Entry Clerk - 50,000/month",
    message: (
      <p>
        Dear Candidate, <br /><br />
        We are impressed with your profile on a job portal and would like to offer you a remote position. No interview required! To begin, please send a copy of your Aadhar card and purchase the required 'work-from-home kit' for FC 7,500 from our vendor. You will be reimbursed in your first salary.
      </p>
    ),
    options: [
      { text: "Decline the offer politely", isCorrect: false },
      { text: "Send your documents and purchase the kit", isCorrect: false },
      { text: "Delete the email, it's a scam", isCorrect: true },
    ],
    explanation: "Legitimate employers will not ask you to pay for equipment or training upfront. Asking for sensitive documents before a formal interview process is also a major red flag.",
    redFlags: ["No interview required", "Request for payment", "Offer is too good to be true", "Asking for sensitive info early"],
    badgeAwarded: "Career Guardian",
  },
  {
    id: 5,
    type: "social",
    title: "Friend in Trouble",
    sender: "A 'Friend' on Social Media",
    message: <p>Hey! So sorry to bother you but I'm in a really bad situation. My wallet got stolen and I'm stuck, I need FC 2,000 for a bus ticket home. Can you please UPI me the money? I'll pay you back this weekend, I promise!</p>,
    options: [
      { text: "Send the money immediately to help", isCorrect: false },
      { text: "Call or text your friend on their number to verify", isCorrect: true },
      { text: "Reply and ask for their mother's maiden name to check", isCorrect: false },
    ],
    explanation: "This is a common account takeover scam. Scammers hack social media accounts and impersonate your friends to ask for money. Always verify such requests through a different communication channel, like a phone call.",
    redFlags: ["Sudden emergency", "Request for money", "Emotional manipulation", "Unusual request"],
    badgeAwarded: "Friendship Protector",
  },
];

const getIcon = (type: "email" | "text" | "call" | "social") => {
    if (type === 'email') return <Mail className="h-6 w-6" />;
    if (type === 'text') return <MessageSquare className="h-6 w-6" />;
    if (type === 'social') return <MessageSquare className="h-6 w-6" />;
    return <Phone className="h-6 w-6" />;
}

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export function ScamHunterClient() {
  const [scamScenarios, setScamScenarios] = useState<ScamScenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; explanation: string, redFlags: string[] } | null>(null);

  useEffect(() => {
    setScamScenarios(shuffleArray([...allScamScenarios]));
  }, []);

  const scenario = scamScenarios[currentScenarioIndex];

  const handleDecision = (isCorrect: boolean) => {
    if (isCorrect) {
      if (!earnedBadges.includes(scenario.badgeAwarded)) {
        setEarnedBadges(prev => [...prev, scenario.badgeAwarded]);
      }
    }
    setResult({ correct: isCorrect, explanation: scenario.explanation, redFlags: scenario.redFlags });
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setResult(null);
    setCurrentScenarioIndex(prev => prev + 1); // Go to the next shuffled scenario
  };

  const restart = () => {
    setScamScenarios(shuffleArray([...allScamScenarios]));
    setCurrentScenarioIndex(0);
    setEarnedBadges([]);
    setShowResult(false);
    setResult(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {!scenario ? (
                 <Card className="shadow-lg text-center">
                    <CardHeader>
                        <Award className="h-24 w-24 text-yellow-500 mx-auto" />
                        <CardTitle className="text-2xl">All Scenarios Completed!</CardTitle>
                        <CardDescription>You've tackled all the scams. You're a true Scam Hunter!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">You've earned {earnedBadges.length} out of {allScamScenarios.length} possible badges.</p>
                        <Button onClick={restart}>Play Again</Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            {getIcon(scenario.type)}
                            <div>
                               <CardTitle>{scenario.title}</CardTitle>
                               <CardDescription>From: {scenario.sender}</CardDescription>
                               {scenario.subject && <CardDescription>Subject: {scenario.subject}</CardDescription>}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none dark:prose-invert bg-muted/30 p-4 rounded-md border">
                        {scenario.message}
                    </CardContent>
                    <CardFooter className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                        {scenario.options.map((option, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleDecision(option.isCorrect)}
                            className="h-auto whitespace-normal py-2"
                        >
                            {option.text}
                        </Button>
                        ))}
                    </CardFooter>
                </Card>
            )}
        </div>
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Your Badges</CardTitle>
                    <CardDescription>Collect badges by correctly identifying scams.</CardDescription>
                </CardHeader>
                <CardContent>
                    {earnedBadges.length > 0 ? (
                         <div className="flex flex-wrap gap-4 items-center justify-center">
                            {earnedBadges.map(badge => (
                                <div key={badge} className="flex flex-col items-center text-center gap-2">
                                    <Award className="h-12 w-12 text-yellow-500" />
                                    <Badge variant="secondary">{badge}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No badges earned yet. Start hunting scams!</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
      <AlertDialog open={showResult}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className={cn("flex items-center gap-2", result?.correct ? "text-green-500" : "text-destructive")}>
                    {result?.correct ? <ShieldCheck /> : <ShieldAlert />}
                    {result?.correct ? "Correct Decision!" : "Incorrect! This was a scam."}
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4 pt-4">
                    <p>{result?.explanation}</p>
                    <div>
                        <h4 className="font-semibold mb-2">Red Flags to Watch For:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {result?.redFlags.map(flag => <li key={flag}>{flag}</li>)}
                        </ul>
                    </div>
                    {result?.correct && <div className="flex items-center gap-2 font-bold text-yellow-500 pt-2"><Award className="h-5 w-5" /> You've earned the "{scenario.badgeAwarded}" badge!</div>}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleNext}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
