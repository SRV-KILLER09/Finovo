import { FinancialReportClient } from "@/components/financial-report-client";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold font-headline">Finovo Financial Reports</h1>
        <p className="text-muted-foreground">Get personalized insights into your financial health.</p>
      </header>
      <FinancialReportClient />
    </div>
  );
}
