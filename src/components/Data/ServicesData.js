// /src/services/Services.js

const Services = [
  {
    id: '1',
    name: 'Daily Car Washq',
    icon: 'car-wash',
    navigate: 'DailyCarWashScreen',
    heading: 'Daily Car Washing Service',
    description: "Our daily car wash service offers a thorough cleaning of both the interior and exterior of your vehicle. We use high-quality cleaning products to ensure your car shines like new.",
    price: 111,
    features: [
      { id: '1', feature: 'Exterior and Interior Cleaning' },
      { id: '2', feature: 'Tire Cleaning and Polishing' },
      { id: '3', feature: 'Window and Windshield Cleaning' },
      { id: '4', feature: 'Vacuuming and Air Freshener' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: 1 hour' },
      { id: '2', feature: 'Available in all locations' },
      { id: '3', feature: '24/7 Customer Support' }
    ]
  },
  {
    id: '2',
    name: 'On Demand Car Wash',
    icon: 'car-wash',
    navigate: 'OnDemandCarWash',
    heading: 'On Demand Car Washing Service',
    description: "Get your car washed on demand! Our team will come to your location and provide a thorough cleaning using premium products.",
    price: 999,
    features: [
      { id: '1', feature: 'Convenient Location Service' },
      { id: '2', feature: 'Same Day Service Available' },
      { id: '3', feature: 'Eco-Friendly Products Used' },
      { id: '4', feature: 'Flexible Scheduling' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: 1 hour' },
      { id: '2', feature: 'Available in select locations' },
      { id: '3', feature: '24/7 Customer Support' }
    ]
  },
  {
    id: '3',
    name: 'General Car Service',
    icon: 'car',
    navigate: 'GeneralCarServiceScreen',
    heading: 'General Car Service',
    description: "Our general car service includes comprehensive checks and maintenance to ensure your vehicle is in peak condition.",
    price: 999,
    features: [
      { id: '1', feature: 'Oil Change and Filter Replacement' },
      { id: '2', feature: 'Fluid Level Check' },
      { id: '3', feature: 'Brake Inspection' },
      { id: '4', feature: 'Tire Rotation' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: 2 hours' },
      { id: '2', feature: 'Expert Technicians Available' },
      { id: '3', feature: 'Quality Parts Guaranteed' }
    ]
  },
  {
    id: '4',
    name: 'Emergency Breakdown',
    icon: 'car-wrench',
    navigate: 'EmergencyBreakdownScreen',
    heading: 'Emergency Breakdown Service',
    description: "Our emergency breakdown service is available 24/7 to assist you in getting back on the road as quickly as possible.",
    price: 999,
    features: [
      { id: '1', feature: '24/7 Roadside Assistance' },
      { id: '2', feature: 'Towing Service' },
      { id: '3', feature: 'Flat Tire Change' },
      { id: '4', feature: 'Jump Start Service' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: Varies' },
      { id: '2', feature: 'Available in all areas' },
      { id: '3', feature: 'Rapid Response Times' }
    ]
  },
  {
    id: '5',
    name: 'General Repair Services',
    icon: 'tools',
    navigate: 'GeneralRepairServicesScreen',
    heading: 'General Repair Services',
    description: "Our general repair services cover a wide range of vehicle issues, ensuring your car runs smoothly.",
    price: 999,
    features: [
      { id: '1', feature: 'Engine Diagnostics' },
      { id: '2', feature: 'Transmission Repairs' },
      { id: '3', feature: 'Suspension Repairs' },
      { id: '4', feature: 'Electrical System Repairs' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: Varies' },
      { id: '2', feature: 'Certified Technicians' },
      { id: '3', feature: 'Quality Assurance' }
    ]
  },
  {
    id: '6',
    name: 'Service Autoshop',
    icon: 'shopping',
    navigate: 'ServiceAutoshopScreen',
    heading: 'Service Autoshop',
    description: "Visit our autoshop for a wide selection of car parts and accessories. We also offer installation services.",
    price: 999,
    features: [
      { id: '1', feature: 'Wide Selection of Parts' },
      { id: '2', feature: 'Expert Installation Available' },
      { id: '3', feature: 'Competitive Pricing' },
      { id: '4', feature: 'Warranty on Parts' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Open 7 Days a Week' },
      { id: '2', feature: 'Expert Advice Available' },
      { id: '3', feature: 'Fast Service' }
    ]
  },
  {
    id: '7',
    name: 'General Bike Service',
    icon: 'motorbike',
    navigate: 'GeneralBikeServiceScreen',
    heading: 'General Bike Service',
    description: "Our general bike service ensures your motorcycle or scooter is in top shape. We cover all essential maintenance.",
    price: 999,
    features: [
      { id: '1', feature: 'Full Engine Check' },
      { id: '2', feature: 'Brake and Clutch Adjustment' },
      { id: '3', feature: 'Oil Change and Filter Replacement' },
      { id: '4', feature: 'Tire Inspection and Pressure Check' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: 1 hour' },
      { id: '2', feature: 'Available in all locations' },
      { id: '3', feature: '24/7 Customer Support' }
    ]
  },
  {
    id: '8',
    name: 'Vehicle Insurance',
    icon: 'shield-check',
    comingSoon: true,
    navigate: 'VehicleInsuranceScreen',
    heading: 'Vehicle Insurance Service',
    description: "Protect your vehicle with comprehensive insurance options tailored to your needs.",
    price: 999,
    features: [
      { id: '1', feature: 'Customizable Plans' },
      { id: '2', feature: 'Accident Coverage' },
      { id: '3', feature: 'Theft Protection' },
      { id: '4', feature: '24/7 Support' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Easy Claims Process' },
      { id: '2', feature: 'Multiple Insurance Providers' },
      { id: '3', feature: 'Get Quotes Online' }
    ]
  },
  // Uncomment if needed
  // {
  //   id: '9',
  //   name: 'More to Come',
  //   icon: 'dots-horizontal',
  //   heading: 'Coming Soon',
  //   description: "Stay tuned for more services that will be available shortly.",
  //   price: 999,
  //   features: [{ id: '1', feature: 'More Services Coming Soon' }],
  //   additionalInfo: [{ id: '1', feature: 'Check Back for Updates' }]
  // },
];

export default Services;
