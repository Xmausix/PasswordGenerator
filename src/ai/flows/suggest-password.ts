// src/ai/flows/suggest-password.ts
'use server';
/**
 * @fileOverview Password suggestion flow using AI.
 *
 * - suggestPassword - A function that generates password suggestions based on user preferences.
 * - SuggestPasswordInput - The input type for the suggestPassword function.
 * - SuggestPasswordOutput - The return type for the suggestPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPasswordInputSchema = z.object({
    length: z.number().describe('The desired length of the password.'),
    complexity: z
        .string()
        .describe(
            'The desired complexity of the password (e.g., high, medium, low).'
        ),
    keywords: z
        .string()
        .optional()
        .describe(
            'Optional keywords or phrases to include in the password to make it more memorable.'
        ),
});
export type SuggestPasswordInput = z.infer<typeof SuggestPasswordInputSchema>;

const SuggestPasswordOutputSchema = z.object({
    password: z.string().describe('The generated password suggestion.'),
    strength: z.string().describe('The strength of the generated password.'),
    reason: z.string().optional().describe('The reason behind the strength.'),
});
export type SuggestPasswordOutput = z.infer<typeof SuggestPasswordOutputSchema>;

export async function suggestPassword(
    input: SuggestPasswordInput
): Promise<SuggestPasswordOutput> {
    return suggestPasswordFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestPasswordPrompt',
    input: {schema: SuggestPasswordInputSchema},
    output: {schema: SuggestPasswordOutputSchema},
    prompt: `You are a password expert who suggests strong and memorable passwords based on user preferences.

  Generate a password based on the following criteria:
  - Length: {{{length}}} characters
  - Complexity: {{{complexity}}}
  {{#if keywords}}
  - Keywords: {{{keywords}}}
  {{/if}}

  The password should be strong and difficult to guess, but also relatively easy to remember.
  Also, provide a password strength indicator (strong, medium, weak) and the reason for it.
  `,
});

const suggestPasswordFlow = ai.defineFlow(
    {
        name: 'suggestPasswordFlow',
        inputSchema: SuggestPasswordInputSchema,
        outputSchema: SuggestPasswordOutputSchema,
    },
    async input => {
        const {output} = await prompt(input);
        return output!;
    }
);
