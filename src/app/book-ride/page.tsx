
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { 
    ArrowLeft, Car, Zap, Navigation, Search, 
    Loader2, CheckCircle2, Copy, Clock, ShieldCheck,
    Truck
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { BOOK_RIDE_SERVICE_AREAS } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type VehicleType = 'Mini' | 'Sedan' | 'SUV' | 'Auto';

type RideOption = {
    type: VehicleType;
    description: string;
    icon: React.ElementType;
    fare: number;
    eta: number;
};

export default function BookRidePage() {
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  
  const [step, setStep] = useState<'search' | 'options' | 'requesting' | 'confirmed'>('search');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<RideOption | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [currentRideData, setCurrentRideData] = useState<any>(null);

  const mapImage = useMemo(() => PlaceHolderImages.find((img) => img.id === 'book-ride-map'), []);
  const availableCities = BOOK_RIDE_SERVICE_AREAS.filter(area => area.active);

  const rideOptions: RideOption[] = useMemo(() => {
    if (!distance) return [];
    return [
        { type: 'Auto', description: 'Affordable, open-air rides', icon: Zap, fare: Math.round(distance * 10), eta: 3 },
        { type: 'Mini', description: 'Comfy, compact hatchbacks', icon: Car, fare: Math.round(distance * 14), eta: 5 },
        { type: 'Sedan', description: 'Spacious, premium sedans', icon: ShieldCheck, fare: Math.round(distance * 18), eta: 4 },
        { type: 'SUV', description: 'Large SUVs for groups', icon: Truck, fare: Math.round(distance * 25), eta: 8 },
    ];
  }, [distance]);

  useEffect(() => {
    if (!currentRideId) return;

    const unsubscribe = onSnapshot(doc(db, 'rides', currentRideId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentRideData(data);
      }
    }, (err) => {
        const permissionError = new FirestorePermissionError({
          path: `rides/${currentRideId}`,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return () => unsubscribe();
  }, [currentRideId, db]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      const randomDistance = parseFloat((Math.random() * (15 - 2) + 2).toFixed(1));
      setDistance(randomDistance);
      setStep('options');
    } else {
      toast({ variant: 'destructive', title: 'Input Required', description: 'Enter pickup and destination.' });
    }
  };

  const handleOpenConfirm = (option: RideOption) => {
    if (!user) {
        toast({ title: "Login Required", description: "Please log in to book." });
        router.push('/customer/login');
        return;
    }
    setSelectedOption(option);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedOption || !user || !distance) return;

    const rideId = `RIDE_${Date.now()}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Aligns with the new schema requirements
    const rideData = {
        rideId: rideId,
        customerId: user.uid,
        customerName: user.displayName || 'Customer',
        status: 'requested',
        pickup: {
            address: pickup,
            lat: 25.5941, // Sample lat
            lng: 85.1376  // Sample lng
        },
        dropoff: {
            address: destination,
            lat: 25.6000, // Sample lat
            lng: 85.1500  // Sample lng
        },
        fare: selectedOption.fare,
        distance: distance,
        duration: Math.round(distance * 3), // Sample duration in minutes
        paymentMethod: 'cash', // Default for now
        paymentStatus: 'pending',
        otp: otp,
        otpUsed: false,
        createdAt: new Date().toISOString(),
        vehicleType: selectedOption.type, // UI helper
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

    // Update Local History
    const storedCustomerRaw = localStorage.getItem('toto-customer');
    if (storedCustomerRaw) {
        try {
            const storedCustomer = JSON.parse(storedCustomerRaw);
            const newRideForHistory = {
                rideId: rideId,
                from: pickup,
                to: destination,
                date: new Date().toLocaleDateString(),
                fare: `₹${selectedOption.fare}`,
                status: 'Booked'
            };
            storedCustomer.rides = [newRideForHistory, ...(storedCustomer.rides || [])];
            localStorage.setItem('toto-customer', JSON.stringify(storedCustomer));
        } catch (e) {
            console.error("Failed to update history", e);
        }
    }

    setIsConfirmModalOpen(false);
    setCurrentRideId(rideId);
    setCurrentRideData(rideData);
    setStep('confirmed');
    toast({ title: "Ride Confirmed!", description: "Share the code with your driver." });
  };

  const handleCancelRide = () => {
    if (currentRideId) {
        deleteDoc(doc(db, 'rides', currentRideId));
        setCurrentRideId(null);
        setCurrentRideData(null);
        setStep('search');
        toast({ title: "Ride Cancelled", description: "Your booking has been removed." });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "OTP copied to clipboard." });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Exit</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <div className="grid h-[calc(100dvh-3.5rem)] w-full lg:grid-cols-[450px_1fr]">
          <div className="z-10 flex flex-col border-r bg-background shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
                {step === 'search' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight">Where to?</h1>
                            <p className="text-sm text-muted-foreground">Select pickup and destination for your trip.</p>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <div className="w-[1px] h-8 bg-border" />
                                        <div className="h-2 w-2 rounded-full bg-destructive" />
                                    </div>
                                    <div className="space-y-2 pl-10">
                                        <div className="relative">
                                            <Input
                                                placeholder="Pickup location"
                                                className="h-12 bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                value={pickup}
                                                onChange={(e) => setPickup(e.target.value)}
                                            />
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold h-7 px-2 text-primary hover:bg-primary/10"
                                                onClick={() => setPickup('My Current Location')}
                                            >
                                                <Navigation className="h-3 w-3 mr-1" /> Use Current
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Destination location"
                                            className="h-12 bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-lg">
                                Find Rides
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'options' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" onClick={() => setStep('search')} className="-ml-2">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back
                            </Button>
                            <Badge variant="secondary" className="px-3 py-1 font-bold">{distance} km trip</Badge>
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Recommended for you</h2>
                            <p className="text-xs text-muted-foreground">Prices include taxes and platform fees.</p>
                        </div>

                        <div className="space-y-3">
                            {rideOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => handleOpenConfirm(option)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md",
                                        selectedOption?.type === option.type ? "border-primary bg-primary/5" : "border-transparent bg-secondary/20"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                                            <option.icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-base">{option.type}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> {option.eta} min
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-tight">{option.description}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-lg">₹{option.fare}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'confirmed' && currentRideData && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="text-center space-y-2">
                            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-7 w-7 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black">Ride Booked Successfully</h2>
                            <p className="text-sm text-muted-foreground">
                                {currentRideData.status === 'started' ? 'Trip in progress' : 'Driver is arriving shortly'}
                            </p>
                        </div>

                        <Card className="border-4 border-primary/30 bg-primary/5 shadow-inner overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-2">
                                <ShieldCheck className="h-5 w-5 text-primary/40" />
                            </div>
                            <CardContent className="pt-8 pb-10 text-center space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Start Trip Code</p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className={cn("text-6xl font-black tracking-[0.2em]", currentRideData.status === 'started' ? "text-muted-foreground line-through opacity-50" : "text-primary")}>
                                        {currentRideData.otp}
                                    </div>
                                    {currentRideData.status !== 'started' && (
                                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10" onClick={() => copyToClipboard(currentRideData.otp)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-foreground">
                                        {currentRideData.status === 'started' ? 'Code Verified' : 'Share this code with your driver'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground italic">Valid until trip starts • Code expires in 10 mins</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-2xl border bg-secondary/10 p-5 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-background border-2 border-primary flex items-center justify-center font-black">
                                        {currentRideData.driverName?.[0] || 'D'}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{currentRideData.driverName || 'Searching...'}</p>
                                        <p className="text-[10px] text-muted-foreground">★ 4.9 • 2.5k Trips</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold">{currentRideData.vehicleType}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground">{currentRideData.vehicleDetails || 'KA-01-AB-1234'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex-1 font-bold h-12">Message</Button>
                                <Button variant="outline" className="flex-1 font-bold h-12">Call</Button>
                            </div>
                            {currentRideData.status !== 'started' && (
                                <Button variant="ghost" className="text-destructive font-black text-xs h-10" onClick={handleCancelRide}>
                                    Cancel My Ride
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto p-6 border-t bg-muted/20">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    <span>TOTO Live Hubs</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Operational</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableCities.map((city, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[9px] bg-background border-none h-6 px-2">{city.city}</Badge>
                    ))}
                </div>
            </div>
          </div>

          <div className="relative h-full w-full bg-secondary/10 overflow-hidden">
            <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none">
                <div className="pointer-events-auto flex items-center bg-background rounded-full shadow-2xl border p-1.5 pl-5 w-full max-w-md group transition-all hover:ring-2 hover:ring-primary/20">
                    <Search className="h-4 w-4 text-muted-foreground mr-3" />
                    <Input placeholder="Search locations..." className="border-none focus-visible:ring-0 shadow-none h-8 text-sm px-0" readOnly />
                    <div className="h-6 w-[1px] bg-border mx-3" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icons.TotoLogo className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {mapImage ? (
                <Image
                    alt="Urban Map"
                    src={mapImage.imageUrl}
                    fill
                    className="object-cover transition-opacity duration-1000"
                    priority
                    data-ai-hint="urban street map"
                />
            ) : (
                <div className="flex h-full items-center justify-center bg-muted/30">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
            )}
          </div>
        </div>

        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary/10 p-6 border-b border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Confirm Ride</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium">Verify your trip details before booking.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-xl">
                            <div className="h-10 w-10 bg-background rounded-lg flex items-center justify-center shadow-sm">
                                {selectedOption?.icon && <selectedOption.icon className="h-6 w-6 text-primary" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black">{selectedOption?.type} Ride</p>
                                <p className="text-[10px] text-muted-foreground">Estimated ₹{selectedOption?.fare}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pl-2">
                             <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Pickup</p>
                                    <p className="text-xs font-semibold">{pickup}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-destructive mt-1.5" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Destination</p>
                                    <p className="text-xs font-semibold">{destination}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-6 bg-secondary/10 flex-row gap-3">
                    <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)} className="flex-1 font-bold">Cancel</Button>
                    <Button onClick={handleConfirmBooking} className="flex-1 font-black h-12 shadow-lg">Confirm Ride</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
