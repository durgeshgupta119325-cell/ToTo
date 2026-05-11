
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { CheckCircle2, IndianRupee, CreditCard, Wallet, Banknote, Download, ArrowLeft, ArrowRight, Ticket, Loader2, Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDocData } from '@/firebase';
import { doc, updateDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CustomerPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const rideId = params.rideId as string;
  
  const rideRef = useMemo(() => rideId ? doc(db, 'rides', rideId) : null, [rideId, db]);
  const { data: ride, loading } = useDocData(rideRef);

  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card' | 'Cash' | 'Wallet' | null>(null);
  const [coupon, setCoupon] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState<string | null>(null);

  // Review State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const breakdown = useMemo(() => {
    if (!ride) return null;
    const base = Math.round(ride.fare * 0.7);
    const dist = Math.round(ride.fare * 0.15);
    const plat = 15;
    const gst = Math.round(ride.fare * 0.05);
    return { base, dist, plat, gst, total: ride.fare };
  }, [ride]);

  const handlePay = async () => {
    if (!paymentMode || !ride) {
      toast({ variant: 'destructive', title: 'Payment Method Required', description: 'Please select a payment method.' });
      return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    const generatedTxnId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTxnId(generatedTxnId);
    
    if (rideRef) {
      updateDoc(rideRef, {
        paymentStatus: 'paid',
        paymentMethod: paymentMode.toLowerCase(),
        razorpayPaymentId: generatedTxnId,
        status: 'completed',
        completedAt: new Date().toISOString()
      });

      const transactionData = {
        transactionId: generatedTxnId,
        userId: ride.customerId,
        type: 'debit',
        amount: ride.fare,
        description: `Ride payment - ${ride.rideId}`,
        status: 'success',
        razorpayPaymentId: generatedTxnId,
        createdAt: new Date().toISOString()
      };
      setDoc(doc(db, 'transactions', generatedTxnId), transactionData);

      if (ride.driverId) {
        const driverTxnId = `TXN_DRV_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const driverAmount = Math.round(ride.fare * 0.8);
        const driverTransactionData = {
          transactionId: driverTxnId,
          userId: ride.driverId,
          type: 'credit',
          amount: driverAmount,
          description: `Ride earnings - ${ride.rideId}`,
          status: 'success',
          razorpayPaymentId: generatedTxnId,
          createdAt: new Date().toISOString()
        };
        setDoc(doc(db, 'transactions', driverTxnId), driverTransactionData);
      }
    }

    setIsProcessing(false);
    setIsSuccess(true);
    toast({ title: 'Payment Successful', description: 'Your transaction has been confirmed.' });
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({ variant: 'destructive', title: 'Rating Required', description: 'Please select a star rating.' });
      return;
    }

    const reviewData = {
      rideId: ride?.rideId,
      driverId: ride?.driverId,
      customerId: ride?.customerId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    addDoc(collection(db, 'reviews'), reviewData)
      .then(() => {
        setReviewSubmitted(true);
        toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
      });
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!ride) return <div className="p-8 text-center">Ride not found.</div>;

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 p-4 md:p-8">
      <div className="mx-auto max-w-2xl w-full space-y-6">
        <header className="flex items-center justify-between mb-4">
          <Link href="/customer/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Button>
          </Link>
          <Icons.TotoLogo className="h-8 w-auto text-primary" />
        </header>

        {!isSuccess ? (
          <div className="grid gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="bg-primary/10 px-6 py-3 flex justify-between items-center border-b border-primary/20">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Trip Summary</span>
                    <Badge variant="outline" className="bg-background border-primary/20">{ride.rideId}</Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Driver</p>
                      <p className="font-bold">{ride.driverName || 'TOTO Driver'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Distance</p>
                      <p className="font-bold">{ride.distance} km</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <p className="truncate"><span className="text-muted-foreground mr-1">From:</span> {ride.pickup.address}</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-destructive mt-1.5" />
                      <p className="truncate"><span className="text-muted-foreground mr-1">To:</span> {ride.dropoff.address}</p>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Fare Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>₹{breakdown?.base}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance Charge</span>
                  <span>₹{breakdown?.dist}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>₹{breakdown?.plat}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span>₹{breakdown?.gst}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-black text-xl">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{breakdown?.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'UPI', icon: Wallet, label: 'UPI' },
                    { id: 'Card', icon: CreditCard, label: 'Card' },
                    { id: 'Cash', icon: Banknote, label: 'Cash' },
                    { id: 'Wallet', icon: Wallet, label: 'Wallet' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMode(mode.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                        paymentMode === mode.id ? "border-primary bg-primary/5" : "border-muted"
                      )}
                    >
                      <mode.icon className={cn("h-6 w-6", paymentMode === mode.id ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-xs font-bold">{mode.label}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full h-12 text-lg font-bold" onClick={handlePay} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : `PAY ₹${breakdown?.total}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Trip Completed!</h2>
                  <p className="text-muted-foreground text-sm">Successfully paid ₹{ride.fare} using {paymentMode}</p>
                </div>
                
                {!reviewSubmitted ? (
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
                    <p className="text-sm font-bold">Rate your ride with {ride.driverName || 'TOTO Driver'}</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-95"
                        >
                          <Star 
                            className={cn(
                              "h-8 w-8",
                              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground opacity-30"
                            )} 
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea 
                      placeholder="Any comments for the driver?" 
                      className="bg-background"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button className="w-full h-11 font-bold" onClick={handleSubmitReview}>
                      <Send className="h-4 w-4 mr-2" /> Submit Review
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border bg-green-50 border-green-200 text-green-700 text-sm font-medium">
                    Thank you for sharing your experience!
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="h-11">
                    <Download className="mr-2 h-4 w-4" /> Download Invoice
                  </Button>
                  <Button className="h-11" asChild>
                    <Link href="/customer/dashboard">Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
