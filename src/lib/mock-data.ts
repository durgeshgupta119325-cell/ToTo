export const DUMMY_DRIVERS = [
  {
    driverId: 'xyz123',
    name: 'Suresh Yadav',
    phone: '+919876543211',
    vehicleNumber: 'BR01AB1234',
    vehicleType: 'e-rickshaw',
    isOnline: true,
    isAvailable: true,
    currentLat: 25.5941,
    currentLng: 85.1376,
    rating: 4.7,
    totalTrips: 342,
    city: 'Patna',
    documents: {
      dl: 'https://picsum.photos/seed/dl1/400/250',
      rc: 'https://picsum.photos/seed/rc1/400/250',
      insurance: 'https://picsum.photos/seed/ins1/400/250'
    },
    fleetId: null,
    kycVerified: true,
    createdAt: '2026-05-01T00:00:00Z',
    grossEarnings: 12500,
    email: 'suresh@example.com',
    password: 'password'
  },
  {
    driverId: 'abc456',
    name: 'Rajesh Kumar',
    phone: '+919876543212',
    vehicleNumber: 'MH12AB5678',
    vehicleType: 'cab',
    isOnline: true,
    isAvailable: true,
    currentLat: 19.0760,
    currentLng: 72.8777,
    rating: 4.8,
    totalTrips: 512,
    city: 'Mumbai',
    documents: {
      dl: 'https://picsum.photos/seed/dl2/400/250',
      rc: 'https://picsum.photos/seed/rc2/400/250',
      insurance: 'https://picsum.photos/seed/ins2/400/250'
    },
    fleetId: 'FLEET001',
    kycVerified: true,
    createdAt: '2026-04-15T10:00:00Z',
    grossEarnings: 24000,
    email: 'rajesh@example.com',
    password: 'password'
  }
];

export const DUMMY_CUSTOMERS = [
  {
    uid: 'cust789',
    name: 'Anjali Sharma',
    phone: '+919876543210',
    email: 'anjali@example.com',
    role: 'customer',
    profilePic: 'https://picsum.photos/seed/anjali/200/200',
    city: 'Patna',
    isBlocked: false,
    createdAt: '2026-05-08T10:00:00Z',
    rides: [
      {
        rideId: 'RIDE001',
        from: 'Boring Road',
        to: 'Patna Junction',
        date: '2023-10-27',
        fare: '₹120',
        status: 'Completed'
      }
    ]
  }
];

export const DUMMY_LOCATIONS_DATA = [
    { state: 'Andhra Pradesh', district: 'Amaravati', city: 'Vijayawada' },
    { state: 'Bihar', district: 'Patna', city: 'Patna' },
    { state: 'Delhi', district: 'New Delhi', city: 'New Delhi' },
    { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad' },
    { state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' },
    { state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' },
    { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur' },
    { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' },
    { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' },
    { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow' },
    { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata' },
];

export const BOOK_RIDE_SERVICE_AREAS = [
    { city: 'Mumbai', state: 'Maharashtra', range: 25, active: true },
    { city: 'Patna', state: 'Bihar', range: 20, active: true },
    { city: 'Delhi', state: 'Delhi', range: 30, active: true },
];

export const SUPPORT_FAQS = [
  {
    question: 'How do I book a ride?',
    answer: 'Go to the "Book a Ride" page, enter your pickup and destination, and choose your preferred vehicle type.',
  },
  {
    question: 'How is the fare calculated?',
    answer: 'Fares are calculated based on distance. E-Rickshaws have a lower base rate compared to standard Cabs.',
  },
];

export const DEFAULT_RATES = {
    erickshaw: 10,
    cab: 15,
};
