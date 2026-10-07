import React, { useMemo, useState } from 'react';
import './styles.css';
import { cropRecords, categoryMeta, quickAccess, filterOptions } from './data';

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

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState('fall-armyworm');

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cropRecords.filter((record) => {
      const categoryMatch =
        selectedCategory === 'All' ||
        (selectedCategory === 'Pests' && record.category === 'pest') ||
        (selectedCategory === 'Diseases' && record.category === 'disease') ||
        (selectedCategory === 'Weeds' && record.category === 'weed') ||
        (selectedCategory === 'Active Ingredients' && record.category === 'ingredient');

      const queryMatch =
        !normalized ||
        record.name.toLowerCase().includes(normalized) ||
        record.summary.toLowerCase().includes(normalized) ||
        record.scientificName.toLowerCase().includes(normalized) ||
        record.activeIngredients.some((item) => item.toLowerCase().includes(normalized));

      return categoryMatch && queryMatch;
    });
  }, [query, selectedCategory]);

  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedRecordId) ||
    cropRecords.find((record) => record.id === selectedRecordId) ||
    cropRecords[0];

  const categoryCards = [
    { key: 'Pests', info: categoryMeta.pest },
    { key: 'Diseases', info: categoryMeta.disease },
    { key: 'Weeds', info: categoryMeta.weed }
  ];

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
              <button
                key={key}
                className="crop-card"
                onClick={() => setSelectedCategory(key)}
              >
                <div className={`card-icon ${info.color}`}>{info.icon}</div>
                <div className="card-info">
                  <h3>{key}</h3>
                  <p>{info.description}</p>
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
                    className={`tag ${selectedCategory === option || (option === 'All' && selectedCategory === 'All') ? 'green' : ''}`}
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
                  className={`result-item ${selectedRecord.id === record.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRecordId(record.id)}
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
        </section>

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
                      <span>Country / Where found</span>
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
      </main>
    </div>
  );
}

export default App;
