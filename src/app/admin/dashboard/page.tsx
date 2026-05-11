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
  Activity,
  History,
  ShieldAlert,
  ShieldCheck,
  Smartphone
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  const liveRidesQuery = useMemo(() => query(collection(db, 'rides'), orderBy('createdAt', 'desc'), limit(20)), [db]);
  const { data: liveRides } = useCollectionData(liveRidesQuery);

  const stats = useMemo(() => {
    if (!liveRides) return { totalRides: 0, grossVolume: 0, activeCount: 0 };
    const completed = liveRides.filter((r: any) => r.status === 'completed');
    const active = liveRides.filter((r: any) => r.status !== 'completed' && r.status !== 'cancelled');
    const gross = completed.reduce((acc: number, r: any) => acc + (r.fare || 0), 0);
    return { 
      totalRides: completed.length, 
      grossVolume: gross,
      activeCount: active.length
    };
  }, [liveRides]);

  const handleLogout = () => {
    toast({ title: 'Logged Out' });
    router.push('/admin/login');
  };

  const states = useMemo(() => Array.from(new Set(DUMMY_LOCATIONS_DATA.map(l => l.state))).sort(), []);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold hidden md:inline">Command Console</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">System Intelligence</h1>
              <p className="text-sm text-muted-foreground font-medium">Monitoring urban mobility and platform performance.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 py-1.5 px-3">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                NETWORK ACTIVE
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border h-11 w-full justify-start overflow-x-auto p-1 shadow-inner">
              <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Operations</TabsTrigger>
              <TabsTrigger value="hubs" className="gap-2"><Globe className="h-4 w-4" /> Geography</TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2"><Car className="h-4 w-4" /> Fleet</TabsTrigger>
              <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Protocol</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Nodes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.activeCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gross Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹{stats.grossVolume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Partners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{DUMMY_DRIVERS.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Live Transaction Stream</CardTitle>
                        <CardDescription>Real-time verification of trip handshake codes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ride ID</TableHead>
                                    <TableHead>Participant (Rider)</TableHead>
                                    <TableHead>Participant (Driver)</TableHead>
                                    <TableHead>Handshake Code</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Audit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liveRides?.map((ride: any) => (
                                    <TableRow key={ride.id} className="group transition-colors">
                                        <TableCell className="font-bold text-xs font-mono">{ride.id}</TableCell>
                                        <TableCell className="text-xs">{ride.customerName}</TableCell>
                                        <TableCell className="text-xs">{ride.driverName || <span className="text-muted-foreground italic">Pending...</span>}</TableCell>
                                        <TableCell className="font-black text-primary tracking-widest">{ride.otp}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="secondary"
                                                className={cn(
                                                    "text-[10px] uppercase font-bold",
                                                    ride.status === 'completed' && 'bg-green-100 text-green-700',
                                                    ride.status === 'started' && 'bg-blue-100 text-blue-700',
                                                    ride.status === 'pending' && 'bg-orange-100 text-orange-700'
                                                )}
                                            >
                                                {ride.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {ride.otpUsed ? (
                                                <BadgeCheck className="h-4 w-4 text-green-500 inline-block" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-muted-foreground inline-block" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hubs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Geographic Distribution</h2>
                        <p className="text-xs text-muted-foreground font-medium">Operational service ranges and active hubs.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="font-bold"><Plus className="mr-2 h-4 w-4" /> Add Hub</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Hub Registration</DialogTitle>
                                <DialogDescription>Register a new urban operational sector.</DialogDescription>
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
                                    <Input placeholder="E.g. Lucknow" value={newHub.city} onChange={e => setNewHub({...newHub, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Operational Radius (KM)</Label>
                                    <Input type="number" placeholder="25" value={newHub.range} onChange={e => setNewHub({...newHub, range: e.target.value})} />
                                </div>
                                <Button className="w-full h-12 font-bold" onClick={() => {
                                    toast({ title: "Hub Online", description: `${newHub.city} sector activated.` });
                                    setNewHub({ state: '', city: '', range: '10' });
                                }}>Activate Node</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Urban Sector</TableHead>
                                <TableHead>Territory</TableHead>
                                <TableHead>Radius</TableHead>
                                <TableHead className="text-right">Protocol Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BOOK_RIDE_SERVICE_AREAS.map((area, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-bold">{area.city}</TableCell>
                                    <TableCell>{area.state}</TableCell>
                                    <TableCell>{area.range} KM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={area.active ? 'default' : 'secondary'} className={cn(area.active && "bg-green-500")}>
                                            {area.active ? 'Operational' : 'Paused'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Partner Fleet</h2>
                        <p className="text-xs text-muted-foreground font-medium">Management of driver credentials and assets.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner</TableHead>
                                <TableHead>Security Contact</TableHead>
                                <TableHead>Asset Class</TableHead>
                                <TableHead className="text-right">Total Payouts</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_DRIVERS.map(d => (
                                <TableRow key={d.uid}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarImage src={d.profilePic} />
                                                <AvatarFallback>{d.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-bold text-sm">{d.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">{d.phone}</TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <p className="font-bold text-primary uppercase">{d.vehicleType}</p>
                                            <p className="text-muted-foreground font-mono uppercase">{d.vehicleNumber}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-primary">₹{d.grossEarnings.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">User Directory</h2>
                        <p className="text-xs text-muted-foreground font-medium">Verified customer profiles and account status.</p>
                    </div>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Profile</TableHead>
                                <TableHead>Contact (Phone/Email)</TableHead>
                                <TableHead>Primary Hub</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Risk Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DUMMY_CUSTOMERS.map(c => (
                                <TableRow key={c.uid}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border-2 border-primary/20">
                                                <AvatarImage src={c.profilePic} />
                                                <AvatarFallback className="bg-primary/5">{c.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm">{c.name}</p>
                                                <p className="text-[9px] font-mono text-muted-foreground">{c.uid}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[10px] space-y-1">
                                            <p className="font-bold">{c.phone}</p>
                                            <p className="text-muted-foreground italic">{c.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium">{c.city}, {c.state}</TableCell>
                                    <TableCell className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {c.isBlocked ? (
                                            <Badge variant="destructive" className="text-[9px] uppercase"><ShieldAlert className="h-3 w-3 mr-1" /> Blocked</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] uppercase border-green-200 text-green-700 bg-green-50"><ShieldCheck className="h-3 w-3 mr-1" /> Safe</Badge>
                                        )}
                                    </TableCell>
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
                            <CardTitle>Monetary Policy</CardTitle>
                            <CardDescription>Global pricing adjustments for mobility nodes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Fare Class (₹/KM)</Label>
                                <Input defaultValue="15" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Platform Base Charge</Label>
                                <Input defaultValue="50" type="number" />
                            </div>
                            <Button className="w-full h-11 font-bold shadow-lg shadow-primary/10">Synchronize Rates</Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Commission Engine</CardTitle>
                            <CardDescription>Service fees derived from partner earnings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Global Protocol Fee (%)</Label>
                                <Input defaultValue="20" type="number" />
                            </div >
                            <div className="space-y-2">
                                <Label>Surge Threshold (Multiplier)</Label>
                                <Input defaultValue="1.5" step="0.1" type="number" />
                            </div>
                            <Button variant="secondary" className="w-full h-11 font-bold">Apply Logic</Button>
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