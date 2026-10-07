import { useEffect, useMemo, useState } from 'react';

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

const filterOptions = ['All', 'Pests', 'Diseases', 'Weeds', 'Active Ingredients'];
const quickAccess = [
  { label: 'IRAC', value: '28-6' },
  { label: 'FRAC', value: '11' },
  { label: 'HRAC', value: 'K3' },
  { label: 'MOA', value: '4' }
];

const categoryMeta = {
  pest: { label: 'Pests', icon: '🐛', color: 'green', badge: 'Insect' },
  disease: { label: 'Diseases', icon: '🦠', color: 'blue', badge: 'Pathogen' },
  weed: { label: 'Weeds', icon: '🌿', color: 'amber', badge: 'Herbicide' },
  ingredient: { label: 'Active Ingredients', icon: '🧪', color: 'gray', badge: 'AI' }
};

function App() {
  const [records, setRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('fall-armyworm');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query));
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        setRecords(data.items || []);
        if (data.items?.length) {
          setSelectedId(data.items[0].id);
        }
      } catch (err) {
        setError('Unable to load agronomy data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [query]);

  const filteredRecords = useMemo(() => {
    if (!records.length) return [];

    return records.filter((record) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Pests') return record.category === 'pest';
      if (selectedCategory === 'Diseases') return record.category === 'disease';
      if (selectedCategory === 'Weeds') return record.category === 'weed';
      if (selectedCategory === 'Active Ingredients') return record.category === 'ingredient';
      return true;
    });
  }, [records, selectedCategory]);

  const selectedRecord =
    filteredRecords.find((item) => item.id === selectedId) ||
    records.find((item) => item.id === selectedId) ||
    records[0] || null;

  const categoryCards = [
    { key: 'Pests', info: categoryMeta.pest },
    { key: 'Diseases', info: categoryMeta.disease },
    { key: 'Weeds', info: categoryMeta.weed }
  ];

  if (loading) {
    return <div className="loading">Loading Agri Nexus...</div>;
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
            <strong>Agri Nexus</strong>
            <small>Agricultural Crop Protection</small>
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
            <span className="crumb">Home</span>
            <span className="divider">›</span>
            <span className="crumb">Crop Protection</span>
          </div>
          <div className="topbar-right">
            <button className="ghost-btn">EN</button>
            <button className="profile-btn">S</button>
          </div>
        </header>

        <section className="hero panel">
          <div className="hero-head">
            <div>
              <h1>Agri Nexus</h1>
            </div>
            <div className="hero-actions">
              <span className="badge success">Field overview</span>
            </div>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pest, disease, weed, active ingredient or MOA..."
            />
            <button>Search</button>
          </div>

          <div className="cards-grid">
            {categoryCards.map(({ key, info }) => (
              <button key={key} className="crop-card" onClick={() => setSelectedCategory(key)}>
                <div className={`card-icon ${info.color}`}>{info.icon}</div>
                <div className="card-info">
                  <h3>{key}</h3>
                  <p>{info.label} affecting yield and crop health.</p>
                </div>
                <span>→</span>
              </button>
            ))}
          </div>

          <div className="quick-access">
            <div className="quick-title">Quick Access</div>
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
              <h3>Search Results ({filteredRecords.length})</h3>
              <div className="panel-tabs">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`tag ${selectedCategory === option ? 'green' : ''}`}
                    onClick={() => setSelectedCategory(option)}
                  >
                    {option}
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
                  <div className="icon-box">{record.category === 'pest' ? 'P' : record.category === 'disease' ? 'D' : record.category === 'weed' ? 'W' : 'AI'}</div>
                  <div className="result-info">
                    <strong>{record.name}</strong>
                    <small>{record.scientificName}</small>
                  </div>
                  <div className="mini-badge green">{record.iracGroup}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedRecord && (
            <div className="panel">
              <div className="panel-header">
                <h3>{selectedRecord.name}</h3>
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
                  <span className="pill green">{selectedRecord.category}</span>
                  <span className="pill amber">{selectedRecord.resistanceRisk}</span>
                </div>
              </div>

              <div className="detail-tabs">
                <button className="tab active">Overview</button>
                <button className="tab">Control</button>
                <button className="tab">Resistance</button>
              </div>

              <div className="info-block">
                <div className="info-row">
                  <span className="label">Identification</span>
                  <span>{selectedRecord.identification}</span>
                </div>
                <div className="info-row">
                  <span className="label">Damage</span>
                  <span>{selectedRecord.damage}</span>
                </div>
                <div className="info-row">
                  <span className="label">Life Cycle</span>
                  <span>{selectedRecord.lifeCycle}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {selectedRecord && (
          <section className="lower-grid">
            <div className="panel wide">
              <div className="panel-header">
                <h3>{selectedRecord.name}</h3>
                <div className="header-actions">
                  <span className="tag blue">{categoryMeta[selectedRecord.category]?.label || 'Reference'}</span>
                  <span className="tag neutral">{selectedRecord.source}</span>
                  <span className="tag warning">{selectedRecord.resistanceRisk}</span>
                </div>
              </div>

              <div className="detail-layout">
                <div className="detail-card">
                  <div className="mini-visual" style={{ backgroundImage: `url('${selectedRecord.image}')` }} />
                  <div className="detail-content">
                    <h4>{selectedRecord.scientificName}</h4>
                    <div className="status-row">
                      <span className="mini-tag blue">{selectedRecord.category}</span>
                      <span className="mini-tag green">{selectedRecord.iracGroup}</span>
                      <span className="mini-tag amber">{selectedRecord.resistanceRisk}</span>
                    </div>

                    <div className="table-like">
                      <div className="table-row">
                        <span>Where found</span>
                        <strong>{selectedRecord.country}</strong>
                      </div>
                      <div className="table-row">
                        <span>Summary</span>
                        <strong>{selectedRecord.summary}</strong>
                      </div>
                      <div className="table-row">
                        <span>Control</span>
                        <strong>{selectedRecord.control}</strong>
                      </div>
                      <div className="table-row">
                        <span>Related active ingredients</span>
                        <strong>{selectedRecord.activeIngredients.join(', ')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="related-box">
                  <h4>Quick reference</h4>
                  {['Target pests', 'Resistance', 'Mode of action', 'Management'].map((item) => (
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
                <h3>Favorites</h3>
                <button className="small-btn">+ Add Favorites</button>
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
