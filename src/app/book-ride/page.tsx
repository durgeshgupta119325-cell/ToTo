
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
    Truck, MapPin, Map as MapIcon, LocateFixed
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollectionData, useMemoFirebase } from '@/firebase';
import { doc, setDoc, onSnapshot, deleteDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getGeoCell, getNearbyCells, calculateDistance, calculateMatchingScore } from '@/lib/geo';

type VehicleType = 'Mini' | 'Sedan' | 'SUV' | 'Auto';

type RideOption = {
    type: VehicleType;
    description: string;
    icon: React.ElementType;
    fare: number;
    eta: number;
};

// Mock Geocoding Data for the Prototype
const MOCK_LOCATIONS: Record<string, { lat: number, lng: number }> = {
    'Boring Road': { lat: 25.6171, lng: 85.1165 },
    'Patna Junction': { lat: 25.6022, lng: 85.1376 },
    'Kankarbagh': { lat: 25.5979, lng: 85.1524 },
    'Patliputra': { lat: 25.6322, lng: 85.1012 },
    'Airport': { lat: 25.5912, lng: 85.0881 },
    'Gandhi Maidan': { lat: 25.6156, lng: 85.1432 },
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
  const [isMatching, setIsMatching] = useState(false);

  const mapImage = useMemo(() => PlaceHolderImages.find((img) => img.id === 'book-ride-map'), []);

  // Live Service Areas from Firestore
  const hubsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'service_areas'), where('active', '==', true));
  }, [db]);
  const { data: availableCities, loading: hubsLoading } = useCollectionData(hubsQuery);

  const rideOptions: RideOption[] = useMemo(() => {
    if (distance === null) return [];
    // Dynamic Pricing Engine based on Distance
    return [
        { type: 'Auto', description: 'Affordable, open-air rides', icon: Zap, fare: Math.round(distance * 12 + 20), eta: 3 },
        { type: 'Mini', description: 'Comfy, compact hatchbacks', icon: Car, fare: Math.round(distance * 15 + 40), eta: 5 },
        { type: 'Sedan', description: 'Spacious, premium sedans', icon: ShieldCheck, fare: Math.round(distance * 20 + 60), eta: 4 },
        { type: 'SUV', description: 'Large SUVs for groups', icon: Truck, fare: Math.round(distance * 30 + 100), eta: 8 },
    ];
  }, [distance]);

  useEffect(() => {
    if (!currentRideId || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'rides', currentRideId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentRideData(data);
        if (data.status === 'accepted') {
            setStep('confirmed');
            toast({ title: "Partner Found!", description: "A driver has accepted your request." });
        }
      }
    }, (err) => {
        // Handled by FirebaseErrorListener
    });

    return () => unsubscribe();
  }, [currentRideId, db, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      // Simulate Geocoding
      const pCoord = MOCK_LOCATIONS[pickup] || { lat: 25.5941, lng: 85.1376 };
      const dCoord = MOCK_LOCATIONS[destination] || { lat: 25.6100, lng: 85.1500 };
      
      // Calculate Real Haversine Distance
      const realDist = calculateDistance(pCoord.lat, pCoord.lng, dCoord.lat, dCoord.lng);
      setDistance(parseFloat(realDist.toFixed(2)));
      setStep('options');
      toast({ title: "Map Synchronized", description: `Distance calculated: ${realDist.toFixed(2)} km` });
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

  const findBestPartner = async (pickupLat: number, pickupLng: number) => {
    if (!db) return null;
    const targetCells = getNearbyCells(pickupLat, pickupLng, 1);
    const q = query(
        collection(db, 'driver_locations'),
        where('isOnline', '==', true),
        where('isAvailable', '==', true),
        where('geoCell', 'in', targetCells)
    );

    const snapshot = await getDocs(q);
    const candidates = snapshot.docs.map(d => d.data());

    if (candidates.length === 0) return null;

    const scoredCandidates = candidates.map(c => {
        const dist = calculateDistance(pickupLat, pickupLng, c.lat, c.lng);
        const score = calculateMatchingScore({
            distance: dist,
            rating: c.rating || 5,
            isAvailable: true
        });
        return { ...c, score, dist };
    });

    return scoredCandidates.sort((a, b) => b.score - a.score)[0];
  };

  const handleConfirmBooking = async () => {
    if (!selectedOption || !user || !distance || !db) return;

    setIsMatching(true);
    const pCoord = MOCK_LOCATIONS[pickup] || { lat: 25.5941, lng: 85.1376 };
    const dCoord = MOCK_LOCATIONS[destination] || { lat: 25.6100, lng: 85.1500 };
    
    const bestPartner = await findBestPartner(pCoord.lat, pCoord.lng);

    const rideId = `RIDE_${Date.now()}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    const rideData = {
        rideId: rideId,
        customerId: user.uid,
        customerName: user.displayName || 'Customer',
        status: 'requested',
        driverId: bestPartner?.driverId || null,
        pickup: {
            address: pickup,
            lat: pCoord.lat,
            lng: pCoord.lng,
            geoCell: getGeoCell(pCoord.lat, pCoord.lng)
        },
        dropoff: {
            address: destination,
            lat: dCoord.lat,
            lng: dCoord.lng
        },
        fare: selectedOption.fare,
        distance: distance,
        paymentMethod: 'cash',
        otp: otp,
        createdAt: new Date().toISOString(),
        vehicleType: selectedOption.type,
        matchingScore: bestPartner?.score || 0
    };

    setDoc(doc(db, 'rides', rideId), rideData).then(() => {
        setCurrentRideId(rideId);
        setCurrentRideData(rideData);
        setStep('requesting');
        setIsMatching(false);
        setIsConfirmModalOpen(false);

        if (bestPartner) {
            toast({ title: "Scanning Network", description: `Found a match! Dispatching to partner.` });
        } else {
            toast({ variant: "destructive", title: "Busy Network", description: "No drivers in your sector. Still searching..." });
        }
    });
  };

  const handleCancelRide = () => {
    if (currentRideId && db) {
        deleteDoc(doc(db, 'rides', currentRideId));
        setCurrentRideId(null);
        setCurrentRideData(null);
        setStep('search');
        toast({ title: "Ride Cancelled" });
    }
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
                    <div className="space-y-6">
                        <h1 className="text-2xl font-black tracking-tight italic uppercase">Where to?</h1>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="space-y-3">
                                <div className="relative">
                                    <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                    <Input
                                        placeholder="Pickup location"
                                        className="h-12 bg-secondary/30 border-none pl-10"
                                        list="locations"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                                    <Input
                                        placeholder="Destination location"
                                        className="h-12 bg-secondary/30 border-none pl-10"
                                        list="locations"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                                <datalist id="locations">
                                    {Object.keys(MOCK_LOCATIONS).map(loc => <option key={loc} value={loc} />)}
                                </datalist>
                            </div>
                            <Button type="submit" size="lg" className="w-full h-14 text-lg font-black shadow-lg">
                                CALCULATE TRIP
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'options' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" size="sm" onClick={() => setStep('search')} className="-ml-2">
                                <ArrowLeft className="h-4 w-4 mr-1" /> Back
                            </Button>
                            <Badge variant="secondary" className="px-3 py-1 font-bold">{distance} km route</Badge>
                        </div>
                        
                        <div className="space-y-3">
                            {rideOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => handleOpenConfirm(option)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all",
                                        selectedOption?.type === option.type ? "border-primary bg-primary/5" : "border-transparent bg-secondary/20"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm">
                                            <option.icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-black text-base italic uppercase">{option.type}</p>
                                            <p className="text-[10px] text-muted-foreground">{option.description}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-lg">₹{option.fare}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'requesting' && (
                    <div className="space-y-8 animate-in fade-in duration-500 py-12 text-center">
                        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-4 rounded-full border-4 border-secondary animate-pulse" />
                            <Search className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black uppercase italic">Scanning Operational Grid</h2>
                            <p className="text-xs text-muted-foreground font-medium">Matching your request with the highest scored partner nodes in sector {currentRideData?.pickup?.geoCell}.</p>
                        </div>
                        <Button variant="ghost" className="text-destructive font-black text-xs h-10" onClick={handleCancelRide}>
                            ABORT DISPATCH
                        </Button>
                    </div>
                )}

                {step === 'confirmed' && currentRideId && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="text-center space-y-2">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                            <h2 className="text-2xl font-black uppercase italic">Partner Assigned</h2>
                            <p className="text-sm text-muted-foreground">Verification handshake confirmed.</p>
                        </div>

                        <Card className="border-4 border-primary/30 bg-primary/5 shadow-inner py-8 text-center space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Handshake Code</p>
                            <div className="text-6xl font-black tracking-[0.2em] text-primary">
                                {currentRideData?.otp}
                            </div>
                            <p className="text-xs font-bold text-foreground">Share this with your partner to start trip</p>
                        </Card>

                        <div className="flex flex-col gap-3">
                             <Button variant="outline" className="h-12 font-black uppercase">Message Node</Button>
                             <Button variant="ghost" className="text-destructive font-black text-xs" onClick={handleCancelRide}>Cancel My Ride</Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto p-6 border-t bg-muted/20">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span>Urban Hubs</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Live</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {availableCities?.map((area: any) => (
                        <Badge key={area.id} variant="secondary" className="text-[9px] bg-background border-none h-6 px-2 font-black uppercase">{area.city}</Badge>
                    ))}
                </div>
            </div>
          </div>

          <div className="relative h-full w-full bg-secondary/10 overflow-hidden">
            {/* Simulation of a Google Map visualization with route overlays */}
            <div className="absolute inset-0 z-0">
                {mapImage && (
                    <Image
                        alt="Urban Grid"
                        src={mapImage.imageUrl}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                )}
            </div>
            
            {/* Real-time Overlay for Trip Data */}
            <div className="absolute top-4 left-4 right-4 flex justify-center z-10">
                <Card className="bg-background/90 backdrop-blur border-none shadow-2xl p-4 flex items-center gap-6 max-w-md w-full">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase">{pickup || 'Pickup'}</span>
                    </div>
                    <div className="flex-1 h-px bg-muted border-t-2 border-dashed border-primary/30 relative">
                        {distance && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black px-2 rounded-full text-[8px] font-bold">
                                {distance} KM
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase">{destination || 'Dropoff'}</span>
                        <div className="h-2 w-2 rounded-full bg-destructive" />
                    </div>
                </Card>
            </div>

            {/* Simulated UI Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg"><LocateFixed className="h-4 w-4" /></Button>
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg"><MapIcon className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
                <div className="bg-primary/10 p-6 border-b border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic">Initialize Dispatch</DialogTitle>
                        <DialogDescription className="font-medium">Triggering the matching engine for your selection.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary/20 rounded-xl">
                        <div className="h-10 w-10 bg-background rounded-lg flex items-center justify-center">
                            {selectedOption?.icon && <selectedOption.icon className="h-6 w-6 text-primary" />}
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase italic">{selectedOption?.type}</p>
                            <p className="text-[10px] text-muted-foreground">Approx ₹{selectedOption?.fare}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl border space-y-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Trip Distance</p>
                        <p className="text-lg font-black">{distance} KM</p>
                        <p className="text-[10px] text-muted-foreground font-medium italic">Fares are calculated based on real-time grid distance.</p>
                    </div>
                </div>
                <DialogFooter className="p-6 bg-secondary/10 flex-row gap-3">
                    <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)} className="flex-1 font-bold">Cancel</Button>
                    <Button onClick={handleConfirmBooking} disabled={isMatching} className="flex-1 font-black h-12 shadow-lg">
                        {isMatching ? <Loader2 className="animate-spin" /> : 'CONFIRM DISPATCH'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
