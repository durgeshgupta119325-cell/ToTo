
export const DUMMY_DRIVERS = [
  {
    id: 'DRV001',
    name: 'Ramesh Kumar',
    gender: 'Male',
    email: 'ramesh@example.com',
    mobile: '9876543211',
    address: '123, Driver Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    vehicleType: 'Cab',
    vehicleNumber: 'MH12AB1234',
    accountNumber: '...1234',
    grossEarnings: 12500,
    photoUrl: 'https://picsum.photos/seed/driver1/200/200',
    idProofUrl: 'https://picsum.photos/seed/id1/400/250',
    password: 'password',
    walletBalance: 4500,
  },
  {
    id: 'DRV002',
    name: 'Suresh Singh',
    gender: 'Male',
    email: 'suresh@example.com',
    mobile: '9876543212',
    address: '456, Auto Road',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'DL01CD5678',
    accountNumber: '...5678',
    grossEarnings: 9800,
    photoUrl: 'https://picsum.photos/seed/driver2/200/200',
    idProofUrl: 'https://picsum.photos/seed/id2/400/250',
    password: 'password',
    walletBalance: 3200,
  },
];

export const DUMMY_CUSTOMERS = [
  {
    id: 'CUST001',
    name: 'Anjali Sharma',
    gender: 'Female',
    email: 'anjali@example.com',
    mobile: '9876543210',
    address: '123, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    rides: [
      {
        rideId: 'RIDE001',
        from: 'Connaught Place',
        to: 'India Gate',
        time: '2023-10-27 10:00 AM',
        date: '2023-10-27',
        fare: '₹75',
        transactionId: 'TXN001',
      },
    ],
  },
];

export const DUMMY_LOCATIONS_DATA = [
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Delhi', district: 'New Delhi', city: 'New Delhi' },
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
];

export const ADMIN_DASHBOARD_STATS = {
    totalRides: 1250,
    grossVolume: 85230,
};

export const BOOK_RIDE_SERVICE_AREAS = [
    { city: 'Mumbai', state: 'Maharashtra', active: true },
    { city: 'Delhi', state: 'Delhi', active: true },
];

export const SUPPORT_FAQS = [
  {
    question: 'How do I book a ride?',
    answer: 'Go to the "Book a Ride" page, enter your pickup and destination locations, and choose your preferred vehicle type.',
  },
];

export const DEFAULT_RATES = {
    erickshaw: 10,
    cab: 15,
};

export const MOCK_PAYMENTS = [
  { id: 'RIDE_101', customer: 'Anjali S.', amount: 450, mode: 'UPI', status: 'success', timestamp: '2023-10-27T10:30:00Z' },
  { id: 'RIDE_102', customer: 'Rahul V.', amount: 120, mode: 'Cash', status: 'pending', timestamp: '2023-10-27T11:15:00Z' },
  { id: 'RIDE_103', customer: 'Priya K.', amount: 350, mode: 'Card', status: 'success', timestamp: '2023-10-27T12:00:00Z' },
];

export const MOCK_SETTLEMENTS = [
  { driverId: 'DRV001', name: 'Ramesh Kumar', trips: 15, gross: 4500, commission: 900, net: 3600, settled: 'Yes' },
  { driverId: 'DRV002', name: 'Suresh Singh', trips: 12, gross: 3200, commission: 640, net: 2560, settled: 'Pending' },
];
