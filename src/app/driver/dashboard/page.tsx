"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  generateDriverCommunicationMessages,
  type DriverCommunicationAssistantInput,
} from '@/ai/flows/driver-communication-assistant';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { LogOut, MessageSquare, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TripStatus = DriverCommunicationAssistantInput['tripStatus'];

export default function DriverDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [tripStatus, setTripStatus] = useState<TripStatus>('en_route');
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateMessages = async () => {
    setIsLoading(true);
    setSuggestedMessages([]);
    try {
      const { suggestedMessages: messages } =
        await generateDriverCommunicationMessages({
          tripStatus,
          riderName: 'Jane', // Example rider name
        });
      setSuggestedMessages(messages);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Messages',
        description:
          'There was a problem generating messages. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/driver/login');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/driver/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Driver Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>AI Communication Assistant</CardTitle>
                  <CardDescription>
                    Generate quick messages to send to your rider.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="trip-status"
                  className="text-sm font-medium"
                >
                  Current Trip Status
                </label>
                <Select
                  value={tripStatus}
                  onValueChange={(value) => setTripStatus(value as TripStatus)}
                >
                  <SelectTrigger id="trip-status">
                    <SelectValue placeholder="Select trip status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_route">En Route to Pickup</SelectItem>
                    <SelectItem value="arrived_at_pickup">
                      Arrived at Pickup
                    </SelectItem>
                    <SelectItem value="waiting_for_rider">
                      Waiting for Rider
                    </SelectItem>
                    <SelectItem value="ride_started">Ride Started</SelectItem>
                    <SelectItem value="approaching_destination">
                      Approaching Destination
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateMessages}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Messages'}
              </Button>

              <div className="space-y-4">
                <h3 className="font-semibold">Suggested Messages:</h3>
                <div className="space-y-3">
                  {isLoading && (
                    <>
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </>
                  )}
                  {suggestedMessages.map((message, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg border bg-background p-3"
                    >
                      <p className="text-sm">{message}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(message);
                          toast({ title: 'Copied to clipboard!' });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {!isLoading && suggestedMessages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Click "Generate Messages" to see suggestions.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
