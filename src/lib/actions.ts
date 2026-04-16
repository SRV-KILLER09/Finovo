
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateFinancialHealthReport } from '@/ai/flows/financial-health-reports';
import { chatWithBot } from '@/ai/flows/chatbot';
import type { ChatbotOutput, ChatbotInput } from '@/ai/flows/chatbot';
import { splitBill } from '@/ai/flows/bill-splitter';
import { validateItr } from '@/ai/flows/itr-validator';
import type { ItrInput } from '@/ai/flows/itr-validator';
import { format } from 'date-fns';


export async function loginAction(prevState: any, formData: FormData) {
  // In a real app, you'd validate credentials here.
  await new Promise(resolve => setTimeout(resolve, 1000));
  redirect('/dashboard');
}

export async function registerAction(prevState: any, formData: FormData) {
  // In a real app, you'd create a new user here.
  await new Promise(resolve => setTimeout(resolve, 1000));
  redirect('/dashboard?new_user=true');
}

export async function setup2faAction(prevState: any, formData: FormData) {
    // In a real app, you'd save the 2FA PIN for the user.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

const reportSchema = z.object({
  income: z.coerce.number().positive('Income must be a positive number.'),
  expenses: z.coerce.number().positive('Expenses must be a positive number.'),
  savings: z.coerce.number().nonnegative('Savings cannot be negative.'),
  goals: z.string().min(3, 'Please specify your financial goals.'),
  period: z.enum(['weekly', 'monthly']),
});

export async function generateReportAction(
  prevState: any,
  formData: FormData
) {
    const goals = formData.get('goals') as string;
    const validatedFields = reportSchema.safeParse({
        income: formData.get('income'),
        expenses: formData.get('expenses'),
        savings: formData.get('savings'),
        goals: goals,
        period: formData.get('period'),
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessage = Object.values(fieldErrors).flat()[0] || "Invalid input.";
        return {
            output: null,
            error: errorMessage,
        };
    }

    try {
        const { goals, ...rest } = validatedFields.data;
        const output = await generateFinancialHealthReport({
            ...rest,
            goals: goals.split(',').map(g => g.trim())
        });
        return { output, error: null };
    } catch (e) {
        return {
            output: null,
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}

const chatSchema = z.object({
  userMessage: z.string().min(1, 'Message cannot be empty.'),
});

// This is a new, simplified action specifically for the popover chat.
export async function streamChat(
  input: ChatbotInput
): Promise<ChatbotOutput> {
  const validatedFields = chatSchema.safeParse({
    userMessage: input.userMessage,
  });

  if (!validatedFields.success) {
    return {
        answer: validatedFields.error.flatten().fieldErrors.userMessage?.[0] ?? "Invalid input."
    }
  }

  try {
    const botResponse = await chatWithBot({ userMessage: validatedFields.data.userMessage });
    return botResponse;
  } catch(e) {
    return {
        answer: 'The AI assistant is currently unavailable. Please try again later.',
    }
  }
}


export async function chatWithBotAction(
  prevState: { botResponse: ChatbotOutput | null; error: string | null },
  formData: FormData
) {
  const validatedFields = chatSchema.safeParse({
    userMessage: formData.get('userMessage'),
  });

  if (!validatedFields.success) {
    return {
      botResponse: null,
      error: validatedFields.error.flatten().fieldErrors.userMessage?.[0] ?? "Invalid input."
    };
  }
  
  try {
    const botResponse = await chatWithBot({ userMessage: validatedFields.data.userMessage });
    return { botResponse, error: null };
  } catch(e) {
    return {
        botResponse: null,
        error: 'The AI assistant is currently unavailable. Please try again later.',
    }
  }
}

const paymentSchema = z.object({
  upiId: z.string().min(3, "Please enter a valid UPI ID."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  note: z.string().optional(),
});

export async function sendMoneyAction(formData: FormData) {
  const validatedFields = paymentSchema.safeParse({
    upiId: formData.get("upiId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(fieldErrors).flat()[0] || "Invalid input.";
    return {
      success: false,
      message: errorMessage,
    };
  }
  
  try {
    const { upiId, amount, note } = validatedFields.data;
    
    // In a real app, you would:
    // 1. Verify the current user's identity and balance.
    // 2. Verify the recipient's UPI ID exists.
    // 3. Perform the transaction in a database (e.g., Firestore).
    // For now, we will simulate this.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate points
    const pointsEarned = amount / 1000;
    
    // In a real app, you would add these points to the user's document in Firestore.

    return { 
      success: true, 
      message: `Successfully sent FC ${amount.toLocaleString()} to ${upiId} and earned ${pointsEarned.toFixed(2)} points.` 
    };

  } catch(e) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

const billSplitterSchema = z.object({
  description: z.string().min(10, 'Please provide a detailed description of the bill.'),
});

export async function splitBillAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = billSplitterSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      output: null,
      error: validatedFields.error.flatten().fieldErrors.description?.[0] ?? "Invalid input."
    };
  }

  try {
    const output = await splitBill({ description: validatedFields.data.description });
    return { output, error: null };
  } catch (e) {
    return {
      output: null,
      error: 'An unexpected AI error occurred. Please try a different description or try again later.',
    };
  }
}

const itrItemSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const itrSchema = z.object({
    incomeData: z.string().transform((str, ctx) => {
        try {
            return z.array(itrItemSchema).parse(JSON.parse(str));
        } catch (e) {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON for income data' });
            return z.NEVER;
        }
    }),
    deductionData: z.string().transform((str, ctx) => {
        try {
            return z.array(itrItemSchema).parse(JSON.parse(str));
        } catch (e) {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON for deduction data' });
            return z.NEVER;
        }
    })
});

export async function validateItrAction(
  prevState: any,
  formData: FormData,
) {
  const validatedFields = itrSchema.safeParse({
      incomeData: formData.get('incomeData'),
      deductionData: formData.get('deductionData')
  });

  if (!validatedFields.success) {
    return {
      output: null,
      error: "Invalid data provided for ITR validation."
    };
  }

  try {
    const output = await validateItr(validatedFields.data);
    return { output, error: null };
  } catch (e) {
    return {
      output: null,
      error: 'An unexpected AI error occurred during validation. Please try again.',
    };
  }
}
