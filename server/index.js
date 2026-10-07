import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const records = [
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
    identification: 'Adults are grey-brown moths with a distinct pattern on the forewing; larvae have an inverted Y on the head and feed aggressively.',
    damage: 'Leaf feeding, whorl damage, stem tunneling and severe defoliation in maize.',
    lifeCycle: 'Lifecycle completes in 2–4 weeks under warm conditions, enabling rapid population build-up.',
    control: 'Biological control, pheromone traps, cultural practices, and selective insecticides such as chlorantraniliprole.',
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
    lifeCycle: 'Survives in soil and plant debris for several years under favourable conditions.',
    control: 'Crop rotation, resistant varieties, sanitation, soil health management and seed treatments.',
    activeIngredients: ['Tebuconazole', 'Azoxystrobin'],
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
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
    identification: 'Triangular stems, glossy leaves and purple-brown inflorescence with tuber production.',
    damage: 'Reduces crop yield by competing strongly for water, nutrients and light.',
    lifeCycle: 'Tubers allow survival through drought and repeated tillage cycles.',
    control: 'Integrated management with herbicides, shallow cultivation and prevention of weed spread.',
    activeIngredients: ['Glyphosate', 'Halosulfuron-methyl', 'S-metolachlor'],
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
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
    source: 'HRAC • Weed Science',
    summary: 'Non-selective systemic herbicide widely used before planting or in glyphosate-tolerant crops.',
    identification: 'Blocks aromatic amino acid synthesis and causes chlorosis and death in susceptible weeds.',
    damage: 'Highly effective against annual and perennial broadleaf weeds and grasses.',
    lifeCycle: 'Translocated through the plant to growing points, killing both shoots and roots.',
    control: 'Use in rotation with other MOA groups, and combine with cultural practices.',
    activeIngredients: ['Glyphosate'],
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
  }
];

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toString().trim().toLowerCase();

  const filtered = !q
    ? records
    : records.filter((record) => {
        const haystack = [
          record.name,
          record.scientificName,
          record.summary,
          record.country,
          record.control,
          record.activeIngredients.join(' ')
        ].join(' ').toLowerCase();

        return haystack.includes(q);
      });

  res.json({
    count: filtered.length,
    items: filtered
  });
});

app.get('/api/records/:id', (req, res) => {
  const item = records.find((record) => record.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Record not found' });
  }

  res.json({ item });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Agri Nexus API' });
});

app.listen(PORT, () => {
  console.log(`Agri Nexus API running on http://localhost:${PORT}`);
});
