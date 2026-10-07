import { useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    brand: 'Agri Nexus',
    subtitle: 'Agricultural Crop Protection',
    home: 'Home',
    cropProtection: 'Crop Protection',
    fieldOverview: 'Field overview',
    searchPlaceholder: 'Search pest, disease, weed, crop, vegetable, ingredient or MOA...',
    search: 'Search',
    results: 'Search Results',
    dashboard: 'Dashboard',
    favorites: 'Favorites',
    quickAccess: 'Quick Access',
    overview: 'Overview',
    control: 'Control',
    resistance: 'Resistance',
    identification: 'Identification',
    damage: 'Damage',
    lifeCycle: 'Life Cycle',
    summary: 'Summary',
    whereFound: 'Where found',
    relatedAI: 'Related active ingredients',
    quickReference: 'Quick reference',
    targetPests: 'Target pests',
    management: 'Management',
    modeOfAction: 'Mode of action',
    all: 'All',
    pests: 'Pests',
    diseases: 'Diseases',
    weeds: 'Weeds',
    crops: 'Crops',
    vegetables: 'Vegetables',
    activeIngredients: 'Active Ingredients',
    loading: 'Loading Agri Nexus...',
    error: 'Unable to load agronomy data'
  },
  ar: {
    brand: 'نيكسوس الزراعة',
    subtitle: 'حماية المحاصيل والزراعة',
    home: 'الرئيسية',
    cropProtection: 'حماية المحاصيل',
    fieldOverview: 'نظرة عامة',
    searchPlaceholder: 'ابحث عن آفة أو مرض أو حشائش أو محصول أو خضار أو مادة فعالة...',
    search: 'بحث',
    results: 'نتائج البحث',
    dashboard: 'لوحة التحكم',
    favorites: 'المفضلة',
    quickAccess: 'الوصول السريع',
    overview: 'نظرة عامة',
    control: 'المكافحة',
    resistance: 'المقاومة',
    identification: 'التعريف',
    damage: 'الأضرار',
    lifeCycle: 'دورة الحياة',
    summary: 'ملخص',
    whereFound: 'مكان الانتشار',
    relatedAI: 'المواد الفعالة المرتبطة',
    quickReference: 'مرجع سريع',
    targetPests: 'الآفات المستهدفة',
    management: 'الإدارة',
    modeOfAction: 'آلية العمل',
    all: 'الكل',
    pests: 'الآفات',
    diseases: 'الأمراض',
    weeds: 'الحشائش',
    crops: 'المحاصيل',
    vegetables: 'الخضروات',
    activeIngredients: 'المواد الفعالة',
    loading: 'جاري تحميل Agri Nexus...',
    error: 'تعذر تحميل بيانات الزراعة'
  }
};

const categoryMeta = {
  pest: { en: 'Pests', ar: 'الآفات', icon: '🐛', color: 'green', badge: 'Insect' },
  disease: { en: 'Diseases', ar: 'الأمراض', icon: '🦠', color: 'blue', badge: 'Pathogen' },
  weed: { en: 'Weeds', ar: 'الحشائش', icon: '🌿', color: 'amber', badge: 'Herbicide' },
  crop: { en: 'Crops', ar: 'المحاصيل', icon: '🌾', color: 'green', badge: 'Crop' },
  vegetable: { en: 'Vegetables', ar: 'الخضروات', icon: '🥬', color: 'blue', badge: 'Vegetable' },
  ingredient: { en: 'Active Ingredients', ar: 'المواد الفعالة', icon: '🧪', color: 'gray', badge: 'AI' }
};

const sidebarItems = [
  'Dashboard',
  'Search',
  'Crop Protection',
  'Pests',
  'Diseases',
  'Weeds',
  'Classification',
  'IRAC',
  'FRAC',
  'HRAC',
  'My Workspace',
  'Favorites',
  'Notes',
  'System',
  'References',
  'Settings',
  'About'
];

const filterOptions = ['All', 'Pests', 'Diseases', 'Weeds', 'Crops', 'Vegetables', 'Active Ingredients'];
const quickAccess = [
  { label: 'IRAC', value: '28-6' },
  { label: 'FRAC', value: '11' },
  { label: 'HRAC', value: 'K3' },
  { label: 'MOA', value: '4' }
];

function App() {
  const [records, setRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('fall-armyworm');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('ar');

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/search?q=' + encodeURIComponent(query));
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        const items = data.items || [];
        setRecords(items);
        if (items.length && !items.some((item) => item.id === selectedId)) {
          setSelectedId(items[0].id);
        }
      } catch (err) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [query, t.error]);

  const filteredRecords = useMemo(() => {
    if (!records.length) return [];

    return records.filter((record) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Pests') return record.category === 'pest';
      if (selectedCategory === 'Diseases') return record.category === 'disease';
      if (selectedCategory === 'Weeds') return record.category === 'weed';
      if (selectedCategory === 'Crops') return record.category === 'crop';
      if (selectedCategory === 'Vegetables') return record.category === 'vegetable';
      if (selectedCategory === 'Active Ingredients') return record.category === 'ingredient';
      return true;
    });
  }, [records, selectedCategory]);

  useEffect(() => {
    if (!filteredRecords.length) return;
    if (!filteredRecords.some((item) => item.id === selectedId)) {
      setSelectedId(filteredRecords[0].id);
    }
  }, [filteredRecords, selectedId]);

  const selectedRecord =
    filteredRecords.find((item) => item.id === selectedId) ||
    records.find((item) => item.id === selectedId) ||
    records[0] || null;

  const categoryCards = [
    { key: 'Pests', info: categoryMeta.pest },
    { key: 'Diseases', info: categoryMeta.disease },
    { key: 'Weeds', info: categoryMeta.weed },
    { key: 'Crops', info: categoryMeta.crop },
    { key: 'Vegetables', info: categoryMeta.vegetable }
  ];

  const getDisplayName = (record) => language === 'ar' ? (record.nameAr || record.name) : record.name;
  const getDisplayScientific = (record) => language === 'ar' ? (record.scientificNameAr || record.scientificName) : record.scientificName;
  const getDetailText = (enText, arText) => language === 'ar' ? (arText || enText) : (enText || arText);

  const renderRecordBadge = (category) => {
    if (category === 'pest') return 'P';
    if (category === 'disease') return 'D';
    if (category === 'weed') return 'W';
    if (category === 'crop') return 'C';
    if (category === 'vegetable') return 'V';
    return 'AI';
  };

  if (loading) {
    return <div className="loading">{t.loading}</div>;
  }

  if (error) {
    return <div className="loading error">{error}</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">F</div>
          <div className="brand-text">
            <strong>{t.brand}</strong>
            <small>{t.subtitle}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => {
            const isActive = item === 'Crop Protection' || item === 'Search';
            return (
              <div key={`${item}-${index}`} className={`nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{index < 2 ? (index === 0 ? '⌂' : '⌕') : '◈'}</span>
                <span>{item}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div className="topbar-left">
            <span className="crumb">{t.home}</span>
            <span className="divider">›</span>
            <span className="crumb">{t.cropProtection}</span>
          </div>
          <div className="topbar-right">
            <button className="ghost-btn lang-toggle" onClick={() => setLanguage((current) => current === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button className="profile-btn">S</button>
          </div>
        </header>

        <section className="hero panel">
          <div className="hero-head">
            <div>
              <h1>{t.brand}</h1>
            </div>
            <div className="hero-actions">
              <span className="badge success">{t.fieldOverview}</span>
            </div>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
            />
            <button>{t.search}</button>
          </div>

          <div className="cards-grid">
            {categoryCards.map(({ key, info }) => (
              <button key={key} className="crop-card" onClick={() => setSelectedCategory(key)}>
                <div className={`card-icon ${info.color}`}>{info.icon}</div>
                <div className="card-info">
                  <h3>{language === 'ar' ? categoryMeta[key.toLowerCase().replace(/\s+/g, '')] ? categoryMeta[key.toLowerCase().replace(/\s+/g, '')].ar : key : key}</h3>
                  <p>{language === 'ar' ? info.ar : info.en} affecting yield and crop health.</p>
                </div>
                <span>→</span>
              </button>
            ))}
          </div>

          <div className="quick-access">
            <div className="quick-title">{t.quickAccess}</div>
            <div className="quick-chips">
              {quickAccess.map((item) => (
                <div key={item.label} className="chip">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>{t.results} ({filteredRecords.length})</h3>
              <div className="panel-tabs">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`tag ${selectedCategory === option ? 'green' : ''}`}
                    onClick={() => setSelectedCategory(option)}
                  >
                    {language === 'ar' ?
                      (option === 'All' ? t.all : option === 'Pests' ? t.pests : option === 'Diseases' ? t.diseases : option === 'Weeds' ? t.weeds : option === 'Crops' ? t.crops : option === 'Vegetables' ? t.vegetables : t.activeIngredients) :
                      option}
                  </button>
                ))}
              </div>
            </div>

            <div className="results-list">
              {filteredRecords.map((record) => (
                <button
                  key={record.id}
                  className={`result-item ${selectedRecord?.id === record.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(record.id)}
                >
                  <div className="icon-box">{renderRecordBadge(record.category)}</div>
                  <div className="result-info">
                    <strong>{getDisplayName(record)}</strong>
                    <small>{getDisplayScientific(record)}</small>
                  </div>
                  <div className="mini-badge green">{record.iracGroup}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedRecord && (
            <div className="panel">
              <div className="panel-header">
                <h3>{getDisplayName(selectedRecord)}</h3>
                <div className="header-actions">
                  <span className="tag success">{categoryMeta[selectedRecord.category]?.badge || 'Reference'}</span>
                  <span className="tag neutral">{selectedRecord.iracGroup}</span>
                </div>
              </div>

              <div className="pest-hero">
                <div
                  className="pest-image"
                  style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.12)), url('${selectedRecord.image}')` }}
                />
                <div className="pest-meta">
                  <span className="pill green">{language === 'ar' ? categoryMeta[selectedRecord.category]?.ar : categoryMeta[selectedRecord.category]?.en}</span>
                  <span className="pill amber">{selectedRecord.resistanceRisk}</span>
                </div>
              </div>

              <div className="detail-tabs">
                <button className="tab active">{t.overview}</button>
                <button className="tab">{t.control}</button>
                <button className="tab">{t.resistance}</button>
              </div>

              <div className="info-block">
                <div className="info-row">
                  <span className="label">{t.identification}</span>
                  <span>{getDetailText(selectedRecord.identification, selectedRecord.identificationAr)}</span>
                </div>
                <div className="info-row">
                  <span className="label">{t.damage}</span>
                  <span>{getDetailText(selectedRecord.damage, selectedRecord.damageAr)}</span>
                </div>
                <div className="info-row">
                  <span className="label">{t.lifeCycle}</span>
                  <span>{getDetailText(selectedRecord.lifeCycle, selectedRecord.lifeCycleAr)}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {selectedRecord && (
          <section className="lower-grid">
            <div className="panel wide">
              <div className="panel-header">
                <h3>{getDisplayName(selectedRecord)}</h3>
                <div className="header-actions">
                  <span className="tag blue">{language === 'ar' ? categoryMeta[selectedRecord.category]?.ar : categoryMeta[selectedRecord.category]?.en}</span>
                  <span className="tag neutral">{selectedRecord.source}</span>
                  <span className="tag warning">{selectedRecord.resistanceRisk}</span>
                </div>
              </div>

              <div className="detail-layout">
                <div className="detail-card">
                  <div className="mini-visual" style={{ backgroundImage: `url('${selectedRecord.image}')` }} />
                  <div className="detail-content">
                    <h4>{getDisplayScientific(selectedRecord)}</h4>
                    <div className="status-row">
                      <span className="mini-tag blue">{language === 'ar' ? categoryMeta[selectedRecord.category]?.ar : categoryMeta[selectedRecord.category]?.en}</span>
                      <span className="mini-tag green">{selectedRecord.iracGroup}</span>
                      <span className="mini-tag amber">{selectedRecord.resistanceRisk}</span>
                    </div>

                    <div className="table-like">
                      <div className="table-row">
                        <span>{t.whereFound}</span>
                        <strong>{selectedRecord.country}</strong>
                      </div>
                      <div className="table-row">
                        <span>{t.summary}</span>
                        <strong>{getDetailText(selectedRecord.summary, selectedRecord.summaryAr)}</strong>
                      </div>
                      <div className="table-row">
                        <span>{t.control}</span>
                        <strong>{getDetailText(selectedRecord.control, selectedRecord.controlAr)}</strong>
                      </div>
                      <div className="table-row">
                        <span>{t.relatedAI}</span>
                        <strong>{selectedRecord.activeIngredients?.join(', ')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="related-box">
                  <h4>{t.quickReference}</h4>
                  {[t.targetPests, t.resistance, t.modeOfAction, t.management].map((item) => (
                    <div key={item} className="related-item">
                      <span>{item}</span>
                      <button>›</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel narrow">
              <div className="panel-header">
                <h3>{t.favorites}</h3>
                <button className="small-btn">+ {t.favorites}</button>
              </div>

              <div className="favorites-list">
                {['Fall Armyworm', 'Fusarium Wilt', 'Glyphosate', 'Chlorantraniliprole'].map((item) => (
                  <div key={item} className="favorite-row">
                    <div className="fav-name">{item}</div>
                    <div className="fav-tag">{item.includes('Glyph') ? 'Herbicide' : item.includes('Fusarium') ? 'Disease' : item.includes('Chlor') ? 'AI' : 'Pest'}</div>
                    <div className="fav-meta">{item.includes('Fusarium') ? 'Fungal' : item.includes('Glyph') ? 'Herbicide' : 'Crop'}</div>
                    <div className="fav-date">2025-08-10</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

