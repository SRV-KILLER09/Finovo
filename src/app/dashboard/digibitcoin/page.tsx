
import { DigiBitcoinClient } from "@/components/digibitcoin-client";

export default function DigiBitcoinPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">DigiBitcoin</h1>
        <p className="text-muted-foreground">Experience high-risk markets safely with virtual crypto wallets.</p>
      </header>
      <DigiBitcoinClient />
    </div>
  );
}
