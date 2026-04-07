'use server';
/**
 * @fileOverview A Genkit flow for the AI-Powered Driver Communication Assistant.
 *
 * - generateDriverCommunicationMessages - A function that generates quick, relevant messages for drivers.
 * - DriverCommunicationAssistantInput - The input type for the generateDriverCommunicationMessages function.
 * - DriverCommunicationAssistantOutput - The return type for the generateDriverCommunicationMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DriverCommunicationAssistantInputSchema = z.object({
  tripStatus: z
    .enum([
      'en_route',
      'arrived_at_pickup',
      'waiting_for_rider',
      'ride_started',
      'approaching_destination',
      'other',
    ])
    .describe("The current status of the driver's trip."),
  timeToArrivalMinutes: z
    .number()
    .optional()
    .describe('Estimated time to arrival in minutes, if applicable.'),
  riderName: z.string().optional().describe("The rider's name, if available."),
  pickupLocationDescription: z
    .string()
    .optional()
    .describe('A brief description of the pickup location.'),
  destinationDescription: z
    .string()
    .optional()
    .describe('A brief description of the destination.'),
});
export type DriverCommunicationAssistantInput = z.infer<
  typeof DriverCommunicationAssistantInputSchema
>;

const DriverCommunicationAssistantOutputSchema = z.object({
  suggestedMessages: z
    .array(z.string())
    .describe(
      'A list of suggested quick communication messages for the driver to send to the rider.'
    ),
});
export type DriverCommunicationAssistantOutput = z.infer<
  typeof DriverCommunicationAssistantOutputSchema
>;

export async function generateDriverCommunicationMessages(
  input: DriverCommunicationAssistantInput
): Promise<DriverCommunicationAssistantOutput> {
  return driverCommunicationAssistantFlow(input);
}

const communicationPrompt = ai.definePrompt({
  name: 'driverCommunicationPrompt',
  input: {schema: DriverCommunicationAssistantInputSchema},
  output: {schema: DriverCommunicationAssistantOutputSchema},
  prompt: `You are a helpful communication assistant for a ride-sharing app named TOTO. Your goal is to suggest quick, relevant messages for a driver to send to their rider.

Current Trip Status: {{{tripStatus}}}

{{#if timeToArrivalMinutes}}
Estimated Time to Arrival: {{timeToArrivalMinutes}} minutes
{{/if}}

{{#if riderName}}
Rider's Name: {{{riderName}}}
{{/if}}

{{#if pickupLocationDescription}}
Pickup Location: {{{pickupLocationDescription}}}
{{/if}}

{{#if destinationDescription}}
Destination: {{{destinationDescription}}}
{{/if}}

Based on the current trip status and provided details, suggest 3-5 short, professional, and helpful messages that a driver can send to their rider. The messages should be contextual and easy to understand. Do not include any introductory or concluding remarks, just the list of messages.

Examples:
If tripStatus is 'en_route' and timeToArrivalMinutes is 5:
- "I'm on my way, arriving in about 5 minutes."
- "Heading your way now!"
- "See you soon!"

If tripStatus is 'arrived_at_pickup':
- "I've arrived at your pickup location."
- "I'm here."
- "Your TOTO is waiting!"

If tripStatus is 'waiting_for_rider':
- "I'm waiting at the pickup location."
- "Are you ready? I'm here."
- "Please let me know when you're ready to leave."

If tripStatus is 'ride_started':
- "Enjoy your ride!"
- "We are on our way."
- "Let me know if you need anything."

If tripStatus is 'approaching_destination' and riderName is "John":
- "We're almost at your destination, John."
- "Arriving shortly."
- "Thank you for riding with TOTO!"
`,
});

const driverCommunicationAssistantFlow = ai.defineFlow(
  {
    name: 'driverCommunicationAssistantFlow',
    inputSchema: DriverCommunicationAssistantInputSchema,
    outputSchema: DriverCommunicationAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await communicationPrompt(input);
    return output!;
  }
);
