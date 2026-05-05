
"use client";

import Link from 'next/link';
import Image from 'next/image';
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
  AlertCircle
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

import { useState, useEffect, useMemo } from 'react';
import { DUMMY_DRIVERS, DUMMY_CUSTOMERS, DUMMY_LOCATIONS_DATA, ADMIN_DASHBOARD_STATS, DEFAULT_RATES, MOCK_PAYMENTS, MOCK_SETTLEMENTS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [driverList, setDriverList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual Payment State
  const [manualEntry, setManualEntry] = useState({
    rideId: '',
    customer: '',
    driver: '',
    amount: '',
    mode: 'UPI',
    status: 'success'
  });

  useEffect(() => {
    const storedDrivers = localStorage.getItem('toto-admin-drivers');
    setDriverList(storedDrivers ? JSON.parse(storedDrivers) : DUMMY_DRIVERS);
  }, []);

  const handleLogout = () => {
    toast({ title: 'Logged Out', description: 'Session ended.' });
    router.push('/admin/login');
  };

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = paymentFilter === 'All' || p.status.toLowerCase() === paymentFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, paymentFilter]);

  const handleManualEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Payment Recorded', description: `Manual entry for ${manualEntry.rideId} has been saved.` });
    setManualEntry({ rideId: '', customer: '', driver: '', amount: '', mode: 'UPI', status: 'success' });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/20">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Admin Console</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Payments & Settlement</h1>
              <p className="text-sm text-muted-foreground">Monitor platform revenue and driver payouts.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Manual Entry</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manual Payment Entry</DialogTitle>
                            <DialogDescription>Record offline payments or reconcile transactions.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleManualEntrySubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ride ID</Label>
                                    <Input value={manualEntry.rideId} onChange={e => setManualEntry({...manualEntry, rideId: e.target.value})} placeholder="RIDE_123" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input type="number" value={manualEntry.amount} onChange={e => setManualEntry({...manualEntry, amount: e.target.value})} placeholder="0.00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Customer Name</Label>
                                <Input value={manualEntry.customer} onChange={e => setManualEntry({...manualEntry, customer: e.target.value})} placeholder="John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Payment Mode</Label>
                                    <Select value={manualEntry.mode} onValueChange={v => setManualEntry({...manualEntry, mode: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={manualEntry.status} onValueChange={v => setManualEntry({...manualEntry, status: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="success">Success</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Record Payment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
          </div>

          <Tabs defaultValue="transactions">
            <TabsList className="bg-background border h-11">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settlements">Driver Settlements</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6 pt-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by Ride ID or Customer..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" /> <SelectValue placeholder="Status Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-none shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Ride ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-bold">{p.id}</TableCell>
                                    <TableCell>{p.customer}</TableCell>
                                    <TableCell className="font-black text-primary">₹{p.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{p.mode}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === 'success' ? 'default' : 'outline'} className={cn(p.status === 'success' && 'bg-green-500 hover:bg-green-600')}>
                                            {p.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Flag Transaction</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </TabsContent>

            <TabsContent value="settlements" className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground">PENDING SETTLEMENTS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-destructive">₹18,450</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground">TOTAL COMMISSION</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">₹6,240</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground">ACTIVE DRIVERS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">24</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Driver Payout Report</CardTitle>
                        <CardDescription>Consolidated earnings and settlement status per driver.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Trips</TableHead>
                                    <TableHead>Gross</TableHead>
                                    <TableHead>Comm. (20%)</TableHead>
                                    <TableHead>Net Payout</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_SETTLEMENTS.map((s) => (
                                    <TableRow key={s.driverId}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{s.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{s.driverId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{s.trips}</TableCell>
                                        <TableCell>₹{s.gross}</TableCell>
                                        <TableCell className="text-destructive">₹{s.commission}</TableCell>
                                        <TableCell className="font-black">₹{s.net}</TableCell>
                                        <TableCell>
                                            <Badge variant={s.settled === 'Yes' ? 'default' : 'outline'} className={cn(s.settled === 'Yes' && 'bg-green-500')}>
                                                {s.settled === 'Yes' ? 'SETTLED' : 'PENDING'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant={s.settled === 'Yes' ? 'outline' : 'default'} disabled={s.settled === 'Yes'}>
                                                {s.settled === 'Yes' ? 'Completed' : 'Pay Now'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reconciliation" className="pt-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-12 text-center space-y-4">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Automated Reconciliation</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">This tool matches bank statements with platform records to detect discrepancies automatically.</p>
                        </div>
                        <Button className="mt-4">Run Reconciliation Scan</Button>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
