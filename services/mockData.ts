

import { District, Listing, UserType } from '../types';

export const DISTRICTS: District[] = [
  {
    id: 'd1',
    name: 'Skardu',
    description: 'The gateway to K2 and home to mesmerizing lakes like Shangrila and Sheosar.',
    image: 'https://lh3.googleusercontent.com/d/1aFBu2T-MzmIdbF2BrlCoCg5ffInQXe6S',
    attractions: ['Shangrila Resort', 'Deosai Plains', 'Kachura Lakes'],
    coordinates: { lat: 35.2971, lng: 75.6333 },
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Shangrila_Resort_Skardu.jpg/1024px-Shangrila_Resort_Skardu.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Satpara_Lake_Skardu.jpg/1024px-Satpara_Lake_Skardu.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Deosai_Plains_Skardu.jpg/1024px-Deosai_Plains_Skardu.jpg'
    ]
  },
  {
    id: 'd2',
    name: 'Hunza',
    description: 'Known for its longevity, culture, and the majestic Rakaposhi peak.',
    image: 'https://lh3.googleusercontent.com/d/1xzYmJL9tK031Xs5q5kZ8uennnPFPAaSq', // Updated Hunza Background
    attractions: ['Karimabad', 'Attabad Lake', 'Baltit Fort'],
    coordinates: { lat: 36.3167, lng: 74.6500 },
    gallery: [
       'https://lh3.googleusercontent.com/d/1ELvCe1hqaNrpVjrI5B0k0YH5cTsmWz8g', // Added extra Hunza picture
       'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Passu_Cones_Hunza.jpg/1024px-Passu_Cones_Hunza.jpg',
       'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Baltit_Fort_Karimabad_Hunza.jpg/1024px-Baltit_Fort_Karimabad_Hunza.jpg',
       'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Attabad_Lake_Hunza.jpg/1024px-Attabad_Lake_Hunza.jpg'
    ]
  },
  {
    id: 'd3',
    name: 'Gilgit',
    description: 'The capital city, a historic trading hub on the Silk Route.',
    image: 'https://lh3.googleusercontent.com/d/1zUUbZwhDpCv3P8NCyjbTDc78wet4UXK9', // Updated Gilgit Background
    attractions: ['Naltar Valley', 'Gilgit River', 'Danyore Suspension Bridge'],
    coordinates: { lat: 35.9208, lng: 74.3089 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Naltar_Lake_Gilgit.jpg/1024px-Naltar_Lake_Gilgit.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Kargah_Buddha_Gilgit.jpg/1024px-Kargah_Buddha_Gilgit.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Danyore_Suspension_Bridge_Gilgit.jpg/1024px-Danyore_Suspension_Bridge_Gilgit.jpg'
    ]
  },
  {
    id: 'd4',
    name: 'Astore',
    description: 'Famous for its diverse landscape and the beautiful Rama Meadows.',
    image: 'https://lh3.googleusercontent.com/d/1nUkZGtuibiayJlT5rkE__6DERYpOezSa', // Updated Astore Background
    attractions: ['Rama Lake', 'Minimarg', 'Deosai access'],
    coordinates: { lat: 35.3667, lng: 74.9000 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Rama_Meadows_Astore.jpg/1024px-Rama_Meadows_Astore.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Minimarg_Astore.jpg/1024px-Minimarg_Astore.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chilim_Astore.jpg/1024px-Chilim_Astore.jpg'
    ]
  },
  {
    id: 'd5',
    name: 'Ghizer',
    description: 'Land of lakes and trout fishing, offering serenity and peace.',
    image: 'https://lh3.googleusercontent.com/d/1eZxT3chHmhb1cQkoM0UsK1mqrCocW26G', // Updated Ghizer Background
    attractions: ['Phander Lake', 'Khalti Lake', 'Shandur Pass'],
    coordinates: { lat: 36.1736, lng: 73.6653 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Khalti_Lake_Ghizer.jpg/1024px-Khalti_Lake_Ghizer.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Shandur_Pass.jpg/1024px-Shandur_Pass.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Yasin_Valley_Ghizer.jpg/1024px-Yasin_Valley_Ghizer.jpg'
    ]
  },
  {
    id: 'd6',
    name: 'Nagar',
    description: 'Home to the Golden Peak (Spantik) and Hopper Glacier.',
    image: 'https://lh3.googleusercontent.com/d/1c_HLe_GmKC_Ebc30dcCv4Pj1lBcgmwk_', // Updated Nagar Background
    attractions: ['Hopper Glacier', 'Rakaposhi View Point', 'Hispar'],
    coordinates: { lat: 36.1333, lng: 74.8333 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Rakaposhi_View_Point_Nagar.jpg/1024px-Rakaposhi_View_Point_Nagar.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Rush_Lake_Nagar.jpg/1024px-Rush_Lake_Nagar.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Golden_Peak_Nagar.jpg/1024px-Golden_Peak_Nagar.jpg'
    ]
  },
  {
    id: 'd7',
    name: 'Khaplu',
    description: 'The district of soaring peaks, home to Khaplu Palace and the hidden jewel, Kharfaq Lake.',
    image: 'https://lh3.googleusercontent.com/d/1AgDrqlbMxqW9M2DEJi9r6FaWEK6ZUxtl', // Updated Khaplu Background
    attractions: ['Kharfaq Lake', 'Khaplu Palace', 'Chaqchan Mosque', 'Hushe Valley'],
    coordinates: { lat: 35.1565, lng: 76.3365 },
    gallery: [
        'https://lh3.googleusercontent.com/d/1yzfoxVxyBPp55tGuZnYAJ3zIQztTXt2_', // Kharfaq Lake (User Provided)
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Chaqchan_Mosque_Ghanche.jpg/1024px-Chaqchan_Mosque_Ghanche.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hushe_Valley_Ghanche.jpg/1024px-Hushe_Valley_Ghanche.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Masherbrum_Peak.jpg/1024px-Masherbrum_Peak.jpg'
    ]
  },
  {
    id: 'd8',
    name: 'Kharmang',
    description: 'The home of the famous Manthoka Waterfall and lush green valleys.',
    image: 'https://lh3.googleusercontent.com/d/1kEhZTy1yPsUsRoT39YLEaxMqfFXwAfZg', // Updated Kharmang Background
    attractions: ['Mantokha Waterfall', 'Kharmang Valley', 'Mehdiabad'],
    coordinates: { lat: 34.9333, lng: 76.2167 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Manthokha_Waterfall_Kharmang.jpg/1200px-Manthokha_Waterfall_Kharmang.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Indus_River_Kharmang.jpg/1024px-Indus_River_Kharmang.jpg'
    ]
  },
  {
    id: 'd9',
    name: 'Diamer',
    description: 'The entrance to Gilgit-Baltistan via KKH, home to Nanga Parbat.',
    image: 'https://lh3.googleusercontent.com/d/1okOUjNdYuWB6bnzYg7yHDWJIvzHIl0e0', // Updated Diamer Background
    attractions: ['Fairy Meadows', 'Nanga Parbat Base Camp', 'Chilas Rock Carvings'],
    coordinates: { lat: 35.4167, lng: 74.1000 },
    gallery: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fairy_Meadows_Diamer.jpg/1024px-Fairy_Meadows_Diamer.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Chilas_Rock_Carvings.jpg/1024px-Chilas_Rock_Carvings.jpg'
    ]
  }
];

export const LISTINGS: Listing[] = [
  {
    id: 'h1',
    name: 'Shangrila Resort',
    type: 'HOTEL',
    districtId: 'd1',
    description: 'Heaven on Earth. Luxury stay by the lake.',
    priceLevel: 5,
    rating: 4.8,
    contact: '+92-5815-123456',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Shangrila_Resort_Skardu.jpg/800px-Shangrila_Resort_Skardu.jpg',
    features: ['Lake View', 'Restaurant', 'Boating'],
    coordinates: { lat: 35.3526, lng: 75.5088 },
    rooms: [
      { id: 'r1', name: 'Lake View Executive', price: 250, capacity: 2, features: ['King Bed', 'Balcony', 'Breakfast'] },
      { id: 'r2', name: 'Swiss Cottage', price: 180, capacity: 3, features: ['Mountain View', 'Private Lawn'] },
      { id: 'r3', name: 'Standard Room', price: 120, capacity: 2, features: ['Queen Bed', 'Wifi'] }
    ]
  },
  {
    id: 'a1',
    name: 'K2 Trekkers',
    type: 'AGENCY',
    districtId: 'd1',
    description: 'Professional expeditions to K2 and Broad Peak.',
    priceLevel: 4,
    rating: 4.9,
    contact: 'info@k2trekkers.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/K2_2006b.jpg/800px-K2_2006b.jpg',
    features: ['Mountaineering', 'Trekking', 'Permits'],
    coordinates: { lat: 35.2980, lng: 75.6340 },
    packages: [
      { id: 'p1', name: 'K2 Base Camp Trek', price: 1500, duration: '20 Days', features: ['Full Board', 'Guide', 'Porters'] },
      { id: 'p2', name: 'Deosai Jeep Safari', price: 400, duration: '3 Days', features: ['Jeep', 'Camping', 'Meals'] }
    ]
  },
  {
    id: 'g1',
    name: 'Ali Karim',
    type: 'GUIDE',
    districtId: 'd2',
    description: 'Local expert in Hunza culture and history.',
    priceLevel: 2,
    rating: 4.7,
    contact: 'ali.hunza@example.com',
    image: 'https://images.unsplash.com/photo-1596706056581-229f3d917820?q=80&w=800&auto=format&fit=crop',
    features: ['English Speaking', 'History Expert', 'Hiking'],
    coordinates: { lat: 36.3210, lng: 74.6550 },
    packages: [
      { id: 'gp1', name: 'Hunza Culture Walk', price: 50, duration: '1 Day', features: ['Fort Tour', 'Local Food'] },
      { id: 'gp2', name: 'Passu Glacier Hike', price: 80, duration: '1 Day', features: ['Trekking Gear', 'Transport'] }
    ]
  },
  {
    id: 'h2',
    name: 'Serena Gilgit',
    type: 'HOTEL',
    districtId: 'd3',
    description: 'A sanctuary of comfort in the heart of Gilgit.',
    priceLevel: 5,
    rating: 4.6,
    contact: '+92-5811-987654',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/49585610.jpg?k=3f4c6e9c9c0c8a2b5b4b5b4b5b4b5b4b5b4b5b4b5b4b5b4b5b4b5b4b5b4b5b4b',
    features: ['Luxury', 'Wifi', 'Airport Shuttle'],
    coordinates: { lat: 35.9150, lng: 74.3100 },
    rooms: [
      { id: 'sr1', name: 'Deluxe Suite', price: 200, capacity: 2, features: ['City View', 'Lounge'] },
      { id: 'sr2', name: 'Executive Room', price: 150, capacity: 2, features: ['Work Desk', 'Buffet Breakfast'] }
    ]
  },
  {
    id: 'g2',
    name: 'Mountain Nomads',
    type: 'AGENCY',
    districtId: 'd5',
    description: 'Fishing and camping tours in Ghizer.',
    priceLevel: 3,
    rating: 4.5,
    contact: 'nomads@ghizer.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Fishing_in_Phander_Lake.jpg/800px-Fishing_in_Phander_Lake.jpg',
    features: ['Fishing', 'Camping', 'Family Trips'],
    coordinates: { lat: 36.1750, lng: 73.6680 },
    packages: [
      { id: 'mp1', name: 'Phander Trout Fishing', price: 300, duration: '3 Days', features: ['Fishing Gear', 'Camping'] },
      { id: 'mp2', name: 'Shandur Polo Festival', price: 500, duration: '5 Days', features: ['Transport', 'VIP Seating'] }
    ]
  },
  {
    id: 'h3',
    name: 'Khaplu Palace Heritage Hotel',
    type: 'HOTEL',
    districtId: 'd7',
    description: 'Experience royalty in the restored royal residence of Khaplu.',
    priceLevel: 5,
    rating: 4.9,
    contact: '+92-5816-450892',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Khaplu_Fort%2C_Baltistan.jpg/800px-Khaplu_Fort%2C_Baltistan.jpg',
    features: ['Heritage', 'Museum', 'Organic Food'],
    coordinates: { lat: 35.1580, lng: 76.3380 },
    rooms: [
      { id: 'kr1', name: 'Royal Suite', price: 300, capacity: 2, features: ['Historical Interior', 'Mountain View'] },
      { id: 'kr2', name: 'Heritage Room', price: 220, capacity: 2, features: ['Traditional Decor', 'Breakfast'] }
    ]
  },
  {
    id: 'g_ghanche_1',
    name: 'Hushe Valley Guides',
    type: 'GUIDE',
    districtId: 'd7',
    description: 'Expert local guides for Masherbrum and Hushe treks.',
    priceLevel: 3,
    rating: 4.8,
    contact: 'hushe.guides@example.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hushe_Valley_Ghanche.jpg/800px-Hushe_Valley_Ghanche.jpg',
    features: ['Mountaineering', 'Local Language', 'Rescue Certified'],
    coordinates: { lat: 35.2500, lng: 76.3500 },
    packages: [
      { id: 'hg1', name: 'Masherbrum Base Camp', price: 100, duration: '5 Days', features: ['Guide', 'Maps'] }
    ]
  },
  {
    id: 'a_ghanche_1',
    name: 'Masherbrum Tours',
    type: 'AGENCY',
    districtId: 'd7',
    description: 'Specializing in expeditions to the hidden valleys of Ghanche.',
    priceLevel: 4,
    rating: 4.7,
    contact: 'info@masherbrumtours.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Masherbrum_Peak.jpg/800px-Masherbrum_Peak.jpg',
    features: ['Expeditions', 'Cultural Tours', 'Jeep Safari'],
    coordinates: { lat: 35.1550, lng: 76.3350 },
    packages: [
      { id: 'mt1', name: 'Hushe Village Tour', price: 200, duration: '2 Days', features: ['Jeep', 'Homestay'] }
    ]
  },
  {
    id: 'h_kharmang_1',
    name: 'Manthoka Serene Resort',
    type: 'HOTEL',
    districtId: 'd8',
    description: 'Stay right next to the mesmerizing Manthoka Waterfall. Lush green surroundings.',
    priceLevel: 3,
    rating: 4.5,
    contact: '+92-5815-998877',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Manthokha_Waterfall_Kharmang.jpg/800px-Manthokha_Waterfall_Kharmang.jpg',
    features: ['Waterfall View', 'Camping Pods', 'Local Cuisine'],
    coordinates: { lat: 34.9350, lng: 76.2200 },
    rooms: [
      { id: 'mr1', name: 'Waterfall View Cottage', price: 100, capacity: 2, features: ['Balcony', 'King Bed'] },
      { id: 'mr2', name: 'Camping Pod', price: 40, capacity: 2, features: ['Shared Bath', 'Sleeping Bag'] }
    ]
  },
  {
    id: 'a_kharmang_1',
    name: 'Kharmang Eco Tours',
    type: 'AGENCY',
    districtId: 'd8',
    description: 'Discover the hidden waterfalls and culture of Kharmang district.',
    priceLevel: 3,
    rating: 4.6,
    contact: 'info@kharmangtours.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Indus_River_Kharmang.jpg/800px-Indus_River_Kharmang.jpg',
    features: ['Cultural Tours', 'Sightseeing', 'Fishing'],
    coordinates: { lat: 34.9300, lng: 76.2100 },
    packages: [
      { id: 'kp1', name: 'Manthoka & Mehdiabad Day Trip', price: 80, duration: '1 Day', features: ['Transport', 'Lunch', 'Guide'] }
    ]
  }
];

export const ALERTS = [
  { id: 1, type: 'critical', message: 'Heavy snowfall expected in Deosai Plains. Travel restricted.' },
  { id: 2, type: 'warning', message: 'Landslide warning on KKH near Kohistan. Drive with caution.' },
  { id: 3, type: 'info', message: 'Cherry Blossom season is at peak in Hunza and Nagar.' },
];

export interface RoadStatus {
  name: string;
  status: 'OPEN' | 'CLOSED' | 'CAUTION';
  color: string;
  affects: string[];
}

export const ROAD_STATUS: RoadStatus[] = [
  { name: 'Karakoram Highway (KKH)', status: 'OPEN', color: 'green', affects: ['d2', 'd3', 'd6', 'd9'] }, 
  { name: 'Skardu Road (S-1)', status: 'OPEN', color: 'green', affects: ['d1', 'd7', 'd8'] }, 
  { name: 'Babusar Pass', status: 'CLOSED', color: 'red', affects: ['d3', 'd4', 'd9'] }, 
  { name: 'Deosai Road', status: 'CAUTION', color: 'yellow', affects: ['d1', 'd4'] }, 
  { name: 'Ghizer-Chitral Road', status: 'OPEN', color: 'green', affects: ['d5'] }, 
  { name: 'Astore Valley Road', status: 'CAUTION', color: 'yellow', affects: ['d4'] },
  { name: 'Khaplu Valley Road', status: 'OPEN', color: 'green', affects: ['d7'] }, 
  { name: 'Kharmang Road', status: 'OPEN', color: 'green', affects: ['d8'] },
];

export const WEATHER_DATA = [
  { district: 'Gilgit', temp: '18°C', condition: 'Sunny' },
  { district: 'Skardu', temp: '12°C', condition: 'Partly Cloudy' },
  { district: 'Hunza', temp: '14°C', condition: 'Clear Sky' },
  { district: 'Astore', temp: '9°C', condition: 'Rain' },
  { district: 'Ghizer', temp: '11°C', condition: 'Cloudy' },
  { district: 'Nagar', temp: '13°C', condition: 'Sunny' },
  { district: 'Khaplu', temp: '8°C', condition: 'Snow Showers' },
  { district: 'Kharmang', temp: '10°C', condition: 'Overcast' },
  { district: 'Diamer', temp: '22°C', condition: 'Hot' },
];

export const EMERGENCY_CONTACTS = [
  { name: 'Tourist Police', number: '1422' },
  { name: 'Rescue 1122', number: '1122' },
  { name: 'Highway Police', number: '130' },
  { name: 'Met Office', number: '+92-51-9250369' }
];