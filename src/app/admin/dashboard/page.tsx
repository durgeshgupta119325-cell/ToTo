
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import {
  LogOut,
  Users,
  IndianRupee,
  MoreHorizontal,
  Trash2,
  Percent,
  User,
  Send,
  Car,
  MapPin,
  CheckCircle2,
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  BadgeCheck,
  AlertCircle,
  LayoutDashboard,
  Globe,
  Settings,
  Clock,
  Navigation,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { useState, useMemo } from 'react';
import { useFirestore, useCollectionData } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { BOOK_RIDE_SERVICE_AREAS, DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [newHub, setNewHub] = useState({ state: '', city: '', range: '10' });

  // Live monitor query
  const liveRidesQuery = useMemo(() => query(collection(db, 'rides'), orderBy('timestamp', 'desc'), limit(15)), [db]);
  const { data: liveRides } = useCollectionData(liveRidesQuery);

  const stats = useMemo(() => {
    if (!liveRides) return { totalRides: 0, grossVolume: 0 };
    const completed = liveRides.filter((r: any) => r.status === 'completed');
    const gross = completed.reduce((acc: number, r: any) => acc + (r.fare || 0), 0);
    return { totalRides: completed.length, grossVolume: gross };
  }, [liveRides]);

  const handleLogout = () => {
    toast({ title: 'Logged Out' });
    router.push('/admin/login');
  };

  const states = useMemo(() => Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort(), []);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Admin Console</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Command Center</h1>
            <p className="text-sm text-muted-foreground">Real-time platform monitoring and management.</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Live Monitor</TabsTrigger>
              <TabsTrigger value="hubs">City Hubs</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Live Rides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{liveRides?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Revenue (Recent)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{stats.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">System Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge className="bg-green-500">OPERATIONAL</Badge>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Active Activity Monitor</CardTitle>
                        <CardDescription>Real-time view of customer OTPs and driver verifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Code (OTP)</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Activity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.id}>
                                        <TableCell className="font-bold">{ride.id}</TableCell>
                                        <TableCell>{ride.customerName}</TableCell>
                                        <TableCell>{ride.driverName || 'Searching...'}</TableCell>
                                        <TableCell className="font-black text-primary">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={ride.status === 'completed' ? 'default' : 'outline'} 
                                                className={cn(
                                                    ride.status === 'completed' && 'bg-green-500 hover:bg-green-600',
                                                    ride.status === 'started' && 'bg-blue-500 hover:bg-blue-600 text-white border-none'
                                                )}
                                            >
                                                {ride.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">Verified</Badge>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> Waiting
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!liveRides || liveRides.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No active ride activity detected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Service Area Management</h2>
                        <p className="text-xs text-muted-foreground">Control operational range and city visibility.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Hub</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Hub Registration</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4 pt-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="space-y-2">
                                    <Label>State</Label>
                                    <Select onValueChange={v => setNewHub({...newHub, state: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input placeholder="City Name" value={newHub.city} onChange={e => setNewHub({...newHub, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Range (KM)</Label>
                                    <Input type="number" placeholder="25" value={newHub.range} onChange={e => setNewHub({...newHub, range: e.target.value})} />
                                </div>
                                <Button className="w-full" onClick={() => {
                                    toast({ title: "Hub Registered", description: `${newHub.city} is now operational.` });
                                    setNewHub({ state: '', city: '', range: '10' });
                                }}>Register Hub</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>City</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>Radius</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-bold">{area.city}</TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>{area.range} km</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={area.active ? 'default' : 'secondary'}>
                                            {area.active ? 'Active' : 'Offline'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead className="text-right">Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map(d => (
                                <TableRow key={d.id}>
                                    <TableCell className="font-bold">{d.name}</TableCell>
                                    <TableCell>{d.mobile}</TableCell>
                                    <TableCell>{d.vehicleType} ({d.vehicleNumber})</TableCell>
                                    <TableCell className="text-right font-black">₹{d.grossEarnings.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Fare Settings</CardTitle>
                            <CardDescription>Base platform rates for different vehicle classes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Rate (₹/km)</Label>
                                <Input defaultValue="15" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Base Fare (Min. Charge)</Label>
                                <Input defaultValue="50" type="number" />
                            </div>
                            <Button className="w-full">Update Rates</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Commission Rules</CardTitle>
                            <CardDescription>Platform cut from driver earnings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Platform Cut (%)</Label>
                                <Input defaultValue="20" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Night Surge Multiplier</Label>
                                <Input defaultValue="1.5" step="0.1" type="number" />
                            </div>
                            <Button variant="secondary" className="w-full">Apply Rules</Button>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
