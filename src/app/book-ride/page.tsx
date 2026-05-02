"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ArrowLeft, MapPin, Car, Zap, Globe } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { BOOK_RIDE_SERVICE_AREAS, DEFAULT_RATES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

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
      // Simulate distance calculation
      const randomDistance = parseFloat((Math.random() * (10 - 1) + 1).toFixed(1)); // 1.0 to 10.0 km
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
      <main className="flex-1 bg-secondary py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            
            {/* Left Side: Booking Flow */}
            <div className="space-y-6 order-2 lg:order-1">
                {step === 'search' && (
                    <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Book Your Ride</CardTitle>
                        <CardDescription>Enter your pickup and drop-off locations. Service area is limited to a 10km range within active cities.</CardDescription>
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
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Select a Ride</CardTitle>
                            <CardDescription>
                            Your ride is approximately {distance} km. Choose a ride that suits you.
                            {isNight && <span className="block pt-1 text-xs text-primary font-medium">Night surcharge (9pm - 6am) applied.</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {rideOptions.map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => handleSelectRide(option.type)}
                                        className="flex w-full items-center justify-between rounded-lg border bg-background p-4 text-left transition-colors hover:bg-accent group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <option.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{option.type}</p>
                                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-lg">₹{option.fare}</p>
                                    </button>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full" onClick={() => setStep('search')}>
                                Change Locations
                            </Button>
                        </CardContent>
                    </Card>
                )}
                
                {step === 'confirmed' && (
                    <Card className="w-full text-center">
                        <CardHeader>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-2">
                                <Car className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl">Ride Confirmed!</CardTitle>
                            <CardDescription>Your driver is heading to your pickup location.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border bg-muted/50 p-4 text-left space-y-2">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="h-fit">From</Badge>
                                    <p className="text-sm">{pickup}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="h-fit">To</Badge>
                                    <p className="text-sm">{destination}</p>
                                </div>
                            </div>
                            <Button className="w-full" onClick={handleNewBooking}>Book Another Ride</Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Side: Map and Info */}
            <div className="space-y-6 order-1 lg:order-2">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Service Area Map
                        </CardTitle>
                        <CardDescription>
                            Currently available in: {availableCities.map(c => c.city).join(', ')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl border bg-muted aspect-video shadow-inner">
                            {mapImage ? (
                                <Image
                                    alt="Service Map"
                                    src={mapImage.imageUrl}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="city map"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    Map Loading...
                                </div>
                            )}
                            
                            {/* Simulated Overlays for Pick and Drop */}
                            {step !== 'search' && (
                                <>
                                    <div className="absolute top-1/4 left-1/3 p-2 bg-primary text-primary-foreground rounded-full animate-bounce shadow-lg z-10">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="absolute bottom-1/3 right-1/4 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg z-10">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                                        <line x1="33%" y1="25%" x2="75%" y2="66%" stroke="currentColor" strokeWidth="4" strokeDasharray="8,8" className="text-primary animate-pulse" />
                                    </svg>
                                </>
                            )}

                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                <div className="flex flex-wrap gap-2">
                                    {availableCities.map((city, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-background/90 backdrop-blur-sm border-primary/20">
                                            {city.city}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm p-2 bg-muted/30 rounded-lg">
                            <div className="space-y-1">
                                <p className="font-semibold">Service Range</p>
                                <p className="text-muted-foreground">Max 10km per ride</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="font-semibold">Support</p>
                                <p className="text-muted-foreground">24/7 Assistance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-4">
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            * The map visualization represents our current operational boundaries. Exact pickup and drop-off markers are simulated based on your input.
                        </p>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
