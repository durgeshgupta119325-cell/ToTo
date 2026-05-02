
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ArrowLeft, MapPin, Car, Zap, Globe, Plus, Minus, Navigation, Search, Info } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { BOOK_RIDE_SERVICE_AREAS, DEFAULT_RATES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type RideOption = {
    type: string;
    description: string;
    icon: React.ElementType;
    fare: number;
};

export default function BookRidePage() {
  const { toast } = useToast();
  const [step, setStep] = useState<'search' | 'options' | 'confirmed'>('search');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [isNight, setIsNight] = useState(false);

  const mapImage = useMemo(() => PlaceHolderImages.find((img) => img.id === 'book-ride-map'), []);
  
  const availableCities = BOOK_RIDE_SERVICE_AREAS.filter(area => area.active);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      const randomDistance = parseFloat((Math.random() * (10 - 1) + 1).toFixed(1));
      setDistance(randomDistance);

      const now = new Date();
      const currentHour = now.getHours();
      const isNightTime = currentHour >= 21 || currentHour < 6;
      setIsNight(isNightTime);

      const baseFareErickshaw = randomDistance * DEFAULT_RATES.erickshaw;
      const baseFareCab = randomDistance * DEFAULT_RATES.cab;

      const finalFareErickshaw = isNightTime ? baseFareErickshaw * 1.05 : baseFareErickshaw;
      const finalFareCab = isNightTime ? baseFareCab * 1.05 : baseFareCab;

      const options: RideOption[] = [
        {
          type: 'E-Rickshaw',
          description: 'Eco-friendly & affordable',
          icon: Zap,
          fare: Math.round(finalFareErickshaw),
        },
        {
          type: 'Cab',
          description: 'Comfortable & private',
          icon: Car,
          fare: Math.round(finalFareCab),
        },
      ];
      setRideOptions(options);
      setStep('options');
      toast({
          title: "Route Calculated",
          description: `Journey distance: ${randomDistance} km`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please specify both your current location and destination.',
      });
    }
  };

  const handleSelectRide = (rideType: string) => {
    setStep('confirmed');
    toast({
      title: 'Success!',
      description: `Your ${rideType} booking is confirmed.`,
    });
  };

  const handleNewBooking = () => {
      setPickup('');
      setDestination('');
      setStep('search');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Exit
                </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <div className="grid h-[calc(100dvh-3.5rem)] w-full lg:grid-cols-[400px_1fr]">
          
          <div className="z-10 flex flex-col border-r bg-background shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Book Your Ride</h1>
                    <p className="text-sm text-muted-foreground">Select pickup and drop-off points to continue.</p>
                </div>

                {step === 'search' && (
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Pickup</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Set pickup location..."
                                    className="pl-9 h-12 bg-secondary/50 border-none"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                <Input
                                    placeholder="Where to?"
                                    className="pl-9 h-12 bg-secondary/50 border-none"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" size="lg" className="w-full h-12">
                            See Available Rides
                        </Button>
                        <div className="pt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <strong>TOTO Cities:</strong> We're currently operational in select city centers.
                            </p>
                        </div>
                    </form>
                )}

                {step === 'options' && (
                    <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold">Choose a Vehicle</h2>
                            <Badge variant="secondary">{distance} km</Badge>
                        </div>
                        <div className="space-y-3">
                            {rideOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => handleSelectRide(option.type)}
                                    className="flex w-full items-center justify-between rounded-xl border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <option.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base">{option.type}</p>
                                            <p className="text-xs text-muted-foreground">{option.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">₹{option.fare}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {isNight && (
                            <p className="text-[11px] text-primary font-medium bg-primary/5 p-2 rounded text-center">
                                Night surcharge active (21:00 - 06:00).
                            </p>
                        )}
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setStep('search')}>
                            Edit Locations
                        </Button>
                    </div>
                )}
                
                {step === 'confirmed' && (
                    <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-inner">
                            <Navigation className="h-10 w-10 text-green-600 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                            <p className="text-sm text-muted-foreground">Your driver will arrive shortly.</p>
                        </div>
                        <div className="rounded-xl border bg-muted/30 p-4 text-left space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-xs truncate font-medium text-muted-foreground">{pickup}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-destructive" />
                                <p className="text-xs truncate font-medium text-muted-foreground">{destination}</p>
                            </div>
                        </div>
                        <Button size="lg" className="w-full" onClick={handleNewBooking}>Track Live Status</Button>
                    </div>
                )}
            </div>

            <div className="mt-auto p-6 border-t bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Active Hubs</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Live</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {availableCities.map((city, idx) => (
                        <Badge key={idx} variant="outline" className="bg-background">{city.city}</Badge>
                    ))}
                </div>
            </div>
          </div>

          <div className="relative h-full w-full bg-secondary/30 overflow-hidden">
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center bg-background rounded-lg shadow-lg border p-1 pl-4 w-full max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input 
                        placeholder="Search Maps" 
                        className="border-none focus-visible:ring-0 shadow-none h-8 text-sm px-0"
                        readOnly
                    />
                    <div className="h-6 w-[1px] bg-border mx-2" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Icons.TotoLogo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-2">
                <div className="flex flex-col bg-background rounded-lg shadow-lg border overflow-hidden">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-b"><Plus className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none"><Minus className="h-4 w-4" /></Button>
                </div>
                <Button variant="secondary" size="icon" className="h-10 w-10 shadow-lg bg-background hover:bg-background/90">
                    <Navigation className="h-4 w-4 text-primary" />
                </Button>
            </div>

            <div className="relative h-full w-full">
                {mapImage ? (
                    <Image
                        alt="Urban Map Interface"
                        src={mapImage.imageUrl}
                        fill
                        className="object-cover transition-opacity duration-700"
                        priority
                        data-ai-hint="google maps city"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <Icons.TotoLogo className="h-12 w-12 text-primary/20 animate-pulse" />
                    </div>
                )}
                
                {step !== 'search' && (
                    <div className="absolute inset-0">
                        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in fade-in duration-1000">
                            <div className="bg-background border-2 border-primary rounded-lg px-2 py-1 shadow-lg text-[10px] font-bold mb-1 whitespace-nowrap">
                                Pickup Point
                            </div>
                            <div className="relative flex h-10 w-10 items-center justify-center">
                                <div className="absolute h-full w-full rounded-full bg-primary opacity-20 animate-ping" />
                                <div className="relative z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 flex flex-col items-center animate-in fade-in duration-1000 delay-300">
                             <div className="bg-background border-2 border-destructive rounded-lg px-2 py-1 shadow-lg text-[10px] font-bold mb-1 whitespace-nowrap">
                                Destination
                            </div>
                            <div className="relative flex h-10 w-10 items-center justify-center">
                                <div className="absolute h-full w-full rounded-full bg-destructive opacity-20 animate-ping" />
                                <div className="relative z-10 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                            <line 
                                x1="25%" y1="33%" x2="75%" y2="66%" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                strokeDasharray="10,10" 
                                className="text-primary/60 animate-pulse" 
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-4 z-20 hidden md:block">
                <div className="bg-background/90 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-xs font-medium">TOTO Hubs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-xs font-medium">Drivers Live</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
