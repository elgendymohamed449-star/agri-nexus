export const categoryMeta = {
  pest: {
    label: 'Pests',
    icon: '🐛',
    badge: 'Insect',
    color: 'green',
    description: 'Insect pests affecting crops and stored produce.'
  },
  disease: {
    label: 'Diseases',
    icon: '🦠',
    badge: 'Fungal/Bacterial',
    color: 'blue',
    description: 'Plant diseases that reduce vigor and yield.'
  },
  weed: {
    label: 'Weeds',
    icon: '🌿',
    badge: 'Herbicide',
    color: 'amber',
    description: 'Competitive weeds causing losses in crop production.'
  },
  ingredient: {
    label: 'Active Ingredients',
    icon: '🧪',
    badge: 'AI',
    color: 'gray',
    description: 'Key active ingredients and mode of action groups.'
  }
};

export const cropRecords = [
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm',
    category: 'pest',
    scientificName: 'Spodoptera frugiperda',
    country: 'Global tropics and subtropics',
    iracGroup: '28-6',
    resistanceRisk: 'Medium',
    source: 'CABI • IRAC',
    summary: 'Highly polyphagous lepidopteran pest attacking maize, sorghum, rice and other cereals.',
    identification: 'Adults are grey-brown moths with a distinct pattern on the forewing; larvae have inverted Y on head and feed aggressively.',
    damage: 'Leaf feeding, whorl damage, stem tunneling and severe defoliation in maize.',
    lifeCycle: 'Lifecycle completed in 2–4 weeks under warm conditions, facilitating rapid population build-up.',
    control: 'Biological control, pheromone traps, cultural practices, and selective insecticides such as chlorantraniliprole.',
    symptoms: ['Leaf raggedness', 'Frass in whorl', 'Stunted growth'],
    activeIngredients: ['Chlorantraniliprole', 'Emamectin benzoate', 'Spinetoram'],
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'fusarium-wilt',
    name: 'Fusarium Wilt',
    category: 'disease',
    scientificName: 'Fusarium oxysporum',
    country: 'Global warm climates',
    iracGroup: 'NA',
    resistanceRisk: 'High',
    source: 'CABI • FAO',
    summary: 'Soil-borne fungal disease causing vascular wilting and plant collapse in many crops.',
    identification: 'Yellowing of lower leaves, wilting, browning of vascular tissue and plant death.',
    damage: 'Severe yield loss as the pathogen blocks water transport in the xylem.',
    lifeCycle: 'Survives in soil and plant debris for several years under favorable conditions.',
    control: 'Crop rotation, resistant varieties, sanitation, soil health management and seed treatments.',
    symptoms: ['Leaf yellowing', 'Vascular browning', 'Wilting despite adequate moisture'],
    activeIngredients: ['Tebuconazole', 'Azoxystrobin'],
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'late-blight',
    name: 'Late Blight',
    category: 'disease',
    scientificName: 'Phytophthora infestans',
    country: 'Temperate potato regions',
    iracGroup: 'NA',
    resistanceRisk: 'High',
    source: 'CABI • EPPO',
    summary: 'Devastating oomycete disease of potato and tomato, spreading rapidly under humid conditions.',
    identification: 'Water-soaked lesions on foliage and stems, often with white sporulation on the underside of leaves.',
    damage: 'Can destroy leaves and tubers within days under conducive weather.',
    lifeCycle: 'Requires high humidity and cool temperatures, with rapid secondary spread.',
    control: 'Foliar fungicides, resistant varieties, reduced irrigation and prompt removal of diseased debris.',
    symptoms: ['Dark leaf lesions', 'White fungal growth', 'Stem browning'],
    activeIngredients: ['Mancozeb', 'Metalaxyl', 'Cymoxanil'],
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'purple-nutsedge',
    name: 'Purple Nutsedge',
    category: 'weed',
    scientificName: 'Cyperus rotundus',
    country: 'Warm agroecosystems',
    iracGroup: 'HRAC: K3',
    resistanceRisk: 'High',
    source: 'CABI • HRAC',
    summary: 'Perennial sedge with high competitive ability and vegetative reproduction via tubers.',
    identification: 'Triangular stems, glossy leaves, and purple-brown inflorescence with tuber production.',
    damage: 'Reduces crop yield by competing strongly for water, nutrients, and light.',
    lifeCycle: 'Tubers allow survival through drought and repeated tillage cycles.',
    control: 'Integrated management with herbicides, shallow cultivation and prevention of seed movement.',
    symptoms: ['Patchy stand loss', 'Clumped weed growth', 'Reduced crop vigor'],
    activeIngredients: ['Glyphosate', 'Halosulfuron-methyl', 'S-metolachlor'],
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'striga',
    name: 'Striga / Witchweed',
    category: 'weed',
    scientificName: 'Striga hermonthica',
    country: 'Sub-Saharan Africa',
    iracGroup: 'HRAC: C1',
    resistanceRisk: 'High',
    source: 'FAO • IITA',
    summary: 'Obligate parasitic weed that drains water and nutrients from cereal crops.',
    identification: 'Thin stems with pink to purple flowers emerging from the base of host plants.',
    damage: 'Severe yield loss, especially in maize and sorghum in low-input systems.',
    lifeCycle: 'Seeds remain viable in soil for many years and germinate in response to host root exudates.',
    control: 'Resistant varieties, intercropping, seed bank reduction, and selective herbicides.',
    symptoms: ['Stunted crop growth', 'Flowering weeds in crop rows', 'Poor grain fill'],
    activeIngredients: ['Glyphosate', 'Imazapyr'],
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'chlorantraniliprole',
    name: 'Chlorantraniliprole',
    category: 'ingredient',
    scientificName: 'Anthranilic diamide',
    country: 'Global use',
    iracGroup: '28',
    resistanceRisk: 'Moderate',
    source: 'IRAC • CABI',
    summary: 'Selective insecticide with powerful feeding cessation effects against lepidopteran pests.',
    identification: 'Systemic and translaminar activity with long residual control in crops.',
    damage: 'Effective against yield-loss pests when larvae are feeding on foliage or fruits.',
    lifeCycle: 'Not a biological lifecycle stage; instead it disrupts ryanodine receptors in insect muscles.',
    control: 'Used in integrated pest management programs to manage caterpillars and fruit worms.',
    symptoms: ['Feeding cessation', 'Larval mortality', 'Reduced crop damage'],
    activeIngredients: ['Chlorantraniliprole'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'azoxystrobin',
    name: 'Azoxystrobin',
    category: 'ingredient',
    scientificName: 'Strobilurin fungicide',
    country: 'Global use',
    iracGroup: '11',
    resistanceRisk: 'Moderate',
    source: 'FRAC • CABI',
    summary: 'Broad-spectrum fungicide with protective and curative activity against many foliar diseases.',
    identification: 'Interferes with mitochondrial respiration in fungal pathogens.',
    damage: 'Controls diseases including rusts, leaf spots and fruit rots.',
    lifeCycle: 'Used as a foliar treatment in several crop protection programs.',
    control: 'Apply preventively and in alternation with different modes of action to reduce resistance.',
    symptoms: ['Disease suppression', 'Foliage protection', 'Improved yield'],
    activeIngredients: ['Azoxystrobin'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'glyphosate',
    name: 'Glyphosate',
    category: 'ingredient',
    scientificName: 'EPSP synthase inhibitor',
    country: 'Global use',
    iracGroup: 'G',
    resistanceRisk: 'High',
    source: 'HRAC • WEED SCIENCE',
    summary: 'Non-selective systemic herbicide widely used before planting or in glyphosate-tolerant crops.',
    identification: 'Blocks aromatic amino acid synthesis and causes chlorosis and death in susceptible weeds.',
    damage: 'Highly effective against annual and perennial broadleaf weeds and grasses.',
    lifeCycle: 'Translocated through the plant to growing points, killing both shoots and roots.',
    control: 'Used in integrated weed management; rotation with other MOA groups is recommended.',
    symptoms: ['Chlorosis', 'Necrosis', 'Weed suppression'],
    activeIngredients: ['Glyphosate'],
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
  }
];

export const quickAccess = [
  { label: 'IRAC', value: '28-6' },
  { label: 'FRAC', value: '11' },
  { label: 'HRAC', value: 'K3' },
  { label: 'MOA', value: '4' }
];

export const filterOptions = ['All', 'Pests', 'Diseases', 'Weeds', 'Active Ingredients'];
