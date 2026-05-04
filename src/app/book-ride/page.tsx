
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { ArrowLeft, MapPin, Car, Zap, Globe, Plus, Minus, Navigation, Search, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { BOOK_RIDE_SERVICE_AREAS, DEFAULT_RATES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type RideOption = {
    type: string;
    description: string;
    icon: React.ElementType;
    fare: number;
};

export default function BookRidePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  
  const [step, setStep] = useState<'search' | 'options' | 'requesting' | 'confirmed' | 'arrived' | 'started'>('search');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<RideOption | null>(null);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [currentRideData, setCurrentRideData] = useState<any>(null);
  const [countdown, setCountdown] = useState(60);

  const mapImage = useMemo(() => PlaceHolderImages.find((img) => img.id === 'book-ride-map'), []);
  const availableCities = BOOK_RIDE_SERVICE_AREAS.filter(area => area.active);

  // Listen to ride updates
  useEffect(() => {
    if (!currentRideId) return;

    const unsubscribe = onSnapshot(doc(db, 'rides', currentRideId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentRideData(data);
        
        if (data.status === 'accepted') setStep('confirmed');
        if (data.status === 'arrived') setStep('arrived');
        if (data.status === 'started') setStep('started');
      }
    }, async (err) => {
        const permissionError = new FirestorePermissionError({
          path: `rides/${currentRideId}`,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return () => unsubscribe();
  }, [currentRideId, db]);

  // Handle 60s countdown for broad search
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'requesting' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (step === 'requesting' && countdown === 0) {
      // Fallback to searching all drivers
      if (currentRideId) {
        updateDoc(doc(db, 'rides', currentRideId), { status: 'searching_all' });
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown, currentRideId, db]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      const randomDistance = parseFloat((Math.random() * (10 - 1) + 1).toFixed(1));
      setDistance(randomDistance);
      setStep('options');
    } else {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please specify both your current location and destination.',
      });
    }
  };

  const handleRequestRide = (option: RideOption) => {
    if (!user) {
        toast({ title: "Login Required", description: "Please log in to book a ride." });
        return;
    }

    const rideId = `RIDE_${Date.now()}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const rideData = {
        id: rideId,
        customerId: user.uid,
        customerName: user.displayName || 'Customer',
        pickup,
        destination,
        fare: option.fare,
        status: 'pending',
        otp,
        timestamp: serverTimestamp(),
        distance,
        type: option.type
    };

    setDoc(doc(db, 'rides', rideId), rideData)
        .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
                path: `rides/${rideId}`,
                operation: 'create',
                requestResourceData: rideData
            });
            errorEmitter.emit('permission-error', permissionError);
        });

    setSelectedOption(option);
    setCurrentRideId(rideId);
    setCountdown(60);
    setStep('requesting');
  };

  const handleNewBooking = () => {
      setPickup('');
      setDestination('');
      setStep('search');
      setCurrentRideId(null);
      setCurrentRideData(null);
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
                                <strong>TOTO Cities:</strong> Operational in select city hubs.
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
                            {[
                                { type: 'E-Rickshaw', description: 'Eco-friendly & affordable', icon: Zap, fare: Math.round(distance! * DEFAULT_RATES.erickshaw) },
                                { type: 'Cab', description: 'Comfortable & private', icon: Car, fare: Math.round(distance! * DEFAULT_RATES.cab) }
                            ].map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => handleRequestRide(option)}
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
                        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setStep('search')}>
                            Edit Locations
                        </Button>
                    </div>
                )}

                {step === 'requesting' && (
                    <div className="space-y-6 py-8 text-center animate-in fade-in duration-500">
                        <div className="flex justify-center">
                            <div className="relative h-24 w-24">
                                <Loader2 className="h-24 w-24 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icons.TotoLogo className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Finding a Driver...</h2>
                            <p className="text-sm text-muted-foreground">
                                {countdown > 0 
                                    ? `Requesting nearest drivers (${countdown}s)` 
                                    : "Broadcasting to all nearby drivers..."}
                            </p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleNewBooking}>Cancel Request</Button>
                    </div>
                )}
                
                {(step === 'confirmed' || step === 'arrived' || step === 'started') && currentRideData && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center shadow-lg",
                                step === 'started' ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                            )}>
                                {step === 'started' ? <CheckCircle2 className="h-8 w-8" /> : <Car className="h-8 w-8 animate-bounce" />}
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">
                                    {step === 'confirmed' && "Driver on the way!"}
                                    {step === 'arrived' && "Driver has arrived!"}
                                    {step === 'started' && "Trip Started!"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {step === 'confirmed' && `Driver ${currentRideData.driverName} is expected in 10 mins.`}
                                    {step === 'arrived' && "Please share the OTP below with your driver."}
                                    {step === 'started' && "Enjoy your TOTO ride!"}
                                </p>
                            </div>
                        </div>

                        <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 text-center space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Ride OTP</p>
                                <div className="text-4xl font-black tracking-[0.5em] text-primary">
                                    {currentRideData.otp}
                                </div>
                                <p className="text-[10px] text-muted-foreground">Share this only with your driver at pickup.</p>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl border bg-muted/30 p-4 text-sm space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                        <Navigation className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{currentRideData.driverName}</p>
                                        <p className="text-[10px] text-muted-foreground">★ 4.8 Rating</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-background">₹{currentRideData.fare}</Badge>
                            </div>
                            <div className="space-y-2 pt-1">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground truncate">{currentRideData.pickup}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-xs text-muted-foreground truncate">{currentRideData.destination}</p>
                                </div>
                            </div>
                        </div>

                        {step === 'started' ? (
                            <Button size="lg" className="w-full" onClick={handleNewBooking}>Complete Trip</Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex-1">Help</Button>
                                <Button className="flex-1">Emergency</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-auto p-6 border-t bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Active City Hubs</span>
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
                    <Input placeholder="Search Maps" className="border-none focus-visible:ring-0 shadow-none h-8 text-sm px-0" readOnly />
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
                        data-ai-hint="urban google maps"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>
                )}
                
                {step !== 'search' && (
                    <div className="absolute inset-0">
                        {/* Pickup Marker */}
                        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
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

                        {/* Drop Marker */}
                        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
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

                        {/* Driver Simulation Marker */}
                        {(step === 'confirmed' || step === 'arrived') && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in duration-500">
                                <div className="flex flex-col items-center">
                                     <div className="bg-background border-2 border-green-500 rounded-lg px-2 py-1 shadow-lg text-[10px] font-bold mb-1 whitespace-nowrap">
                                        Driver: {currentRideData?.driverName}
                                    </div>
                                    <div className="p-2 bg-green-500 text-white rounded-full shadow-xl animate-pulse">
                                        <Car className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                            <line x1="25%" y1="33%" x2="75%" y2="66%" stroke="currentColor" strokeWidth="4" strokeDasharray="10,10" className="text-primary/60 animate-pulse" />
                        </svg>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
