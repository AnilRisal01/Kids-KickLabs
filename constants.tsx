
import React from 'react';
import { Product } from './types';

export const COLORS = {
  primary: '#E11D48', // Rhododendron Red
  secondary: '#0EA5E9', // Himalayan Sky Blue
  accent: '#FACC15', // Sunny Yellow
  natural: '#166534', // Forest Green
};

export interface ThemeOption {
  name: string;
  icon: string;
  color: string;
}

export const NEPALI_THEMES: ThemeOption[] = [
  { name: 'Dhaka Patterns', icon: 'fa-rug', color: 'bg-rose-500' },
  { name: 'Himalayan Peaks', icon: 'fa-mountain-sun', color: 'bg-sky-400' },
  { name: 'One-Horned Rhinos', icon: 'fa-hippo', color: 'bg-emerald-600' },
  { name: 'Ilam Tea Gardens', icon: 'fa-leaf', color: 'bg-green-500' },
  { name: 'Rhododendron Blossoms', icon: 'fa-flower', color: 'bg-pink-500' },
  { name: 'Yeti Footprints', icon: 'fa-paw', color: 'bg-blue-600' },
  { name: 'Royal Bengal Tigers', icon: 'fa-cat', color: 'bg-amber-600' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dhaka Dash Sneakers',
    brand: 'Heritage Hub',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vibrant sneakers for ages 4–8. Features patterns inspired by traditional Nepali Dhaka textiles with modern athletic comfort.',
    category: 'ready-made',
    tags: ['Traditional', 'Sneakers', 'Colorful']
  },
  {
    id: '2',
    name: 'Little Himal Sandals',
    brand: 'Peak Performance',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1562183241-b937e95585b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Adventure-ready sandals for small explorers (ages 3–7). Sky blue tones inspired by Himalayan peaks, featuring easy-on Velcro straps.',
    category: 'ready-made',
    tags: ['Outdoor', 'Adventure', 'Breathable']
  },
  {
    id: '3',
    name: 'Temple Walk School Shoes',
    brand: 'Scholar Step',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Durable, formal school shoes for ages 5–10. Classic black design with subtle temple-inspired stitching for a touch of heritage.',
    category: 'ready-made',
    tags: ['Formal', 'Durable', 'School']
  },
  {
    id: '4',
    name: 'Rhododendron Bloom Shoes',
    brand: 'Flora Feet',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cheerful casual shoes for ages 2–6. Adorned with floral accents inspired by the Lali Guras, Nepal\'s national flower.',
    category: 'ready-made',
    tags: ['Floral', 'Casual', 'Playful']
  },
  {
    id: '7',
    name: 'Design-Your-Own Dreamer',
    brand: 'Labs Custom',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Live Custom Shoe Preview: The ultimate canvas for your child\'s imagination. Use AI to blend any Nepali motif into their own kicks.',
    category: 'customizable',
    tags: ['Custom', 'AI-Powered', 'Unique']
  }
];
