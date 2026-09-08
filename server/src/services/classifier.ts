import fs from 'fs';
import path from 'path';
import { MaterialCategory } from '../types';
import { db } from '../db';

export interface AIClassificationResult {
  category: MaterialCategory;
  categoryName: string;
  detectedLabel: string;
  subType: string;
  confidence: number;
  estimatedRatePerKg: number;
  recyclabilityRating: 'High' | 'Medium' | 'Special Handling';
  tips: string[];
  keyAttributes: {
    cleanliness: string;
    contaminationRisk: string;
    dryWaste: boolean;
  };
}

export interface DemoSample {
  id: string;
  title: string;
  category: MaterialCategory;
  imageUrl: string;
  description: string;
}

export function resolveSampleImage(key: string, fallbackUrl: string): string {
  const candidateDirs = [
    path.resolve(__dirname, '../../../client/public/samples'),
    path.resolve(__dirname, '../../client/public/samples'),
    path.resolve(process.cwd(), '../client/public/samples'),
    path.resolve(process.cwd(), 'client/public/samples'),
    path.resolve(process.cwd(), 'public/samples')
  ];

  for (const dir of candidateDirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const match = files.find(f => {
          const lower = f.toLowerCase();
          return lower.startsWith(key) || lower.includes(key);
        });
        if (match) {
          return '/samples/' + match;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return fallbackUrl;
}

export function getDemoSamples(): DemoSample[] {
  return [
    {
      id: 'sample-cardboard',
      title: 'Corrugated Delivery Cartons',
      category: 'cardboard',
      imageUrl: resolveSampleImage('cardboard', '/samples/cardboard.jpeg'),
      description: 'Amazon delivery packaging boxes and corrugated cardboard sheets'
    },
    {
      id: 'sample-paper',
      title: 'Old Newspapers & Study Books',
      category: 'paper',
      imageUrl: resolveSampleImage('paper', '/samples/paper.jpeg'),
      description: 'Stacked daily newspapers, study guides, and white office printouts'
    },
    {
      id: 'sample-plastic',
      title: 'PET Mineral Water & Soda Bottles',
      category: 'plastic',
      imageUrl: resolveSampleImage('plastic', '/samples/plastic.jpeg'),
      description: 'Crushed and intact transparent PET plastic beverage bottles'
    },
    {
      id: 'sample-metal',
      title: 'Aluminum Soda Cans & Iron Scrap',
      category: 'metal',
      imageUrl: resolveSampleImage('metal', '/samples/metal.jpg'),
      description: 'Empty beverage tins, aluminum cans, and minor metallic scraps'
    },
    {
      id: 'sample-glass',
      title: 'Glass Beverage & Sauce Bottles',
      category: 'glass',
      imageUrl: resolveSampleImage('glass', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'),
      description: 'Clean amber, green, and clear glass bottles and jars'
    },
    {
      id: 'sample-ewaste',
      title: 'Discarded Electronics & Motherboard',
      category: 'e_waste',
      imageUrl: resolveSampleImage('ewaste', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'),
      description: 'Dead circuit board, old smartphone, chargers, and ribbon cables'
    }
  ];
}

export const DEMO_SAMPLES: DemoSample[] = getDemoSamples();

export function classifyWasteImage(imageDataOrSampleId?: string): AIClassificationResult {
  let detectedCategory: MaterialCategory = 'cardboard';
  let label = 'Corrugated Cardboard Box';
  let subType = 'Brown Kraft Fluted Carton';
  let confidence = 0.96;

  if (imageDataOrSampleId) {
    const matchedSample = DEMO_SAMPLES.find(s => s.id === imageDataOrSampleId || imageDataOrSampleId.includes(s.id));
    if (matchedSample) {
      detectedCategory = matchedSample.category;
    } else {
      const lower = imageDataOrSampleId.toLowerCase();
      if (lower.includes('paper') || lower.includes('newspaper') || lower.includes('book') || lower.includes('raddi')) {
        detectedCategory = 'paper';
      } else if (lower.includes('plastic') || lower.includes('bottle') || lower.includes('pet')) {
        detectedCategory = 'plastic';
      } else if (lower.includes('metal') || lower.includes('can') || lower.includes('iron') || lower.includes('aluminum')) {
        detectedCategory = 'metal';
      } else if (lower.includes('glass') || lower.includes('jar')) {
        detectedCategory = 'glass';
      } else if (lower.includes('ewaste') || lower.includes('e-waste') || lower.includes('circuit') || lower.includes('phone') || lower.includes('electronic')) {
        detectedCategory = 'e_waste';
      } else if (lower.includes('cardboard') || lower.includes('carton') || lower.includes('box') || lower.includes('gatta')) {
        detectedCategory = 'cardboard';
      } else {
        const categories: MaterialCategory[] = ['plastic', 'cardboard', 'paper', 'metal', 'glass', 'e_waste'];
        const hash = imageDataOrSampleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        detectedCategory = categories[hash % categories.length];
      }
    }
  }

  switch (detectedCategory) {
    case 'paper':
      label = 'Old Newspaper & Office Paper';
      subType = 'Grade A Newsprint / Cellulose';
      confidence = 0.94;
      break;
    case 'cardboard':
      label = 'Corrugated Packaging Carton';
      subType = 'Kraft Fluted Board (Double-Wall)';
      confidence = 0.97;
      break;
    case 'plastic':
      label = 'PET Beverage Containers';
      subType = 'Polyethylene Terephthalate (#1)';
      confidence = 0.93;
      break;
    case 'metal':
      label = 'Scrap Aluminum & Ferrous Metal';
      subType = 'Recyclable Beverage Tins';
      confidence = 0.95;
      break;
    case 'glass':
      label = 'Glass Jars & Cullet';
      subType = 'Soda-Lime Container Glass';
      confidence = 0.92;
      break;
    case 'e_waste':
      label = 'Consumer Electronics / Circuit Board';
      subType = 'PCB & Precious Metals Recovery';
      confidence = 0.98;
      break;
  }

  const rateItem = db.getRateByCategory(detectedCategory);
  const currentRate = rateItem ? rateItem.ratePerKg : 15;

  const tipsMap: Record<MaterialCategory, string[]> = {
    cardboard: [
      'Flatten all cartons to minimize transport volume.',
      'Keep away from grease, oil, and moisture.',
      'Remove packing tape and bubble wrap for highest valuation.'
    ],
    paper: [
      'Tie stacks neatly with string or twine.',
      'Ensure papers are dry to prevent mold.',
      'Remove plastic spiral bindings and metallic paperclips.'
    ],
    plastic: [
      'Rinse out leftover liquid or food residue.',
      'Crush bottles to save space in collector bag.',
      'Separate caps and bottle labels if possible.'
    ],
    metal: [
      'Rinse soda and tin cans before storing.',
      'Magnetic testing separates steel from valuable aluminum.',
      'Ensure sharp metal edges are safely contained.'
    ],
    glass: [
      'Handle with care; do not break intentionally.',
      'Rinse food and beverage bottles clean.',
      'Ensure window pane or mirror glass is separated.'
    ],
    e_waste: [
      'Never attempt to burn or dismantle lithium batteries.',
      'Wipe personal data from phones/tablets before recycling.',
      'Keep power cables and chargers bundled together.'
    ]
  };

  return {
    category: detectedCategory,
    categoryName: rateItem ? rateItem.name : detectedCategory,
    detectedLabel: label,
    subType,
    confidence,
    estimatedRatePerKg: currentRate,
    recyclabilityRating: detectedCategory === 'e_waste' ? 'Special Handling' : 'High',
    tips: tipsMap[detectedCategory] || ['Store in a dry location until pickup.'],
    keyAttributes: {
      cleanliness: 'Good (Ready for collection)',
      contaminationRisk: detectedCategory === 'plastic' ? 'Low' : 'Minimal',
      dryWaste: true
    }
  };
}