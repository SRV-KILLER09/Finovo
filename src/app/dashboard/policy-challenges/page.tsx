
import { PolicyChallengesClient } from "@/components/policy-challenges-client";

export default function PolicyChallengesPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Govt. Policy Impact Challenges</h1>
        <p className="text-muted-foreground">Test your economic knowledge by predicting the impact of real-world policies.</p>
      </header>
      <PolicyChallengesClient />
    </div>
  );
}
