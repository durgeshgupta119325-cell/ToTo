"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ArrowLeft, MapPin, Car, Zap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function BookRidePage() {
  const { toast } = useToast();
  const [step, setStep] = useState<'search' | 'options' | 'confirmed'>('search');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  const mapImage = PlaceHolderImages.find((img) => img.id === 'book-ride-map');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      setStep('options');
    } else {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both pickup and destination locations.',
      });
    }
  };

  const handleSelectRide = (rideType: string) => {
    setStep('confirmed');
    toast({
      title: 'Ride Booked!',
      description: `Your ${rideType} is on the way.`,
    });
  };

  const handleNewBooking = () => {
      setPickup('');
      setDestination('');
      setStep('search');
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/support">Support</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Home
                </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-secondary">
        <div className="container flex flex-col items-center justify-center gap-6 py-12 md:py-16">
          {step === 'search' && (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Book Your Ride</CardTitle>
                <CardDescription>Enter your pickup and drop-off locations.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Pickup Location"
                      className="pl-10"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Destination"
                      className="pl-10"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Find a Ride
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'options' && (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Select a Ride</CardTitle>
                    <CardDescription>Choose a ride that suits you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mapImage && (
                        <div className="overflow-hidden rounded-lg border">
                            <Image
                                alt="Map"
                                src={mapImage.imageUrl}
                                width={800}
                                height={400}
                                className="aspect-video w-full object-cover"
                                data-ai-hint={mapImage.imageHint}
                            />
                        </div>
                    )}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSelectRide('E-Rickshaw')}
                            className="flex w-full items-center justify-between rounded-lg border bg-background p-4 text-left transition-colors hover:bg-accent"
                        >
                            <div className="flex items-center gap-4">
                                <Zap className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-bold">E-Rickshaw</p>
                                    <p className="text-sm text-muted-foreground">Eco-friendly & affordable</p>
                                </div>
                            </div>
                            <p className="font-semibold">₹50</p>
                        </button>
                        <button
                            onClick={() => handleSelectRide('Cab')}
                            className="flex w-full items-center justify-between rounded-lg border bg-background p-4 text-left transition-colors hover:bg-accent"
                        >
                            <div className="flex items-center gap-4">
                                <Car className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-bold">Cab</p>
                                    <p className="text-sm text-muted-foreground">Comfortable & private</p>
                                </div>
                            </div>
                            <p className="font-semibold">₹120</p>
                        </button>
                    </div>
                     <Button variant="outline" className="w-full" onClick={() => setStep('search')}>
                        Go Back
                    </Button>
                </CardContent>
            </Card>
          )}
          
          {step === 'confirmed' && (
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Your Ride is Confirmed!</CardTitle>
                    <CardDescription>Your driver is on the way to your pickup location.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 text-left">
                        <p className="font-semibold">From: <span className="font-normal">{pickup}</span></p>
                        <p className="font-semibold">To: <span className="font-normal">{destination}</span></p>
                    </div>
                     <Button className="w-full" onClick={handleNewBooking}>Book Another Ride</Button>
                </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
