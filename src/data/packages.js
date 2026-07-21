const packages = [
  {
    id: 'outdoor1',
    title: 'Outdoor Package (1)',
    price: 50000,
    currency: 'ETB',
    duration: 'Full Day',
    coverColor: '#6c5ce7',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
    badge: 'Premium',
    inclusions: [
      'Wedding Gown (1)',
      "Groom's Suit (1)",
      'Evening / Dinner Dress (1)',
      "Bride's Hair Styling",
      "Groom's Hair Styling",
      "Bride's Makeup",
      'Short Video',
      'Thank You Cards (100 pieces)',
      'Save the Date (5 pieces)',
      'Laminated Board (40x60)',
      'All Softcopies (Digital Files)',
    ],
  },
  {
    id: 'outdoor2',
    title: 'Outdoor Package (2)',
    price: 40000,
    currency: 'ETB',
    duration: 'Full Day',
    coverColor: '#00b894',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80',
    badge: 'Standard',
    inclusions: [
      'Wedding Gown (1)',
      "Groom's Suit (1)",
      'Evening / Dinner Dress (1)',
      'Short Video',
      'Thank You Cards (100 pieces)',
      'Laminated Board (40x60)',
    ],
  },
  {
    id: 'outdoor3',
    title: 'Outdoor Package (3)',
    price: 30000,
    currency: 'ETB',
    duration: 'Half Day',
    coverColor: '#2d3436',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    badge: 'Basic',
    inclusions: [
      'Short Video',
      'Thank You Cards',
      'Laminated Board (40x60)',
      'All Softcopies (Digital Files)',
    ],
  },
  {
    id: 'outdoor4',
    title: 'Outdoor Package (4)',
    price: 25000,
    currency: 'ETB',
    duration: 'Half Day',
    coverColor: '#fd79a8',
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    badge: 'Economy',
    inclusions: [
      'Thank You Cards',
      'Laminated Board (40x60)',
      'All Softcopies (Digital Files)',
    ],
  },
];

export const frameSizes = [
  {id: 'frame-15x20', label: '15x20', price: 0},
  {id: 'frame-20x30', label: '20x30', price: 0},
  {id: 'frame-30x45', label: '30x45', price: 0},
];

export const boardSizes = [
  {id: 'board-15x20', label: '15x20', price: 0},
  {id: 'board-20x30', label: '20x30', price: 0},
  {id: 'board-30x45', label: '30x45', price: 0},
  {id: 'board-30x60', label: '30x60', price: 0},
  {id: 'board-30x90', label: '30x90', price: 0},
  {id: 'board-40x60', label: '40x60', price: 0},
  {id: 'board-50x80', label: '50x80', price: 0},
  {id: 'board-60x90', label: '60x90', price: 0},
  {id: 'board-60x120', label: '60x120', price: 0},
];

export const bannerSizes = [
  {id: 'banner-100', label: '100cm x 100cm', price: 0},
  {id: 'banner-150', label: '150cm x 100cm', price: 0},
];

export default packages;
