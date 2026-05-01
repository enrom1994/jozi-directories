// lib/niches.js
// Central config for all niches.
// Add a new niche here + drop its JSON file in /data/ — pages generate automatically.

export const NICHES = [
  {
    slug: 'driving-schools',
    label: 'Driving Schools',
    description: 'Find accredited K53 driving schools near you in Johannesburg and Gauteng.',
    icon: '🚗',
    dataFile: 'driving-schools.json',
    searchKeywords: ['driving school', 'k53', 'learners licence', 'drivers licence'],
  },
  {
    slug: 'solar-inverter-installers',
    label: 'Solar & Inverter Installers',
    description: 'Compare solar panel and inverter backup installers across Gauteng.',
    icon: '☀️',
    dataFile: 'solar-inverter-installers.json',
    searchKeywords: ['solar panels', 'inverter installer', 'backup power', 'load shedding'],
  },
  {
    slug: 'dog-groomers',
    label: 'Dog Groomers',
    description: 'Find trusted dog groomers and pet grooming salons near you in Joburg.',
    icon: '🐾',
    dataFile: 'dog-groomers.json',
    searchKeywords: ['dog groomer', 'pet grooming', 'dog wash', 'dog salon'],
  },
  {
    slug: 'panel-beaters',
    label: 'Panel Beaters',
    description: 'Panel beaters and auto body repair shops in Johannesburg and Gauteng.',
    icon: '🔧',
    dataFile: 'panel-beaters.json',
    searchKeywords: ['panel beater', 'auto body repair', 'car dent repair', 'accident repair'],
  },
  {
    slug: 'phone-repair-shops',
    label: 'Phone Repair Shops',
    description: 'Screen repairs, battery replacements and phone repairs near you in Joburg.',
    icon: '📱',
    dataFile: 'phone-repair-shops.json',
    searchKeywords: ['phone repair', 'screen repair', 'iphone repair', 'samsung repair'],
  },
]

export function getNicheBySlug(slug) {
  return NICHES.find(n => n.slug === slug) || null
}
