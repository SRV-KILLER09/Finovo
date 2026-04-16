
import { DigiStockClient } from "@/components/digistock-client";

export default function DigiStockPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">DigiStock</h1>
        <p className="text-muted-foreground">Learn to invest in the stock market with a virtual portfolio.</p>
      </header>
      <DigiStockClient />
    </div>
  );
}
