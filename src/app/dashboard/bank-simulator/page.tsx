
import { BankSimulatorClient } from "@/components/bank-simulator-client";

export default function BankSimulatorPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Be the Banker: Interactive Bank Simulator</h1>
        <p className="text-muted-foreground">Manage a bank, make decisions, and learn how the banking system works through play.</p>
      </header>
      <BankSimulatorClient />
    </div>
  );
}
