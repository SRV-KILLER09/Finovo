
import { BillSplitterClient } from "@/components/bill-splitter-client";

export default function BillSplitterPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">AI Bill Splitter</h1>
        <p className="text-muted-foreground">Split bills with friends effortlessly. Just describe the bill and let AI do the math.</p>
      </header>
      <BillSplitterClient />
    </div>
  );
}
