import { DigiGoldClient } from "@/components/digigold-client";

export default function DigiGoldPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">DigiGold Investments</h1>
        <p className="text-muted-foreground">Learn about investing by buying and selling digital gold.</p>
      </header>
      <DigiGoldClient />
    </div>
  );
}
