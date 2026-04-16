import { ScamHunterClient } from "@/components/scam-hunter-client";

export default function ScamHunterPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Scam Hunter: Interactive Fraud Simulator</h1>
        <p className="text-muted-foreground">Learn to spot scams by making decisions in real-world scenarios. Can you become a master Fraud Detective?</p>
      </header>
      <ScamHunterClient />
    </div>
  );
}
