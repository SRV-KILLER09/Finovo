
import { ItrFilingClient } from "@/components/itr-filing-client";

export default function ItrFilingPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Interactive ITR Filing</h1>
        <p className="text-muted-foreground">Learn how to file your Income Tax Return in a simple, gamified way.</p>
      </header>
      <ItrFilingClient />
    </div>
  );
}
