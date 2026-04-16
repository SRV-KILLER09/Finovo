
import { ParentalLockClient } from "@/components/parental-lock-client";

export default function ParentalLockPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Parental Controls</h1>
        <p className="text-muted-foreground">Manage which features are accessible to your child.</p>
      </header>
      <ParentalLockClient />
    </div>
  );
}
