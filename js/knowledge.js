/* Knowledge Platform: Educational guides and encyclopedias built from DB relationships.
   Automatically generates insect, disease, weed knowledge bases; active ingredient encyclopedia;
   movement and target site guides; and resistance analysis. */
window.AXKnowledge = (function () {
  const A = () => window.AX;
  const { D, E, t, tr, uniq, by, fields, glance, list, row, bdg, riskBd, tcBd, aiLink, disLink, weedLink, dirAuto } = A;

  /* ========== INSECT KNOWLEDGE ========== */
  function insectKnowledge() {
    const sys = 'IRAC';
    const groups = D.groups.filter(g => g.system === sys);
    
    // Group by tclass
    const byClass = {};
    groups.forEach(g => {
      const cls = g.tclass || 'other';
      if (!byClass[cls]) byClass[cls] = [];
      byClass[cls].push(g);
    });
    
    const classOrder = ['nerve', 'growth', 'energy', 'midgut', 'other'];
    const classes = classOrder.filter(c => byClass[c]);
    
    return `<div class="ttl"><div><h1>${t('kn.insect.title')}</h1><div class="na">${t('kn.insect.sub')}</div></div></div>
    <div class="grid g3">${classes.map(cls => {
      const gs = byClass[cls];
      return `<div class="card c" onclick="location.hash='knowledge/insect/${cls}'">
        <h3>${E(A.TC()[cls])}</h3>
        <div class="na">${gs.length} ${t('count.groups')} · ${gs.reduce((n, g) => n + (g.actives || []).length, 0)} ${t('count.actives')}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function insectClassGuide(tclass) {
    const sys = 'IRAC';
    const groups = D.groups.filter(g => g.system === sys && (g.tclass || 'other') === tclass);
    const pests = D.pests.filter(p => (p.tclasses || []).includes(tclass));
    
    const groupCards = groups.map(g => {
      const actives = (g.actives || []).map(id => A.AI[id]).filter(Boolean);
      const pImpacted = pests.filter(p => (p.irac || []).includes(g.id));
      return `<div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <h3>${E(g.code)} — ${E(g.name)}</h3>
          ${riskBd(g.risk)}
        </div>
        <dl class="kv" style="margin-top:8px;grid-template-columns:auto 1fr">
          <dt>${t('f.moa')}</dt><dd>${E(g.moa)}</dd>
          <dt>${t('f.target')}</dt><dd>${E(g.target || '—')}</dd>
          <dt>${t('f.actives')}</dt><dd>${actives.length ? actives.map(a => aiLink(a.id, 'ins')).join(', ') : '—'}</dd>
        </dl>
        ${pImpacted.length ? `<p style="margin:8px 0 0;font-size:12px"><b>${t('rel.pests')}:</b> ${pImpacted.map(p => `<a class="lnk" href="#ins/pest/${p.id}">${E(p.common)}</a>`).join(', ')}</p>` : ''}
      </div>`;
    }).join('');
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/insect">${t('kn.insect.title')}</a></div>
    <h1>${E(A.TC()[tclass])}</h1><div class="na">${pests.length} ${t('ui.pests')} · ${groups.length} ${t('count.groups')}</div></div></div>
    ${groupCards}
    ${pests.length ? `<div class="h2">${t('ui.pests')}</div>${list(pests, p => row('#ins/pest/' + p.id, `<b>${E(p.common)}</b><small><i class="sci">${E(p.scientific)}</i></small>`, E(p.order), (p.tclasses || []).map(tcBd).join('')))}` : ''}`;
  }

  function orderGuide(order) {
    const pests = D.pests.filter(p => p.order === order);
    if (!pests.length) return insectKnowledge();
    
    // Group actives by IRAC tclass
    const byClass = {};
    pests.forEach(p => {
      (p.irac || []).forEach(gid => {
        const g = A.GID[gid];
        if (!g) return;
        const cls = g.tclass || 'other';
        if (!byClass[cls]) byClass[cls] = [];
        const aid = (g.actives || [])[0];
        if (aid && !byClass[cls].find(x => x[0] === aid)) byClass[cls].push([aid, g]);
      });
    });
    
    const classOrder = ['nerve', 'growth', 'energy', 'midgut', 'other'];
    const classes = classOrder.filter(c => byClass[c]);
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/insect">${t('kn.insect.title')}</a></div>
    <h1>${E(order)}</h1><div class="na">${pests.length} ${t('ui.pests')}</div></div></div>
    ${classes.map(cls => `<div class="h2">${E(A.TC()[cls])}</div>` + (byClass[cls] && byClass[cls].length ? 
      `<div class="card list" style="overflow:auto"><table><tr><th>${t('ui.activeing')}</th><th>IRAC</th><th>${t('f.moa')}</th><th>${t('f.risk')}</th></tr>` +
      uniq(byClass[cls].map(x => x[0])).map(aid => {
        const a = A.AI[aid];
        const gs = uniq(byClass[cls].filter(x => x[0] === aid).map(x => x[1]));
        return `<tr><td><b>${E(a.name)}</b></td><td>${gs.map(bdg).join('')}</td><td>${E(uniq(gs.map(g => g.moa)).join('; '))}</td><td>${riskBd(gs[0].risk)}</td></tr>`;
      }).join('') +
      `</table></div>` : '')).join('')}
    <div class="h2">${t('ui.pests')}</div>${list(pests, p => row('#ins/pest/' + p.id, `<b>${E(p.common)}</b>`, E(p.family || ''), (p.resistance || []).length ? `<span class="bd risk-high">${t('badge.res')}</span>` : ''))}`;
  }

  /* ========== DISEASE KNOWLEDGE ========== */
  function diseaseKnowledge() {
    const sys = 'FRAC';
    const groups = D.groups.filter(g => g.system === sys);
    
    // Group by MOA category (infer from description/name)
    const categories = {
      'Respiration Inhibitors': ['Respiration', 'Cytochrome', 'Complex'],
      'SDHI': ['SDHI', 'succinate'],
      'Sterol Biosynthesis': ['Sterol', 'Azole', 'Morpholine'],
      'Cell Wall': ['Cell Wall', '(1,3)-β-glucan'],
      'Multi Site': ['Multi-site', 'Inorganic', 'Dithiocarbamate'],
      'Defense Inducers': ['Defense', 'Resistance inducer', 'Signal transduction'],
      'Other': []
    };
    
    const grouped = {};
    Object.keys(categories).forEach(cat => grouped[cat] = []);
    
    groups.forEach(g => {
      let found = false;
      for (const [cat, keywords] of Object.entries(categories)) {
        if (cat === 'Other') continue;
        if (keywords.some(kw => (g.name + ' ' + (g.moa || '')).includes(kw))) {
          grouped[cat].push(g);
          found = true;
          break;
        }
      }
      if (!found) grouped['Other'].push(g);
    });
    
    const cats = Object.keys(grouped).filter(c => grouped[c].length);
    
    return `<div class="ttl"><div><h1>${t('kn.disease.title')}</h1><div class="na">${t('kn.disease.sub')}</div></div></div>
    <div class="grid g3">${cats.map(cat => {
      const gs = grouped[cat];
      const diseases = uniq(gs.flatMap(g => D.diseases.filter(d => (d.eff || []).some(e => A.AI[e.a].groups.includes(g.id)))));
      return `<div class="card c" onclick="location.hash='knowledge/disease/${cat.replace(/\\s+/g, '-')}'">
        <h3>${E(cat)}</h3>
        <div class="na">${gs.length} ${t('count.groups')} · ${diseases.length} ${t('count.diseases')}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function diseaseCategoryGuide(category) {
    const sys = 'FRAC';
    const catMap = {
      'Respiration-Inhibitors': ['Respiration', 'Cytochrome', 'Complex'],
      'SDHI': ['SDHI', 'succinate'],
      'Sterol-Biosynthesis': ['Sterol', 'Azole', 'Morpholine'],
      'Cell-Wall': ['Cell Wall', '(1,3)-β-glucan'],
      'Multi-Site': ['Multi-site', 'Inorganic', 'Dithiocarbamate'],
      'Defense-Inducers': ['Defense', 'Resistance inducer']
    };
    
    const keywords = catMap[category] || [];
    const groups = D.groups.filter(g => g.system === sys && (keywords.length === 0 || keywords.some(kw => (g.name + ' ' + (g.moa || '')).includes(kw))));
    const diseases = uniq(groups.flatMap(g => D.diseases.filter(d => (d.eff || []).some(e => A.AI[e.a].groups.includes(g.id)))));
    
    const groupCards = groups.map(g => {
      const actives = (g.actives || []).map(id => A.AI[id]).filter(Boolean);
      const relDiseases = D.diseases.filter(d => (d.eff || []).some(e => A.AI[e.a].groups.includes(g.id)));
      return `<div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <h3>${E(g.code)} — ${E(g.name)}</h3>
          ${riskBd(g.risk)}
        </div>
        <dl class="kv" style="margin-top:8px;grid-template-columns:auto 1fr">
          <dt>${t('f.moa')}</dt><dd>${E(g.moa)}</dd>
          <dt>${t('f.mobility')}</dt><dd>${E(g.mobility || '—')}</dd>
          <dt>${t('f.actives')}</dt><dd>${actives.length ? actives.map(a => aiLink(a.id, 'dis')).join(', ') : '—'}</dd>
        </dl>
        ${relDiseases.length ? `<p style="margin:8px 0 0;font-size:12px"><b>${t('rel.dis.eff')}:</b> ${relDiseases.slice(0, 3).map(d => `<a class="lnk" href="#dis/disease/${d.id}">${E(d.name)}</a>`).join(', ')}</p>` : ''}
      </div>`;
    }).join('');
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/disease">${t('kn.disease.title')}</a></div>
    <h1>${E(category.replace(/-/g, ' '))}</h1><div class="na">${groups.length} ${t('count.groups')} · ${diseases.length} ${t('count.diseases')}</div></div></div>
    ${groupCards}
    ${diseases.length ? `<div class="h2">${t('count.diseases')}</div>${list(diseases.slice(0, 20), d => row('#dis/disease/' + d.id, `<b>${E(d.name)}</b>`, E(t('cat.' + d.category)), (d.eff || []).length ? `<span class="bd">${d.eff.length} ${t('eff.actives')}</span>` : ''))}` : ''}`;
  }

  /* ========== WEED KNOWLEDGE ========== */
  function weedKnowledge() {
    const sys = 'HRAC';
    const groups = D.groups.filter(g => g.system === sys);
    
    const cats = uniq(groups.map(g => g.category).filter(Boolean));
    const grouped = {};
    cats.forEach(cat => grouped[cat] = groups.filter(g => g.category === cat));
    
    return `<div class="ttl"><div><h1>${t('kn.weed.title')}</h1><div class="na">${t('kn.weed.sub')}</div></div></div>
    <div class="grid g3">${Object.entries(grouped).map(([cat, gs]) => {
      const crops = uniq(D.options.filter(o => o.hrac.some(h => gs.map(g => g.id).includes(h))).map(o => o.crop));
      const weeds = uniq(D.options.filter(o => o.hrac.some(h => gs.map(g => g.id).includes(h))).flatMap(o => o.weeds || []));
      return `<div class="card c" onclick="location.hash='knowledge/weed/${encodeURIComponent(cat)}'">
        <h3>${E(cat)}</h3>
        <div class="na">${gs.length} ${t('count.groups')} · ${crops.length} crops · ${weeds.length} weeds</div>
      </div>`;
    }).join('')}</div>`;
  }

  function weedCategoryGuide(category) {
    const sys = 'HRAC';
    const groups = D.groups.filter(g => g.system === sys && g.category === category);
    const options = D.options.filter(o => o.hrac.some(h => groups.map(g => g.id).includes(h)));
    const crops = uniq(options.map(o => o.crop));
    const weeds = uniq(options.flatMap(o => o.weeds || []));
    
    const groupCards = groups.map(g => {
      const actives = (g.actives || []).map(id => A.AI[id]).filter(Boolean);
      const relWeeds = uniq(D.options.filter(o => o.hrac.includes(g.id)).flatMap(o => o.weeds || []));
      return `<div class="card" style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <h3>${E(g.code)} — ${E(g.name)}</h3>
          ${riskBd(g.risk)}
        </div>
        <dl class="kv" style="margin-top:8px;grid-template-columns:auto 1fr">
          <dt>${t('f.moa')}</dt><dd>${E(g.moa)}</dd>
          <dt>${t('f.mobility')}</dt><dd>${E(g.mobility || '—')}</dd>
          <dt>${t('f.actives')}</dt><dd>${actives.length ? actives.map(a => aiLink(a.id, 'weed')).join(', ') : '—'}</dd>
        </dl>
        ${relWeeds.length ? `<p style="margin:8px 0 0;font-size:12px"><b>${t('rel.weeds')}:</b> ${relWeeds.slice(0, 3).map(w => `<a class="lnk" href="#weed/weed/${w}">${E(A.WD[w].name)}</a>`).join(', ')}</p>` : ''}
      </div>`;
    }).join('');
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/weed">${t('kn.weed.title')}</a></div>
    <h1>${E(category)}</h1><div class="na">${groups.length} ${t('count.groups')} · ${crops.length} crops · ${weeds.length} weeds</div></div></div>
    ${groupCards}
    ${crops.length ? `<div class="h2">${t('rel.crops')}</div>${list(crops.map(k => A.CR[k]).filter(Boolean), c => row('#weed/crop/' + c.key, `<b>${E(tr(c.name, c.name_ar))}</b>`, E(c.group), ''))}` : ''}
    ${weeds.length ? `<div class="h2">${t('rel.weeds')}</div>${list(weeds.slice(0, 20).map(id => A.WD[id]).filter(Boolean), w => row('#weed/weed/' + w.id, `<b>${E(w.name)}</b>`, E(w.family || ''), E(w.life_cycle || '')))}` : ''}`;
  }

  /* ========== ACTIVE INGREDIENT ENCYCLOPEDIA ========== */
  function activeEncyclopedia() {
    const actives = D.actives;
    const systems = uniq(actives.flatMap(a => a.systems || []));
    
    const grouped = {};
    systems.forEach(sys => grouped[sys] = actives.filter(a => (a.systems || []).includes(sys)));
    
    return `<div class="ttl"><div><h1>${t('kn.ai.title')}</h1><div class="na">${t('kn.ai.sub')}</div></div></div>
    <div class="grid g3">${systems.map(sys => {
      const as = grouped[sys];
      return `<div class="card c" onclick="location.hash='knowledge/ai/${sys}'">
        <h3>${E(sys)} Active Ingredients</h3>
        <div class="na">${as.length} ingredients</div>
      </div>`;
    }).join('')}</div>`;
  }

  function activeSystemGuide(system) {
    const actives = D.actives.filter(a => (a.systems || []).includes(system));
    const grouped = {};
    actives.forEach(a => {
      const f = a.family ? (Array.isArray(a.family) ? a.family[0] : a.family) : 'Other';
      if (!grouped[f]) grouped[f] = [];
      grouped[f].push(a);
    });
    
    const families = Object.keys(grouped).sort();
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/ai">${t('kn.ai.title')}</a></div>
    <h1>${E(system)} Active Ingredients</h1><div class="na">${actives.length} ingredients</div></div></div>
    ${families.map(fam => `<div class="h2">${E(fam)}</div>` + 
      list(grouped[fam], a => {
        const gs = A.gobj(a, system);
        return row('#' + (system === 'IRAC' ? 'ins' : system === 'FRAC' ? 'dis' : 'weed') + '/ai/' + a.id, 
          `<b>${E(a.name)}</b>`, 
          gs.map(bdg).join(''), 
          `<small>${E(uniq(gs.map(g => g.moa)).join('; ').slice(0, 50))}</small>`);
      })).join('')}`;
  }

  /* ========== MOVEMENT GUIDE ========== */
  function movementGuide() {
    const mobilities = uniq(D.groups.flatMap(g => g.mobility ? [g.mobility] : []));
    const mobDefs = {
      'Contact': 'Remains on leaf surface; no translocation',
      'Systemic': 'Absorbed and transported throughout plant via xylem and phloem',
      'Translaminar': 'Penetrates leaf and redistributes within the same leaf',
      'Xylem Mobile': 'Transported upward in xylem vessels',
      'Xylem + Phloem': 'Bi-directional transport in vascular system'
    };
    
    return `<div class="ttl"><div><h1>${t('kn.movement.title')}</h1><div class="na">${t('kn.movement.sub')}</div></div></div>
    <div class="grid g2">${mobilities.map(mob => {
      const gs = D.groups.filter(g => g.mobility === mob);
      const actives = uniq(gs.flatMap(g => g.actives || []));
      return `<div class="card c" onclick="location.hash='knowledge/movement/${encodeURIComponent(mob)}'">
        <h3>${E(mob)}</h3>
        <p class="na">${E(mobDefs[mob] || '')}</p>
        <div class="na">${gs.length} groups · ${actives.length} actives</div>
      </div>`;
    }).join('')}</div>`;
  }

  function movementDetail(mobility) {
    const groups = D.groups.filter(g => g.mobility === mobility);
    const actives = uniq(groups.flatMap(g => g.actives || [])).map(id => A.AI[id]).filter(Boolean);
    const systems = uniq(groups.map(g => g.system));
    
    const mobDefs = {
      'Contact': ['Remains on leaf surface', 'No translocation within the plant', 'Effective on external pests and diseases', 'Rain-fast after initial drying', 'Reapplication may be needed for new growth'],
      'Systemic': ['Absorbed by leaves or roots', 'Distributed throughout the plant', 'Protects internal tissues', 'Long-lasting protection', 'Effective against internal feeders'],
      'Translaminar': ['Penetrates the leaf layer', 'Redistributes within the same leaf', 'Protects both leaf surfaces', 'Good for leaf-mining insects', 'Effective against surface-feeding mites'],
      'Xylem Mobile': ['Transported upward in xylem', 'Protects aerial parts and new growth', 'Cannot move downward to roots', 'Effective for sucking insects', 'Early season application recommended'],
      'Xylem + Phloem': ['Moves in both directions', 'Protects entire plant including roots', 'Longest residual activity', 'Best for overall plant protection', 'Most versatile movement pattern']
    };
    
    const benefits = mobDefs[mobility] || [];
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/movement">${t('kn.movement.title')}</a></div>
    <h1>${E(mobility)}</h1><div class="na">${t('kn.movement.sub')}</div></div></div>
    <div class="card">
      <h3 style="margin-bottom:12px">${t('f.description')}</h3>
      <ul>${benefits.map(b => `<li>${E(b)}</li>`).join('')}</ul>
    </div>
    <div class="h2">${t('count.groups')}</div>
    ${list(groups, g => row(A.gHash(g), bdg(g) + ' <b>' + E(g.name) + '</b>', E(g.moa), riskBd(g.risk)))}
    <div class="h2">${t('count.actives')}</div>
    ${list(actives, a => row('#' + (A.MODOF[(a.systems || [HRAC])[0]]) + '/ai/' + a.id, `<b>${E(a.name)}</b>`, systems.join(' / '), `<small>${E(uniq(A.gobj(a, systems[0]).map(g => g.moa)).join('; ').slice(0, 60))}</small>`))}`;
  }

  /* ========== TARGET SITE GUIDE ========== */
  function targetSiteGuide() {
    const groups = D.groups;
    const targets = uniq(groups.map(g => g.target).filter(Boolean));
    const grouped = {};
    targets.forEach(t => grouped[t] = groups.filter(g => g.target === t));
    
    return `<div class="ttl"><div><h1>${t('kn.target.title')}</h1><div class="na">${t('kn.target.sub')}</div></div></div>
    <div class="grid g2">${targets.slice(0, 12).map(target => {
      const gs = grouped[target];
      const systems = uniq(gs.map(g => g.system));
      return `<div class="card c" onclick="location.hash='knowledge/target/${encodeURIComponent(target)}'">
        <h3>${E(target)}</h3>
        <div class="na">${gs.length} groups · ${systems.join(', ')}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function targetDetail(target) {
    const groups = D.groups.filter(g => g.target === target);
    const systems = uniq(groups.map(g => g.system));
    
    const targetDefs = {
      'Nicotinic acetylcholine receptors': 'Controls nervous system signals in insects; neonicotinoids bind here',
      'GABA-chloride channel': 'Blocks inhibitory nerve signals; causes hyperexcitation',
      'Ryanodine receptors': 'Controls muscle contraction; leads to paralysis',
      'Juvenile hormone': 'Disrupts insect growth and development',
      'Chitin synthesis': 'Prevents formation of insect exoskeleton',
      'Complex III': 'Inhibits cellular energy (respiration) production',
      'Complex II': 'SDHI - disrupts succinate dehydrogenase in mitochondria',
      'Sterol synthesis': 'Disrupts cell membrane formation in fungi',
      'β-glucan synthesis': 'Interferes with fungal cell wall structure',
      'Cytochrome P450': 'Prevents fungal detoxification processes'
    };
    
    const description = targetDefs[target] || '';
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/target">${t('kn.target.title')}</a></div>
    <h1>${E(target)}</h1></div></div>
    ${description ? `<div class="card">
      <h3 style="margin-bottom:12px">${t('f.description')}</h3>
      <p>${E(description)}</p>
    </div>` : ''}
    ${systems.map(sys => `<div class="h2">${E(sys)} Groups</div>` + 
      list(groups.filter(g => g.system === sys), g => row(A.gHash(g), 
        bdg(g) + ' <b>' + E(g.name) + '</b>', 
        E(g.moa), 
        riskBd(g.risk) + ((g.actives || []).length ? `<small>${g.actives.length} ${t('count.actives')}</small>` : '')))).join('')}`;
  }

  /* ========== RESISTANCE CENTER ========== */
  function resistanceCenter() {
    const systems = ['IRAC', 'FRAC', 'HRAC'];
    
    return `<div class="ttl"><div><h1>${t('kn.resist.title')}</h1><div class="na">${t('kn.resist.sub')}</div></div></div>
    <div class="grid g3">${systems.map(sys => {
      const groups = D.groups.filter(g => g.system === sys && g.risk);
      const highRisk = groups.filter(g => /High/.test(g.risk));
      return `<div class="card c" onclick="location.hash='knowledge/resist/${sys}'">
        <h3>${E(sys)} Resistance</h3>
        <div class="na">${highRisk.length} high-risk groups · ${groups.length} at-risk groups</div>
      </div>`;
    }).join('')}</div>`;
  }

  function resistanceSystemAnalysis(system) {
    const groups = D.groups.filter(g => g.system === system && g.risk);
    const byRisk = { 'High': [], 'Medium–High': [], 'Medium': [], 'Low–Medium': [], 'Low': [] };
    groups.forEach(g => {
      if (g.risk && byRisk[g.risk]) byRisk[g.risk].push(g);
    });
    
    const practices = D.principles[system] || {};
    
    return `<div class="ttl"><div><div class="crumb"><a href="#home">${t('nav.home')}</a> › <a href="#knowledge/resist">${t('kn.resist.title')}</a></div>
    <h1>${E(system)} Resistance Analysis</h1></div></div>
    ${practices.practice ? `<div class="card">
      <h3>${t('res.rotation')}</h3>
      <ul>${(practices.practice || []).map(p => `<li>${E(p)}</li>`).join('')}</ul>
    </div>` : ''}
    ${practices.why ? `<div class="card">
      <h3>${t('res.risks')}</h3>
      <ul>${(practices.why || []).map(p => `<li>${E(p)}</li>`).join('')}</ul>
    </div>` : ''}
    ${Object.entries(byRisk).filter(([r, gs]) => gs.length).map(([risk, gs]) => `<div class="h2">${riskBd(risk)}</div>` + 
      list(gs, g => row(A.gHash(g), bdg(g) + ' <b>' + E(g.name) + '</b>', E(g.moa), (g.actives || []).length ? `<span class="bd">${g.actives.length} ${t('count.actives')}</span>` : ''))).join('')}`;
  }

  /* ========== KNOWLEDGE HOME ========== */
  function knowledgeHome() {
    return `<div class="ttl"><div><h1>${t('kn.title')}</h1><div class="na">${t('kn.sub')}</div></div></div>
    <div class="grid g3">
      <div class="card c" onclick="location.hash='knowledge/insect'">
        <div class="thumb th-ins"></div>
        <h3>${t('kn.insect.title')}</h3>
        <p class="na">${t('kn.insect.sub')}</p>
        <div class="na">${D.pests.length} pests · ${D.groups.filter(g => g.system === 'IRAC').length} groups</div>
      </div>
      <div class="card c" onclick="location.hash='knowledge/disease'">
        <div class="thumb th-dis"></div>
        <h3>${t('kn.disease.title')}</h3>
        <p class="na">${t('kn.disease.sub')}</p>
        <div class="na">${D.diseases.length} diseases · ${D.groups.filter(g => g.system === 'FRAC').length} groups</div>
      </div>
      <div class="card c" onclick="location.hash='knowledge/weed'">
        <div class="thumb th-weed"></div>
        <h3>${t('kn.weed.title')}</h3>
        <p class="na">${t('kn.weed.sub')}</p>
        <div class="na">${D.weeds.length} weeds · ${D.groups.filter(g => g.system === 'HRAC').length} groups</div>
      </div>
    </div>
    <div class="h2">${t('kn.tools')}</div>
    <div class="grid g3">
      <div class="card c" onclick="location.hash='knowledge/ai'">
        <h3>${t('kn.ai.title')}</h3>
        <p class="na">${t('kn.ai.sub')}</p>
        <div class="na">${D.actives.length} ingredients</div>
      </div>
      <div class="card c" onclick="location.hash='knowledge/movement'">
        <h3>${t('kn.movement.title')}</h3>
        <p class="na">${t('kn.movement.sub')}</p>
        <div class="na">${uniq(D.groups.flatMap(g => g.mobility ? [g.mobility] : [])).length} mobility classes</div>
      </div>
      <div class="card c" onclick="location.hash='knowledge/target'">
        <h3>${t('kn.target.title')}</h3>
        <p class="na">${t('kn.target.sub')}</p>
        <div class="na">${uniq(D.groups.map(g => g.target).filter(Boolean)).length} target sites</div>
      </div>
      <div class="card c" onclick="location.hash='knowledge/resist'">
        <h3>${t('kn.resist.title')}</h3>
        <p class="na">${t('kn.resist.sub')}</p>
        <div class="na">3 systems analyzed</div>
      </div>
    </div>`;
  }

  /* ========== ROUTER ========== */
  function route(section, subsection, detail) {
    try {
      if (!section) return knowledgeHome();
      if (section === 'insect') {
        if (!subsection) return insectKnowledge();
        if (subsection === 'order') return orderGuide(detail);
        return insectClassGuide(subsection);
      }
      if (section === 'disease') {
        if (!subsection) return diseaseKnowledge();
        return diseaseCategoryGuide(subsection);
      }
      if (section === 'weed') {
        if (!subsection) return weedKnowledge();
        return weedCategoryGuide(subsection);
      }
      if (section === 'ai') {
        if (!subsection) return activeEncyclopedia();
        return activeSystemGuide(subsection);
      }
      if (section === 'movement') {
        if (!subsection) return movementGuide();
        return movementDetail(subsection);
      }
      if (section === 'target') {
        if (!subsection) return targetSiteGuide();
        return targetDetail(subsection);
      }
      if (section === 'resist') {
        if (!subsection) return resistanceCenter();
        return resistanceSystemAnalysis(subsection);
      }
      return knowledgeHome();
    } catch (e) {
      console.error('Knowledge route error:', e);
      return `<div class="card">Error: ${E(e.message)}</div>`;
    }
  }

  return { route };
})();
