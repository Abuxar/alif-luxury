import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import Product from './models/Product.js';
import Slide from './models/Slide.js';

// Read the 17 AI-generated filenames from the json we just created
const aiImages = JSON.parse(fs.readFileSync('server/ai_images.json', 'utf-8'));

// 5 entirely dedicated to Hero Slides
const slideImages = aiImages.slice(0, 5);
// 12 entirely dedicated to Products
const productImages = aiImages.slice(5, 17);

const categories = ['Unstitched', 'Prêt', 'Luxury Formal', 'Accessories'];
const adjectiveOptions = ['Midnight', 'Crimson', 'Azure', 'Golden', 'Ivory', 'Obsidian', 'Emerald', 'Sapphire', 'Pearl', 'Velvet', 'Royal', 'Ethereal'];
const nounOptions = ['Cascade', 'Mirage', 'Whisper', 'Enigma', 'Dazzle', 'Dream', 'Sands', 'Aura', 'Goddess', 'Sovereign', 'Serenade', 'Symphony'];

const products = [];

for (let i = 0; i < productImages.length; i++) {
   const adjs = adjectiveOptions[i % adjectiveOptions.length];
   const noun = nounOptions[(i + 3) % nounOptions.length]; // Stagger to get combos
   const cat = categories[i % categories.length];
   
   products.push({
      title: `${adjs} ${noun}`,
      sku: `ALIF-2026-${(i + 1).toString().padStart(3, '0')}`,
      description: `A masterclass in ${cat} luxury. This piece commands attention with subtle artisanal details and unmatched quality.`,
      fabricComposition: '100% Premium Fabric Blend',
      components: cat === 'Accessories' ? [{ name: 'Item', measurement: 'Standard' }] : [{ name: 'Shirt', measurement: 'Custom Fit' }, { name: 'Lower', measurement: 'Custom Fit' }],
      type: `${adjs} ${cat} Collection`,
      category: cat,
      price: Math.floor(Math.random() * (150000 - 15000) + 15000), // Between 15,000 to 150,000
      inventoryCount: Math.floor(Math.random() * 30),
      isAvailable: true,
      coverImage: productImages[i],
      hoverImage: productImages[i] // Use same image for hover so we literally have zero repeats
   });
}

// 5 new flawless Slides
const slides = [
  {
    title: "The Silent Luxury Collection",
    subtitle: "A study in understated elegance.",
    linkText: "Explore the Archive",
    linkUrl: "#collection",
    image: slideImages[0],
    order: 0,
    isActive: true
  },
  {
    title: "The Evening Gala Edit",
    subtitle: "Impeccable formalwear for the red carpet.",
    linkText: "Discover Formals",
    linkUrl: "?category=Luxury Formal",
    image: slideImages[1],
    order: 1,
    isActive: true
  },
  {
    title: "Artisanal Silk Roots",
    subtitle: "Intricate handcrafted luxury ready to wear.",
    linkText: "Shop Prêt",
    linkUrl: "?category=Prêt",
    image: slideImages[2],
    order: 2,
    isActive: true
  },
  {
    title: "Velvet Horizons",
    subtitle: "Deep textures for the new season.",
    linkText: "View Collection",
    linkUrl: "?category=Unstitched",
    image: slideImages[3],
    order: 3,
    isActive: true
  },
  {
    title: "Gilded Accents",
    subtitle: "Masterpiece accessories for the finishing touch.",
    linkText: "Accessories",
    linkUrl: "?category=Accessories",
    image: slideImages[4],
    order: 4,
    isActive: true
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alif-luxury')
  .then(async () => {
    console.log('Connected to DB. Wiping old items...');
    await Product.deleteMany({});
    await Slide.deleteMany({}); 
    
    console.log(`Inserting ${products.length} entirely unique AI products...`);
    await Product.insertMany(products);
    
    console.log(`Inserting ${slides.length} entirely unique AI hero slides...`);
    await Slide.insertMany(slides);
    
    console.log(`Seed successful! Added ${products.length} products and ${slides.length} slides flawlessly.`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
