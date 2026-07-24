const packages = [
  {
    id: 'outdoor1',
    title: 'የውጪ ፓኬጅ (1)',
    price: 50000,
    currency: 'ETB',
    duration: 'ሙሉ ቀን',
    coverColor: '#6c5ce7',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
    badge: 'ፕሪሚየም',
    inclusions: [
      'የሰርግ ቀሚስ (1)',
      'የሙሽራ ልብስ (1)',
      'የምሽት / እራት ቀሚስ (1)',
      'የሙሽራ ፀጉር አሰራር',
      'የሙሽራ ሜካፕ',
      'አጭር ቪዲዮ',
      'የምስጋና ካርዶች (100)',
      'ቀን ይያዙ ካርዶች (5)',
      'ላሚኔትድ ቦርድ (40x60)',
      'ሁሉም ሶፍትኮፒዎች (ዲጂታል ፋይሎች)',
    ],
  },
  {
    id: 'outdoor2',
    title: 'የውጪ ፓኬጅ (2)',
    price: 40000,
    currency: 'ETB',
    duration: 'ሙሉ ቀን',
    coverColor: '#00b894',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80',
    badge: 'ስታንዳርድ',
    inclusions: [
      'የሰርግ ቀሚስ (1)',
      'የሙሽራ ልብስ (1)',
      'የምሽት / እራት ቀሚስ (1)',
      'አጭር ቪዲዮ',
      'የምስጋና ካርዶች (100)',
      'ላሚኔትድ ቦርድ (40x60)',
    ],
  },
  {
    id: 'outdoor3',
    title: 'የውጪ ፓኬጅ (3)',
    price: 30000,
    currency: 'ETB',
    duration: 'ግማሽ ቀን',
    coverColor: '#2d3436',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    badge: 'መሰረታዊ',
    inclusions: [
      'አጭር ቪዲዮ',
      'የምስጋና ካርዶች',
      'ላሚኔትድ ቦርድ (40x60)',
      'ሁሉም ሶፍትኮፒዎች (ዲጂታል ፋይሎች)',
    ],
  },
  {
    id: 'outdoor4',
    title: 'የውጪ ፓኬጅ (4)',
    price: 25000,
    currency: 'ETB',
    duration: 'ግማሽ ቀን',
    coverColor: '#fd79a8',
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80',
    badge: 'ኢኮኖሚ',
    inclusions: [
      'የምስጋና ካርዶች',
      'ላሚኔትድ ቦርድ (40x60)',
      'ሁሉም ሶፍትኮፒዎች (ዲጂታል ፋይሎች)',
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
