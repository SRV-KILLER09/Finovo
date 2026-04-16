'use server';

/**
 * @fileOverview AI-powered financial health reports for students.
 *
 * - generateFinancialHealthReport - A function that generates financial health reports.
 * - FinancialHealthReportInput - The input type for the generateFinancialHealthReport function.
 * - FinancialHealthReportOutput - The return type for the generateFinancialHealthReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialHealthReportInputSchema = z.object({
  income: z.number().describe('Total income for the period.'),
  expenses: z.number().describe('Total expenses for the period.'),
  savings: z.number().describe('Total savings for the period.'),
  goals: z.array(z.string()).describe('List of financial goals.'),
  period: z.enum(['weekly', 'monthly']).describe('The period for the report.'),
});

export type FinancialHealthReportInput = z.infer<
  typeof FinancialHealthReportInputSchema
>;

const FinancialHealthReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the financial health report.'),
  recommendations: z
    .array(z.string())
    .describe('Recommendations for improving financial health.'),
});

export type FinancialHealthReportOutput = z.infer<
  typeof FinancialHealthReportOutputSchema
>;

export async function generateFinancialHealthReport(
  input: FinancialHealthReportInput
): Promise<FinancialHealthReportOutput> {
  return financialHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialHealthReportPrompt',
  input: {schema: FinancialHealthReportInputSchema},
  output: {schema: FinancialHealthReportOutputSchema},
  prompt: `You are a financial advisor specializing in helping students manage their finances.

  Generate a {{period}} financial health report based on the following information:

  Income: {{{income}}}
  Expenses: {{{expenses}}}
  Savings: {{{savings}}}
  Goals: {{#each goals}}- {{{this}}}\n{{/each}}

  Provide a summary of the student's financial health and offer personalized recommendations for improvement.
`,
});

const financialHealthReportFlow = ai.defineFlow(
  {
    name: 'financialHealthReportFlow',
    inputSchema: FinancialHealthReportInputSchema,
    outputSchema: FinancialHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
