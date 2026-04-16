
'use server';

/**
 * @fileOverview An AI-powered flow to validate and explain a simulated ITR filing.
 *
 * - validateItr - A function that validates ITR data and provides an explanation.
 * - ItrInput - The input type for the validateItr function.
 * - ItrOutput - The return type for the validateItr function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItrItemSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const ItrInputSchema = z.object({
    incomeData: z.array(ItrItemSchema).describe("An array of all income items."),
    deductionData: z.array(ItrItemSchema).describe("An array of all deduction items."),
});
export type ItrInput = z.infer<typeof ItrInputSchema>;

const ItrOutputSchema = z.object({
  isValid: z.boolean().describe("Whether the provided ITR data seems valid and logical."),
  explanation: z.string().describe("A simple, step-by-step explanation of the tax calculation based on the provided data."),
  suggestions: z.array(z.string()).describe("A list of personalized tax-saving suggestions for the user."),
});
export type ItrOutput = z.infer<typeof ItrOutputSchema>;


export async function validateItr(input: ItrInput): Promise<ItrOutput> {
  return itrValidatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'itrValidatorPrompt',
  input: {schema: ItrInputSchema},
  output: {schema: ItrOutputSchema},
  prompt: `You are an AI Tax Advisor for students in India who are new to filing taxes. Your goal is to review their simulated Income Tax Return (ITR) data, validate it, explain the calculation in very simple terms, and offer helpful advice.

  User's ITR Data:
  - Income Items:
  {{#each incomeData}}
    - {{this.name}}: {{{this.amount}}}
  {{/each}}
  - Deduction Items:
  {{#each deductionData}}
    - {{this.name}}: {{{this.amount}}}
  {{/each}}

  Your tasks:
  1.  **Validate:** Briefly check if the data makes sense (e.g., deductions aren't higher than income). Set 'isValid' to true or false.
  2.  **Explain:** Provide a very simple, step-by-step calculation:
      - Start with Gross Total Income (sum of all income).
      - Subtract Total Deductions (sum of all deductions).
      - Arrive at Net Taxable Income.
      - Briefly mention the tax slab it might fall into (assume the new tax regime for simplicity if not specified). Don't do a complex tax calculation, just explain the concept.
  3.  **Suggest:** Provide 2-3 actionable, simple tax-saving tips relevant to a student or a first-time filer. For example, suggest exploring Section 80C with ELSS or PPF, or mentioning tax-saving FDs if they have interest income.

  Generate the validation, explanation, and suggestions based on the user's data.`,
});

const itrValidatorFlow = ai.defineFlow(
  {
    name: 'itrValidatorFlow',
    inputSchema: ItrInputSchema,
    outputSchema: ItrOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
