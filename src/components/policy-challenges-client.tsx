
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Award, Trophy, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Challenge = {
  id: number;
  title: string;
  description: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  badge: string;
};

const allChallenges: Challenge[] = [
  {
    id: 1,
    title: "RBI Repo Rate Hike",
    description: "The Reserve Bank of India (RBI) increases the repo rate by 0.50%. What is the most likely immediate impact on the economy?",
    options: [
      "Housing loans become cheaper.",
      "Fixed Deposit (FD) interest rates decrease.",
      "Borrowing becomes more expensive for banks, leading to higher loan EMIs.",
      "The stock market rallies significantly."
    ],
    correctAnswerIndex: 2,
    explanation: "The repo rate is the rate at which the RBI lends to commercial banks. When it increases, banks' cost of borrowing goes up. They pass this on to consumers, making loans like home loans and car loans more expensive.",
    badge: "Macro Guru"
  },
  {
    id: 2,
    title: "Increased Import Tariffs on Electronics",
    description: "The government imposes a higher import tariff (tax) on electronic goods like smartphones and laptops. What is the likely consequence for consumers?",
    options: [
      "Prices of imported electronics will decrease.",
      "Prices of both imported and locally-made electronics will likely increase.",
      "The quality of locally-made electronics will decrease.",
      "There will be no change in prices."
    ],
    correctAnswerIndex: 1,
    explanation: "Higher import tariffs make foreign goods more expensive. This reduces competition, allowing domestic manufacturers to also raise their prices. Therefore, consumers often see a price increase across the board.",
    badge: "Trade Titan"
  },
  {
    id: 3,
    title: "Government Increases MSP for Wheat",
    description: "The government increases the Minimum Support Price (MSP) for wheat. What is a direct effect of this policy?",
    options: [
      "Farmers are discouraged from growing wheat.",
      "The price of bread and other wheat products is likely to go down.",
      "Farmers are guaranteed a minimum price for their wheat, potentially increasing their income.",
      "The government's food subsidy bill will decrease."
    ],
    correctAnswerIndex: 2,
    explanation: "MSP is a form of market intervention by the Government of India to insure agricultural producers against any sharp fall in farm prices. A higher MSP provides a safety net for farmers, ensuring they get a minimum price for their crops.",
    badge: "Agri-Economist"
  },
];

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

export function PolicyChallengesClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; explanation: string, badge: string } | null>(null);

  useEffect(() => {
    setChallenges(shuffleArray([...allChallenges]));
  }, []);

  const challenge = challenges[currentChallengeIndex];

  const handleSubmit = () => {
    if (selectedOption === undefined) return;
    const selectedIndex = parseInt(selectedOption);
    const isCorrect = selectedIndex === challenge.correctAnswerIndex;

    if (isCorrect && !earnedBadges.includes(challenge.badge)) {
      setEarnedBadges(prev => [...prev, challenge.badge]);
    }
    setResult({ correct: isCorrect, explanation: challenge.explanation, badge: challenge.badge });
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setResult(null);
    setSelectedOption(undefined);
    setCurrentChallengeIndex(prev => prev + 1);
  };
  
  const restart = () => {
    setChallenges(shuffleArray([...allChallenges]));
    setCurrentChallengeIndex(0);
    setEarnedBadges([]);
    setShowResult(false);
    setResult(null);
    setSelectedOption(undefined);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {!challenge ? (
            <Card className="shadow-lg text-center">
              <CardHeader>
                  <Trophy className="h-24 w-24 text-yellow-500 mx-auto" />
                  <CardTitle className="text-2xl">All Challenges Completed!</CardTitle>
                  <CardDescription>You've tackled all the policy challenges. Well done, analyst!</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="mb-4">You've earned {earnedBadges.length} out of {allChallenges.length} possible badges.</p>
                  <Button onClick={restart}>Play Again</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">Challenge #{currentChallengeIndex + 1}</Badge>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-4">
                  {challenge.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} disabled={selectedOption === undefined} className="w-full">
                  Submit Answer
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Collect badges by answering correctly.</CardDescription>
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
                <p className="text-muted-foreground text-center py-4">No badges earned yet. Take on a challenge!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={showResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn("flex items-center gap-2", result?.correct ? "text-green-500" : "text-destructive")}>
              {result?.correct ? <CheckCircle /> : <XCircle />}
              {result?.correct ? "Correct!" : "Not Quite."}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <p>{result?.explanation}</p>
              {result?.correct && (
                <div className="flex items-center gap-2 font-bold text-yellow-500 pt-2">
                  <Award className="h-5 w-5" /> You've earned the "{result.badge}" badge!
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleNext}>
                {currentChallengeIndex === allChallenges.length - 1 ? 'Finish' : 'Next Challenge'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
