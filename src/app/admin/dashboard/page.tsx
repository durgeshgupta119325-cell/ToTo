
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
  Car,
  Users,
  IndianRupee,
  MoreHorizontal,
  Trash2,
  Percent,
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

import { useState } from 'react';

// Mock Data
const drivers = [
  {
    id: 'DRV001',
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    vehicleNumber: 'MH12AB1234',
    accountNumber: '...1234',
    grossEarnings: 12500,
  },
  {
    id: 'DRV002',
    name: 'Suresh Singh',
    email: 'suresh@example.com',
    vehicleNumber: 'DL01CD5678',
    accountNumber: '...5678',
    grossEarnings: 9800,
  },
  {
    id: 'DRV003',
    name: 'Deepak Verma',
    email: 'deepak@example.com',
    vehicleNumber: 'KA05EF9012',
    accountNumber: '...9012',
    grossEarnings: 15200,
  },
];

const customers = [
  {
    id: 'CUST001',
    name: 'Anjali Sharma',
    email: 'anjali@example.com',
    phone: '9876543210',
    rides: [
      {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        time: '2023-10-27 10:00 AM',
        transactionId: 'TXN001',
      },
      {
        rideId: 'RIDE002',
        from: 'Cyber Hub',
        to: 'Ambience Mall',
        time: '2023-10-26 08:30 PM',
        transactionId: 'TXN002',
      },
    ],
  },
  {
    id: 'CUST002',
    name: 'Vikram Batra',
    email: 'vikram@example.com',
    phone: '9123456780',
    rides: [
      {
        rideId: 'RIDE003',
        from: 'Koramangala',
        to: 'MG Road',
        time: '2023-10-27 11:00 AM',
        transactionId: 'TXN003',
      },
    ],
  },
];

const ALL_AVAILABLE_CITIES = [
    { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { city: 'Vijayawada', state: 'Andhra Pradesh' },
    { city: 'Guntur', state: 'Andhra Pradesh' },
    { city: 'Guwahati', state: 'Assam' },
    { city: 'Patna', state: 'Bihar' },
    { city: 'Chandigarh', state: 'Chandigarh' },
    { city: 'Raipur', state: 'Chhattisgarh' },
    { city: 'Bhilai', state: 'Chhattisgarh' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Surat', state: 'Gujarat' },
    { city: 'Vadodara', state: 'Gujarat' },
    { city: 'Rajkot', state: 'Gujarat' },
    { city: 'Gurugram', state: 'Haryana' },
    { city: 'Faridabad', state: 'Haryana' },
    { city: 'Shimla', state: 'Himachal Pradesh' },
    { city: 'Ranchi', state: 'Jharkhand' },
    { city: 'Jamshedpur', state: 'Jharkhand' },
    { city: 'Srinagar', state: 'Jammu and Kashmir' },
    { city: 'Jammu', state: 'Jammu and Kashmir' },
    { city: 'Bengaluru', state: 'Karnataka' },
    { city: 'Mysore', state: 'Karnataka' },
    { city: 'Mangalore', state: 'Karnataka' },
    { city: 'Hubli-Dharwad', state: 'Karnataka' },
    { city: 'Kochi', state: 'Kerala' },
    { city: 'Thiruvananthapuram', state: 'Kerala' },
    { city: 'Kozhikode', state: 'Kerala' },
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Indore', state: 'Madhya Pradesh' },
    { city: 'Gwalior', state: 'Madhya Pradesh' },
    { city: 'Jabalpur', state: 'Madhya Pradesh' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Nagpur', state: 'Maharashtra' },
    { city: 'Thane', state: 'Maharashtra' },
    { city: 'Pimpri-Chinchwad', state: 'Maharashtra' },
    { city: 'Nashik', state: 'Maharashtra' },
    { city: 'Aurangabad', state: 'Maharashtra' },
    { city: 'Solapur', state: 'Maharashtra' },
    { city: 'Navi Mumbai', state: 'Maharashtra' },
    { city: 'Bhubaneswar', state: 'Odisha' },
    { city: 'Cuttack', state: 'Odisha' },
    { city: 'Ludhiana', state: 'Punjab' },
    { city: 'Amritsar', state: 'Punjab' },
    { city: 'Jalandhar', state: 'Punjab' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Jodhpur', state: 'Rajasthan' },
    { city: 'Kota', state: 'Rajasthan' },
    { city: 'Udaipur', state: 'Rajasthan' },
    { city: 'Ajmer', state: 'Rajasthan' },
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Coimbatore', state: 'Tamil Nadu' },
    { city: 'Madurai', state: 'Tamil Nadu' },
    { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Warangal', state: 'Telangana' },
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Kanpur', state: 'Uttar Pradesh' },
    { city: 'Noida', state: 'Uttar Pradesh' },
    { city: 'Agra', state: 'Uttar Pradesh' },
    { city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { city: 'Varanasi', state: 'Uttar Pradesh' },
    { city: 'Meerut', state: 'Uttar Pradesh' },
    { city: 'Prayagraj', state: 'Uttar Pradesh' },
    { city: 'Dehradun', state: 'Uttarakhand' },
    { city: 'Kolkata', state: 'West Bengal' },
];


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [driverList, setDriverList] = useState(drivers);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [serviceAreas, setServiceAreas] = useState([
    { id: 1, city: 'Mumbai', state: 'Maharashtra', active: true },
    { id: 2, city: 'Delhi', state: 'Delhi', active: true },
    { id: 3, city: 'Bengaluru', state: 'Karnataka', active: false },
    { id: 4, city: 'Gurugram', state: 'Haryana', active: true },
  ]);
  const [selectedCityToAdd, setSelectedCityToAdd] = useState('');

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/admin/login');
  };

  const handleRemoveDriver = (driverId: string) => {
    setDriverList(driverList.filter((d) => d.id !== driverId));
    toast({
      title: 'Driver Removed',
      description: `Driver ${driverId} has been removed from the platform.`,
    });
  };

  const handleServiceAreaToggle = (id: number) => {
    setServiceAreas(
      serviceAreas.map((area) =>
        area.id === id ? { ...area, active: !area.active } : area
      )
    );
  };

  const handleAddServiceArea = () => {
    if (!selectedCityToAdd) {
        toast({
            variant: 'destructive',
            title: 'No City Selected',
            description: 'Please select a city to add.',
        });
        return;
    }

    const cityDetails = ALL_AVAILABLE_CITIES.find(c => c.city === selectedCityToAdd);

    if (cityDetails) {
        const newArea = {
            id: serviceAreas.length > 0 ? Math.max(...serviceAreas.map(a => a.id)) + 1 : 1,
            ...cityDetails,
            active: true,
        };
        setServiceAreas([...serviceAreas, newArea]);
        setSelectedCityToAdd('');
        toast({
            title: 'Area Added',
            description: `${newArea.city} has been added to your service areas.`,
        });
    }
  };
  
  const handleRemoveServiceArea = (id: number) => {
      const areaToRemove = serviceAreas.find(area => area.id === id);
      setServiceAreas(serviceAreas.filter(area => area.id !== id));
      if (areaToRemove) {
          toast({
              title: 'Area Removed',
              description: `${areaToRemove.city} has been removed from your service areas.`,
          });
      }
  };

  const availableCitiesToAdd = ALL_AVAILABLE_CITIES.filter(
      (potentialCity) => !serviceAreas.some((sa) => sa.city === potentialCity.city)
  );

  // Dummy data for dashboard stats
  const dashboardStats = {
    totalRides: 1250,
    grossVolume: 85230,
    platformCommission: 85230 * 0.02,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Icons.TotoLogo className="h-6 w-auto text-primary" />
            <span className="font-bold">Admin Dashboard</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Console
            </h1>
            <p className="text-muted-foreground">
              Manage your drivers, customers, and platform settings.
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Rides
                    </CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.totalRides.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all drivers
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Drivers
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {driverList.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active on the platform
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Gross Volume
                    </CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{dashboardStats.grossVolume.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total value of all rides
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Platform Commission
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{dashboardStats.platformCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      2% of Gross Volume
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>
                    View, manage, and remove drivers from the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Account No.</TableHead>
                        <TableHead className="text-right">Gross Earnings</TableHead>
                        <TableHead className="text-right">Net Payout</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverList.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">
                            {driver.id}
                          </TableCell>
                          <TableCell>{driver.name}</TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>{driver.vehicleNumber}</TableCell>
                          <TableCell>{driver.accountNumber}</TableCell>
                          <TableCell className="text-right">
                            ₹{driver.grossEarnings.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(driver.grossEarnings * 0.98).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove Driver
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently remove the driver and their
                                    data from the platform.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() =>
                                      handleRemoveDriver(driver.id)
                                    }
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <Dialog>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>
                      View customer details and their ride history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.id}
                            </TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setSelectedCustomer(customer)
                                      }
                                    >
                                      View Ride History
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Ride History for {selectedCustomer.name}
                    </DialogTitle>
                    <DialogDescription>
                      A complete log of all rides taken by the customer.
                    </DialogDescription>
                  </DialogHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ride ID</TableHead>
                        <TableHead>Pick up and drop out</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCustomer.rides.map((ride) => (
                        <TableRow key={ride.rideId}>
                          <TableCell>{ride.rideId}</TableCell>
                          <TableCell>
                            {ride.from} to {ride.to}
                          </TableCell>
                          <TableCell>{ride.time}</TableCell>
                          <TableCell>{ride.transactionId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
               <Card>
                <CardHeader>
                  <CardTitle>Area Management</CardTitle>
                  <CardDescription>
                    Manage the areas where your service is available. Add or remove cities and toggle their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Add a new service area</p>
                            <p className="text-sm text-muted-foreground">Select a city from the list to add it to your operational areas.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={selectedCityToAdd} onValueChange={setSelectedCityToAdd}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCitiesToAdd.length > 0 ? (
                                        availableCitiesToAdd.map(city => (
                                            <SelectItem key={city.city} value={city.city}>{city.city}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>All cities added</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddServiceArea}>Add</Button>
                        </div>
                    </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceAreas.map((area) => (
                        <TableRow key={area.id}>
                          <TableCell className="font-medium">{area.city}</TableCell>
                          <TableCell>{area.state}</TableCell>
                          <TableCell>
                            <Badge variant={area.active ? 'default' : 'secondary'}>
                              {area.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={area.active}
                              onCheckedChange={() => handleServiceAreaToggle(area.id)}
                              aria-label={`Toggle service for ${area.city}`}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Remove
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will remove {area.city} from your list of service areas. You can add it back later if needed.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() =>
                                            handleRemoveServiceArea(area.id)
                                        }
                                    >
                                        Remove
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
