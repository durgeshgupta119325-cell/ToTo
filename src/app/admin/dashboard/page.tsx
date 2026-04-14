
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

const LOCATIONS_DATA = [
    { state: 'Andhra Pradesh', district: 'Visakhapatnam', city: 'Visakhapatnam' },
    { state: 'Andhra Pradesh', district: 'Krishna', city: 'Vijayawada' },
    { state: 'Andhra Pradesh', district: 'Guntur', city: 'Guntur' },
    { state: 'Assam', district: 'Kamrup Metropolitan', city: 'Guwahati' },
    { state: 'Bihar', district: 'Patna', city: 'Patna' },
    { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh' },
    { state: 'Chhattisgarh', district: 'Raipur', city: 'Raipur' },
    { state: 'Chhattisgarh', district: 'Durg', city: 'Bhilai' },
    { state: 'Delhi', district: 'New Delhi', city: 'Delhi' },
    { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad' },
    { state: 'Gujarat', district: 'Surat', city: 'Surat' },
    { state: 'Gujarat', district: 'Vadodara', city: 'Vadodara' },
    { state: 'Gujarat', district: 'Rajkot', city: 'Rajkot' },
    { state: 'Haryana', district: 'Gurgaon', city: 'Gurugram' },
    { state: 'Haryana', district: 'Faridabad', city: 'Faridabad' },
    { state: 'Himachal Pradesh', district: 'Shimla', city: 'Shimla' },
    { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
    { state: 'Jharkhand', district: 'East Singhbhum', city: 'Jamshedpur' },
    { state: 'Jammu and Kashmir', district: 'Srinagar', city: 'Srinagar' },
    { state: 'Jammu and Kashmir', district: 'Jammu', city: 'Jammu' },
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
    { state: 'Karnataka', district: 'Mysuru', city: 'Mysore' },
    { state: 'Karnataka', district: 'Dakshina Kannada', city: 'Mangalore' },
    { state: 'Karnataka', district: 'Dharwad', city: 'Hubli-Dharwad' },
    { state: 'Kerala', district: 'Ernakulam', city: 'Kochi' },
    { state: 'Kerala', district: 'Thiruvananthapuram', city: 'Thiruvananthapuram' },
    { state: 'Kerala', district: 'Kozhikode', city: 'Kozhikode' },
    { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal' },
    { state: 'Madhya Pradesh', district: 'Indore', city: 'Indore' },
    { state: 'Madhya Pradesh', district: 'Gwalior', city: 'Gwalior' },
    { state: 'Madhya Pradesh', district: 'Jabalpur', city: 'Jabalpur' },
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Maharashtra', district: 'Pune', city: 'Pune' },
    { state: 'Maharashtra', district: 'Nagpur', city: 'Nagpur' },
    { state: 'Maharashtra', district: 'Thane', city: 'Thane' },
    { state: 'Maharashtra', district: 'Pune', city: 'Pimpri-Chinchwad' },
    { state: 'Maharashtra', district: 'Nashik', city: 'Nashik' },
    { state: 'Maharashtra', district: 'Aurangabad', city: 'Aurangabad' },
    { state: 'Maharashtra', district: 'Solapur', city: 'Solapur' },
    { state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai' },
    { state: 'Odisha', district: 'Khordha', city: 'Bhubaneswar' },
    { state: 'Odisha', district: 'Cuttack', city: 'Cuttack' },
    { state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana' },
    { state: 'Punjab', district: 'Amritsar', city: 'Amritsar' },
    { state: 'Punjab', district: 'Jalandhar', city: 'Jalandhar' },
    { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
    { state: 'Rajasthan', district: 'Jodhpur', city: 'Jodhpur' },
    { state: 'Rajasthan', district: 'Kota', city: 'Kota' },
    { state: 'Rajasthan', district: 'Udaipur', city: 'Udaipur' },
    { state: 'Rajasthan', district: 'Ajmer', city: 'Ajmer' },
    { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' },
    { state: 'Tamil Nadu', district: 'Coimbatore', city: 'Coimbatore' },
    { state: 'Tamil Nadu', district: 'Madurai', city: 'Madurai' },
    { state: 'Tamil Nadu', district: 'Tiruchirappalli', city: 'Tiruchirappalli' },
    { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' },
    { state: 'Telangana', district: 'Warangal Urban', city: 'Warangal' },
    { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow' },
    { state: 'Uttar Pradesh', district: 'Kanpur Nagar', city: 'Kanpur' },
    { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Noida' },
    { state: 'Uttar Pradesh', district: 'Agra', city: 'Agra' },
    { state: 'Uttar Pradesh', district: 'Ghaziabad', city: 'Ghaziabad' },
    { state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi' },
    { state: 'Uttar Pradesh', district: 'Meerut', city: 'Meerut' },
    { state: 'Uttar Pradesh', district: 'Prayagraj', city: 'Prayagraj' },
    { state: 'Uttarakhand', district: 'Dehradun', city: 'Dehradun' },
    { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata' },
];


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [driverList, setDriverList] = useState(drivers);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [serviceAreas, setServiceAreas] = useState([
    { id: 1, city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', active: true },
    { id: 2, city: 'Delhi', district: 'New Delhi', state: 'Delhi', active: true },
    { id: 3, city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', active: false },
    { id: 4, city: 'Gurugram', district: 'Gurgaon', state: 'Haryana', active: true },
  ]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

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
    if (!selectedCity) {
        toast({
            variant: 'destructive',
            title: 'Incomplete Selection',
            description: 'Please select a state, district, and city to add.',
        });
        return;
    }

    if (serviceAreas.some(area => area.city === selectedCity)) {
        toast({
            variant: 'destructive',
            title: 'Area Already Added',
            description: `${selectedCity} is already in your service areas.`,
        });
        return;
    }

    const locationDetails = LOCATIONS_DATA.find(l => l.city === selectedCity && l.district === selectedDistrict && l.state === selectedState);

    if (locationDetails) {
        const newArea = {
            id: serviceAreas.length > 0 ? Math.max(...serviceAreas.map(a => a.id)) + 1 : 1,
            ...locationDetails,
            active: true,
        };
        setServiceAreas([...serviceAreas, newArea]);
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCity('');
        setDistricts([]);
        setCities([]);
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

  const availableLocations = LOCATIONS_DATA.filter(
      (potentialLoc) => !serviceAreas.some((sa) => sa.city === potentialLoc.city)
  );

  const states = [...new Set(availableLocations.map(l => l.state))].sort();

  const handleStateChange = (state: string) => {
      setSelectedState(state);
      setSelectedDistrict('');
      setSelectedCity('');
      const availableDistricts = availableLocations.filter(l => l.state === state);
      const uniqueDistricts = [...new Set(availableDistricts.map(l => l.district))].sort();
      setDistricts(uniqueDistricts);
      setCities([]);
  };

  const handleDistrictChange = (district: string) => {
      setSelectedDistrict(district);
      setSelectedCity('');
      const availableCities = availableLocations.filter(l => l.state === selectedState && l.district === district);
      const uniqueCities = [...new Set(availableCities.map(l => l.city))].sort();
      setCities(uniqueCities);
  };


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
                    Manage the areas where your service is available. Add or remove locations and toggle their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 rounded-md border p-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Add a new service area</p>
                            <p className="text-sm text-muted-foreground">Select a state, district, and city to add it to your operational areas.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                             <Select value={selectedState} onValueChange={handleStateChange}>
                                <SelectTrigger className="w-full min-w-[180px] flex-1">
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.length > 0 ? (
                                        states.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>All available locations added</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState || districts.length === 0}>
                                <SelectTrigger className="w-full min-w-[180px] flex-1">
                                    <SelectValue placeholder="Select a district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map(district => (
                                        <SelectItem key={district} value={district}>{district}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedDistrict || cities.length === 0}>
                                <SelectTrigger className="w-full min-w-[180px] flex-1">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                     {cities.map(city => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddServiceArea} className="w-full sm:w-auto">Add</Button>
                        </div>
                    </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>District</TableHead>
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
                          <TableCell>{area.district}</TableCell>
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
