/* ---------- Tabs ---------- */
	const tabSessions = document.getElementById('tabSessions');
	const tabChats = document.getElementById('tabChats');
	const viewSessions = document.getElementById('view-sessions');
	const viewChats = document.getElementById('view-chats');
	const tabKills = document.getElementById('tabKills');
	const viewKills = document.getElementById('view-kills');
	const tabStats = document.getElementById('tabStats');
	const viewStats = document.getElementById('view-stats');

	function showTab(which){
	  if (which === 'sessions'){
		viewSessions.hidden = false; viewChats.hidden = true; viewKills.hidden = true; viewStats.hidden = true;
		tabSessions.classList.add('active');  tabSessions.setAttribute('aria-selected','true');
		tabChats.classList.remove('active');   tabChats.setAttribute('aria-selected','false');
		tabKills.classList.remove('active');   tabKills.setAttribute('aria-selected','false');
		tabStats.classList.remove('active');   tabStats.setAttribute('aria-selected','false');
	  } else if (which === 'kills'){
		viewSessions.hidden = true; viewChats.hidden = true; viewKills.hidden = false; viewStats.hidden = true;
		tabSessions.classList.remove('active'); tabSessions.setAttribute('aria-selected','false');
		tabChats.classList.remove('active');    tabChats.setAttribute('aria-selected','false');
		tabKills.classList.add('active');       tabKills.setAttribute('aria-selected','true');
		tabStats.classList.remove('active');    tabStats.setAttribute('aria-selected','false');
	  } else if (which === 'stats'){
		viewSessions.hidden = true; viewChats.hidden = true; viewKills.hidden = true; viewStats.hidden = false;
		tabSessions.classList.remove('active'); tabSessions.setAttribute('aria-selected','false');
		tabChats.classList.remove('active');    tabChats.setAttribute('aria-selected','false');
		tabKills.classList.remove('active');    tabKills.setAttribute('aria-selected','false');
		tabStats.classList.add('active');       tabStats.setAttribute('aria-selected','true');
	  } else {
		viewSessions.hidden = true; viewChats.hidden = false; viewKills.hidden = true; viewStats.hidden = true;
		tabSessions.classList.remove('active'); tabSessions.setAttribute('aria-selected','false');
		tabChats.classList.add('active');       tabChats.setAttribute('aria-selected','true');
		tabKills.classList.remove('active');    tabKills.setAttribute('aria-selected','false');
		tabStats.classList.remove('active');    tabStats.setAttribute('aria-selected','false');
	  }
	}
	tabSessions.addEventListener('click', () => showTab('sessions'));
	tabChats.addEventListener('click', () => showTab('chats'));
	tabKills.addEventListener('click', () => showTab('kills'));
	tabStats.addEventListener('click', () => showTab('stats'));



    /* ---------- Elements: Chat ---------- */
    const table = document.getElementById('table');
    const tbody = table.querySelector('tbody');
    const q = document.getElementById('q');
    const countEl = document.getElementById('count');
    const statusEl = document.getElementById('status');
    const ariaLive = document.getElementById('aria-live');
    const pageSizeSel = document.getElementById('pageSize');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    /* ---------- Elements: Sessions ---------- */
    const sessTable = document.getElementById('sessTable');
    const sessTbody = sessTable.querySelector('tbody');
    const sessQ = document.getElementById('sessQ');
    const sessCountEl = document.getElementById('sessCount');
    const sessStatusEl = document.getElementById('sessStatus');
    const sessAriaLive = document.getElementById('sess-aria-live');
    const sessPageSizeSel = document.getElementById('sessPageSize');
    const sessPrevBtn = document.getElementById('sessPrevPage');
    const sessNextBtn = document.getElementById('sessNextPage');
    const sessPageInfo = document.getElementById('sessPageInfo');
	const sessResolveBtn = document.getElementById('sessResolve');
	const geoStatusEl    = document.getElementById('geoStatus');

	/* ---------- Elements: Kills ---------- */
	const killsTable = document.getElementById('killsTable');
	const killsTbody = killsTable.querySelector('tbody');
	const kQ = document.getElementById('kQ');
	const kCountEl = document.getElementById('kCount');
	const kStatusEl = document.getElementById('kStatus');
	const kAriaLive = document.getElementById('k-aria-live');
	const kPageSizeSel = document.getElementById('kPageSize');
	const kPrevBtn = document.getElementById('kPrevPage');
	const kNextBtn = document.getElementById('kNextPage');
	const kPageInfo = document.getElementById('kPageInfo');

	/* ---------- Elements: Statistics ---------- */
	const statsTable = document.getElementById('statsTable');
	const statsTbody = statsTable.querySelector('tbody');

	const stQ = document.getElementById('stQ');
	const stCountEl = document.getElementById('stCount');
	const stStatusEl = document.getElementById('stStatus');
	const stAriaLive = document.getElementById('st-aria-live');
	const stPageSizeSel = document.getElementById('stPageSize');
	const stPrevBtn = document.getElementById('stPrevPage');
	const stNextBtn = document.getElementById('stNextPage');
	const stPageInfo = document.getElementById('stPageInfo');


	// Range-knoppen (Statistics)
	let stRange = 'all'; // '1' | '7' | '30' | 'all'
	const stRangeBtns = document.querySelectorAll('#view-stats .seg .seg-btn');
	stRangeBtns.forEach(btn => {
	  btn.addEventListener('click', () => {
		stRange = btn.dataset.range || 'all';
		stRangeBtns.forEach(b => b.classList.toggle('active', b === btn));
		rebuildStatsFromRange(); // herbereken statistieken op basis van range
	  });
	});

	function stRangeLabel(r){
	  if (r==='1') return 'Last day';
	  if (r==='7') return 'Last 7 days';
	  if (r==='30') return 'Last 30 days';
	  return 'All time';
	}

	function getKillsForStats(range){
	  if (range==='all') return killsRows;
	  const days = parseInt(range,10) || 0;
	  const now = Date.now();
	  const threshold = now - days * 24 * 60 * 60 * 1000;
	  return killsRows.filter(k => (toTime(k.Time) || 0) >= threshold);
	}

	// Herbereken + UI bijwerken
	function rebuildStatsFromRange(){
	  const src = getKillsForStats(stRange);
	  stRows = buildStatsFromKills(src);
	  stStatusEl.textContent = `Computed from ${src.length} kills • ${stRows.length} players • ${stRangeLabel(stRange)}`;
	  stApplyFilter();
	  stAriaLive.textContent = `Statistics refreshed (${stRangeLabel(stRange)})`;
	}




	/* ---------- State: Statistics ---------- */
	let stRows = [];
	let stFiltered = [];
	let stSortKey = 'KDR';
	let stSortDir = 'desc';
	let stPageSize = 250;
	let stCurrentPage = 1;



    /* ---------- Global header actions ---------- */
    const globalSelectBtn = document.getElementById('globalSelectBtn');
    const globalFileInput = document.getElementById('globalFile');
    const globalDlBtn = document.getElementById('globalDl');

    /* ---------- State: Chat ---------- */
    let rows = [];
    let filtered = [];
    let sortKey = null;
    let sortDir = 'desc';
    let pageSize = 250;
    let currentPage = 1;
    const loadedIds = new Set();
    const fileList = [];

    /* ---------- State: Sessions ---------- */
    let sessRows = [];
    let sessFiltered = [];
    let sessSortKey = null;
    let sessSortDir = 'desc';
    let sessPageSize = 250;
    let sessCurrentPage = 1;
	let ipDB = [];        // array van [startInt, endInt, countryCode, countryName]
	let hasIpDB = false;
	const countryCache = new Map(); // ip -> {code, name}


    const sessLoadedIds = new Set();
    const sessFileList = [];

	/* ---------- State: Kills ---------- */
	let killsRows = [];
	let killsFiltered = [];
	let kSortKey = null;
	let kSortDir = 'desc';
	let kPageSize = 250;
	let kCurrentPage = 1;
	const kLoadedIds = new Set();
	const kFileList = [];

	// Reset alle Kills-filters + sortering + paginering
function resetKillFilters(){
  // global search leegmaken
  if (kQ) kQ.value = '';

  // kolomfilters leegmaken (UI + state)
  const inputs = killsTable.querySelectorAll('thead tr.colfilters input.col-filter');
  inputs.forEach(inp => { inp.value = ''; });
  KILL_COLS.forEach(k => { killColFilters[k] = ''; });

  // sort & page terugzetten
  kSortKey = 'Time';
  kSortDir = 'desc';
  kCurrentPage = 1;
  // (paginagrootte laten we staan; wil je ’m forceren:)
  // kPageSizeSel.value = '250'; kPageSize = 250;
}


	/* ----- Toegestane skins (allemaal lowercase) ----- */
	const ALLOWED_ALLIED_SKINS = new Set([
	  'allied_russian_recon_soldier',
	  'allied_russian_corporal',
	  'allied_russian_crazy_boris',
	  'allied_russian_recon_scout',
	  'allied_russian_seaman',
	  'allied_british_6th_airborne_captain',
	  'allied_british_6th_airborne_paratrooper',
	  'allied_british_tank_corporal',
	  'allied_sas',
	  'allied_101st_captain',
	  'allied_101st_infantry',
	  'allied_101st_scout',
	  'allied_501st_pir_scout',
	  'allied_501st_pir_soldier',
	  'allied_airborne',
	  'allied_technician',
	  'allied_pilot',
	  'american_ranger',
	  'american_army',
	  'allied_british_cmd',
	  'allied_british_tank',
	  'allied_us_mask',
	  'allied_us_tank',
	  'allied_wheathers',
	  'allied_manon',
	]);

	const ALLOWED_GERMAN_SKINS = new Set([
	  'german_panzer_corporal',
	  'german_afrika_officer',
	  'german_afrika_private',
	  'german_ardennes_artillery_commander',
	  'german_elite_officer',
	  'german_elite_sentry',
	  'german_worker',
	  'german_scientist',
	  'german_kradshutzen',
	  'german_dday_colonel',
	  'german_panzer_grenadier',
	  'german_panzer_obershutze',
	  'german_panzer_shutze',
	  'german_panzer_tankcommander',
	  'german_stukageschwader',
	  'german_waffenss_officer',
	  'german_waffenss_shutze',
	  'german_wehrmacht_officer',
	  'german_wehrmacht_soldier',
	  'german_winter_1',
	  'german_winter_2',
	  'it_ax_ital_vol',
	  'sc_ax_ital_inf',
	  'sc_ax_ital_inf2',
	  'sc_ax_ital_para',
	]);

	function normalizeSkinName(s){
	  return String(s||'').trim().toLowerCase();
	}
	function isAllowedSkin(team, name){
	  const n = normalizeSkinName(name);
	  if (!n) return true;               // leeg laten we neutraal
	  if (team === 'allied') return ALLOWED_ALLIED_SKINS.has(n);
	  if (team === 'german') return ALLOWED_GERMAN_SKINS.has(n);
	  return true;
	}



	/* ---------- Bootstrap (downloaded interactive) ---------- */
	function hydrateFromBootstrap(){
	  // Chat
	  try {
		const boot = document.getElementById('bootstrap');
		const bootState = document.getElementById('bootstrapState');
		if (boot && !rows.length){
		  rows = JSON.parse(boot.textContent || '[]');
		  const st = bootState ? JSON.parse(bootState.textContent || '{}') : {};
		  if (st.filterTerm != null) q.value = st.filterTerm;
		  if (st.sortKey)  sortKey = st.sortKey;
		  if (st.sortDir)  sortDir = st.sortDir;
		  if (st.pageSize){ pageSize = +st.pageSize; pageSizeSel.value = String(pageSize); }
		  if (st.currentPage != null) currentPage = +st.currentPage;
		  statusEl.textContent = `Embedded dataset • ${rows.length} rows`;
		  applyFilter(); // zorgt dat filtered + render correct zijn
		}
	  } catch(e){ console.error('Chat bootstrap failed:', e); }

	  // Sessions
	  try {
		const bootSess = document.getElementById('bootstrapSess');
		const bootSessState = document.getElementById('bootstrapSessState');
		if (bootSess && !sessRows.length){
		  sessRows = JSON.parse(bootSess.textContent || '[]');
		  const st = bootSessState ? JSON.parse(bootSessState.textContent || '{}') : {};
		  if (st.filterTerm != null) sessQ.value = st.filterTerm;
		  if (st.sortKey)  sessSortKey = st.sortKey;
		  if (st.sortDir)  sessSortDir = st.sortDir;
		  if (st.pageSize){ sessPageSize = +st.pageSize; sessPageSizeSel.value = String(sessPageSize); }
		  if (st.currentPage != null) sessCurrentPage = +st.currentPage;
		  sessStatusEl.textContent = `Embedded dataset • ${sessRows.length} rows`;
		  sessApplyFilter();
		}
	  } catch(e){ console.error('Sessions bootstrap failed:', e); }
	  
	  // Kills
		try {
		  const bootKills = document.getElementById('bootstrapKills');
		  const bootKillsState = document.getElementById('bootstrapKillsState');
		  if (bootKills && !killsRows.length){
			killsRows = JSON.parse(bootKills.textContent || '[]');
			const st = bootKillsState ? JSON.parse(bootKillsState.textContent || '{}') : {};
			if (st.filterTerm != null) kQ.value = st.filterTerm;
			if (st.sortKey)  kSortKey = st.sortKey;
			if (st.sortDir)  kSortDir = st.sortDir;
			if (st.pageSize){ kPageSize = +st.pageSize; kPageSizeSel.value = String(kPageSize); }
			if (st.currentPage != null) kCurrentPage = +st.currentPage;
			kStatusEl.textContent = `Embedded dataset • ${killsRows.length} rows`;
			kApplyFilter();
		  }
		} catch(e){ console.error('Kills bootstrap failed:', e); }

		// Statistics (option 1: hydrate vanuit embedded JSON)
		try {
		  const bootStats = document.getElementById('bootstrapStats');
		  const bootStatsState = document.getElementById('bootstrapStatsState');
			if (bootStats && !stRows.length){
			  stRows = JSON.parse(bootStats.textContent || '[]');
			  const st = bootStatsState ? JSON.parse(bootStatsState.textContent || '{}') : {};
			  if (st.filterTerm != null) stQ.value = st.filterTerm;
			  if (st.sortKey)  stSortKey = st.sortKey;
			  if (st.sortDir)  stSortDir = st.sortDir;
			  if (st.pageSize){ stPageSize = +st.pageSize; stPageSizeSel.value = String(stPageSize); }
			  if (st.currentPage != null) stCurrentPage = +st.currentPage;
			  if (st.range) {
				stRange = st.range;
				stRangeBtns.forEach(b => b.classList.toggle('active', (b.dataset.range||'all')===stRange));
			  }
			  stStatusEl.textContent = `Embedded statistics • ${stRows.length} players • ${stRangeLabel(stRange)}`;
			  stApplyFilter();
			}
		}catch(e){ console.error('Stats bootstrap failed:', e); }

		// Statistics (option 2 fallback): als er kills zijn maar geen embedded stats, bereken ze
		if (!stRows.length && killsRows.length){
		  const src = getKillsForStats(stRange);
		  stRows = buildStatsFromKills(src);
		  stStatusEl.textContent = `Computed from ${src.length} kills • ${stRows.length} players • ${stRangeLabel(stRange)}`;
		  stApplyFilter();
		}


	  
	}

// 1) Probeer direct (werkt als de JSON-blokken al vóór dit script staan)
hydrateFromBootstrap();
// 2) En nogmaals na DOM is klaar (werkt voor de gedownloade export,
//    waarin de JSON-blokken vlak voor </body> worden ingevoegd)
document.addEventListener('DOMContentLoaded', hydrateFromBootstrap);

    /* ---------- Global file select (routes files to correct tab) ---------- */
// ---------- Global file select (routes files to correct tab) ----------
globalSelectBtn.addEventListener('click', () => globalFileInput.click());

globalFileInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  let chatAdded=0, chatSkipped=0, chatNewRows=0;
  let sessAdded=0, sessSkipped=0, sessNewRows=0;
  let kAdded=0, kSkipped=0, kNewRows=0;

  for (const file of files){
    const id = `${file.name}|${file.size}|${file.lastModified}`;
    const rawText = await readFileSmart(file);
    const target = classifyFile(file.name, rawText); // 'chat' | 'sessions' | 'ipdb'

    // ====== IP-DB inladen ======
    if (target === 'ipdb'){
      ipDB = parseIpDbText(rawText);
      hasIpDB = ipDB.length > 0;

      // statusbadge bijwerken
      const ipBadge = document.getElementById('ipdbStatus');
      if (ipBadge) {
        ipBadge.textContent = hasIpDB
          ? `IP DB: ${ipDB.length.toLocaleString()} ranges`
          : 'IP DB: not loaded';
      }

      // bestaande sessies verrijken met land
      for (const r of sessRows){ r.IP = stripPort(r.IP); }
      enrichCountriesInSessions();
      sessApplyFilter();
      continue;
    }

    // ====== Sessions-bestanden ======
    if (target === 'sessions'){
      if (sessLoadedIds.has(id)) { sessSkipped++; continue; }

      const got = parseSessionsText(rawText).map(sessNormalize);

      // 1) Online cache toepassen (als er al iets is opgehaald)
      const _cache = (window.countryCache || new Map());
      for (const r of got){
        const info = _cache.get(stripPort(r.IP));
        if (info){
          r.Country     = info.code || '';
          r.CountryName = info.name || '';
        }
      }

      // 2) Offline IP-DB (als aanwezig) alleen als Country nog leeg is
      if (hasIpDB){
        for (const r of got){
          if (!r.Country){
            const info = lookupCountryByIP(r.IP);
            r.Country     = info ? info.code : '';
            r.CountryName = info ? info.name : '';
          }
        }
      }

      sessRows = sessRows.concat(got);
      sessNewRows += got.length;
      sessAdded++;
      sessLoadedIds.add(id);
      sessFileList.push({name:file.name,size:file.size,count:got.length});
      continue;
    }

	// ====== Kills-bestanden ======
	if (target === 'kills'){
	  if (kLoadedIds.has(id)) { kSkipped++; continue; }
	  const got = parseKillsText(rawText);
	  killsRows = killsRows.concat(got);
	  kNewRows += got.length;
	  kAdded++;
	  kLoadedIds.add(id);
	  kFileList.push({name:file.name,size:file.size,count:got.length});
	  continue;
	}


    // ====== Chat-bestanden ======
    if (loadedIds.has(id)) { chatSkipped++; continue; }
    const parsed = parseSmart(rawText);
    const normalized = normalizeColumns(parsed.data)
      .filter(r => !String(r.Message||'').trim().startsWith('*'));
    rows = rows.concat(normalized);
    chatNewRows += normalized.length;
    chatAdded++;
    loadedIds.add(id);
    fileList.push({name:file.name,size:file.size});
  }

  // UI bijwerken
  statusEl.textContent = `${loadedIds.size} chat file(s) • +${chatAdded} added, ${chatSkipped} skipped • ${rows.length} rows total`;
  sessStatusEl.textContent = `${sessLoadedIds.size} session file(s) • +${sessAdded} added, ${sessSkipped} skipped • ${sessRows.length} rows total`;
	kStatusEl.textContent = `${kLoadedIds.size} kills file(s) • +${kAdded} added, ${kSkipped} skipped • ${killsRows.length} rows total`;
	if (kAdded || kNewRows) kApplyFilter();
	kAriaLive.textContent = `Kills: +${kAdded}/${kSkipped} skipped`;
	
	// Rebuild statistics from kills (respecteer huidige range)
	{
	  const src = getKillsForStats(stRange);
	  stRows = buildStatsFromKills(src);
	  stStatusEl.textContent = `Computed from ${src.length} kills • ${stRows.length} players • ${stRangeLabel(stRange)}`;
	  stApplyFilter();
	  stAriaLive.textContent = `Statistics updated from ${src.length} kills (${stRangeLabel(stRange)})`;
	}



  if (chatAdded || chatNewRows) applyFilter();
  if (sessAdded || sessNewRows) sessApplyFilter();

  ariaLive.textContent = `Chat: +${chatAdded}/${chatSkipped} skipped`;
  sessAriaLive.textContent = `Sessions: +${sessAdded}/${sessSkipped} skipped`;

  // reset input zodat dezelfde bestanden opnieuw gekozen kunnen worden
  globalFileInput.value = '';
});


	function classifyFile(name, text){
	  const n = (name||'').toLowerCase();

	  // Jouw vaste namen
	  if (n.includes('player_messages')) return 'chat';
	  if (n.includes('player_authentication')) return 'sessions';
	  if (n.includes('player_kills')) return 'kills';


	  // CSV’s of DB-bestanden via naam + header
	  if (/\.(csv|txt)$/i.test(n) || /\b(ip2location|ip-to-country|geolite|ipcountry|db1)\b/i.test(n)){
		const firstLine = (text.split(/\n/)[0] || '').toLowerCase();
		if (firstLine.includes('ip_from') && firstLine.includes('ip_to')) return 'ipdb';
		if (firstLine.includes('start') && firstLine.includes('end') && (firstLine.includes('country') || firstLine.includes('cc'))) return 'ipdb';

		// Heuristiek: eerste 5 regels checken op (num/num/CC) of (IPv4/IPv4/CC)
		const sample = text.replace(/\r/g,'').split('\n').filter(Boolean).slice(0,5);
		let hits = 0;
		for (const ln of sample){
		  const cells = splitBest(ln).map(s=>s.replace(/^"+|"+$/g,'').trim());
		  if (cells.length < 3) continue;
		  const a=cells[0], b=cells[1], cc=(cells[2]||'').toUpperCase();
		  const isNumPair = (/^\d+$/.test(a) && /^\d+$/.test(b));
		  const isIPv4Pair = (ipv4ToInt(a)!=null && ipv4ToInt(b)!=null);
		  const isCC = /^[A-Z]{2}$/.test(cc);
		  if ((isNumPair || isIPv4Pair) && isCC) hits++;
		}
		if (hits >= 3) return 'ipdb';
	  }
	  
	if (/\]\s*attacker name:/i.test(text) && /victim name:/i.test(text)) return 'kills';


	  // Fallback: inhoud zegt "Sessions"
	  return /\]\s*connected at\s*\|/i.test(text) ? 'sessions' : 'chat';
	}


	/* ===== Kolomfilters: helpers + state ===== */

	// Per-tab kolomnamen (exact zoals ze in je data/knoppen heten)
	const CHAT_COLS  = ['Message','Sender','Recipient','Scope','Date'];
	const SESS_COLS  = ['Name','IP','Country','Game Version','Allied model','German model','Rate','Snaps','Ping','Started on'];
	const KILL_COLS  = ['Attacker','Victim','Team','Weapon','MOD','Damage','Body Part','Time'];
	const STATS_COLS = ['Player','Kills','Deaths','Headshots','Killstreak','Deathstreak','Damage','KDR'];

	// Huidige filterwaarden (lowercased strings)
	const chatColFilters  = Object.fromEntries(CHAT_COLS.map(k=>[k,'']));
	const sessColFilters  = Object.fromEntries(SESS_COLS.map(k=>[k,'']));
	const killColFilters  = Object.fromEntries(KILL_COLS.map(k=>[k,'']));
	const statsColFilters = Object.fromEntries(STATS_COLS.map(k=>[k,'']));

	// Maak een tweede header-rij met inputjes
	function addFilterRow(tableEl, cols, onChange){
	  const thead = tableEl.querySelector('thead');
	  const tr = document.createElement('tr');
	  tr.className = 'colfilters';
	  cols.forEach(key => {
		const th = document.createElement('th');
		const inp = document.createElement('input');
		inp.className = 'col-filter';
		inp.placeholder = key;
		inp.setAttribute('aria-label', `Filter ${key}`);
		inp.addEventListener('input', onChange);
		// kleine UX: geen enter-submits
		inp.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); }});
		th.appendChild(inp);
		tr.appendChild(th);
	  });
	  thead.appendChild(tr);
	  // Retourneer NodeList voor uitlezen
	  return thead.querySelectorAll('tr.colfilters input.col-filter');
	}

	// Helpers: matchen met col-filters
	function includesLC(hay, needle){
	  return String(hay ?? '').toLowerCase().includes(String(needle ?? '').toLowerCase());
	}
	function rowMatchesColFilters(row, filters, cols, opts={}){
	  return cols.every(key => {
		const f = (filters[key] || '').trim();
		if (!f) return true;

		// Speciale gevallen
		if (opts.name === 'sessions' && key === 'Country'){
		  // Check zowel code als volledige naam
		  const combo = `${row['CountryName']||''} ${row['Country']||''}`;
		  return includesLC(combo, f);
		}
		if (opts.name === 'stats' && key === 'KDR'){
		  // Zowel label (bv "1.33") als numerieke KDR
		  const combo = `${row['KDRLabel']||''} ${row['KDR']||''}`;
		  return includesLC(combo, f);
		}

		// Default: substring match
		return includesLC(row[key], f);
	  });
	}

	// Setup per tabel (injecteer de rij en koppel events)
	function setupChatColumnFilters(){
	  const inputs = addFilterRow(table, CHAT_COLS, () => {
		CHAT_COLS.forEach((k,i)=> chatColFilters[k] = inputs[i].value);
		currentPage = 1;
		applyFilter();
	  });
	}
	function setupSessColumnFilters(){
	  const inputs = addFilterRow(sessTable, SESS_COLS, () => {
		SESS_COLS.forEach((k,i)=> sessColFilters[k] = inputs[i].value);
		sessCurrentPage = 1;
		sessApplyFilter();
	  });
	}
	function setupKillColumnFilters(){
	  const inputs = addFilterRow(killsTable, KILL_COLS, () => {
		KILL_COLS.forEach((k,i)=> killColFilters[k] = inputs[i].value);
		kCurrentPage = 1;
		kApplyFilter();
	  });
	}
	function setupStatsColumnFilters(){
	  const inputs = addFilterRow(statsTable, STATS_COLS, () => {
		STATS_COLS.forEach((k,i)=> statsColFilters[k] = inputs[i].value);
		stCurrentPage = 1;
		stApplyFilter();
	  });
	}

	// Init kolomfilters – nu alle consts en helpers bestaan
	setupChatColumnFilters();
	setupSessColumnFilters();
	setupKillColumnFilters();
	setupStatsColumnFilters();



    /* ---------- Chat: filter/sort/paging ---------- */
    q.addEventListener('input', () => { currentPage = 1; applyFilter(); });
    pageSizeSel.addEventListener('change', () => { pageSize = parseInt(pageSizeSel.value,10); currentPage = 1; render(); });
    prevBtn.addEventListener('click', () => { if (currentPage > 1){ currentPage--; render(); } });
    nextBtn.addEventListener('click', () => { const pages = Math.max(1, Math.ceil(filtered.length / pageSize)); if (currentPage < pages){ currentPage++; render(); } });
    document.querySelectorAll('.sort').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (sortKey === key){ sortDir = (sortDir === 'asc' ? 'desc' : 'asc'); }
        else { sortKey = key; sortDir = (key === 'Date' ? 'desc' : 'asc'); }
        document.querySelectorAll('.sort').forEach(b=>{ b.classList.toggle('active', b.dataset.key===sortKey); b.setAttribute('aria-sort', b.dataset.key===sortKey ? sortDir : 'none'); });
        render();
      });
    });

	function applyFilter(){
	  const term = q.value.trim().toLowerCase();
	  const headers = CHAT_COLS;
	  filtered = rows.filter(r => {
		const globalOk = !term || headers.some(k => String(r[k]||'').toLowerCase().includes(term));
		const colsOk   = rowMatchesColFilters(r, chatColFilters, headers, {name:'chat'});
		return globalOk && colsOk;
	  });
	  currentPage = 1;
	  render();
	}
    function render(){
      let data = filtered.slice();
      if (sortKey){ data.sort((a,b)=> cmp(a[sortKey], b[sortKey], sortKey)); if (sortDir==='desc') data.reverse(); }
      const pages = Math.max(1, Math.ceil(data.length / pageSize));
      if (currentPage > pages) currentPage = pages;
      const start = (currentPage - 1) * pageSize;
      const pageData = data.slice(start, start + pageSize);

      countEl.textContent = (data.length===rows.length) ? `${data.length} rows` : `${data.length} of ${rows.length} rows`;
      pageInfo.textContent = `Page ${pages === 0 ? 0 : currentPage}/${pages}`;

      if (!pageData.length){ tbody.innerHTML = `<tr><td colspan="5" class="empty">No results for the current filter.</td></tr>`; return; }

      const frag = document.createDocumentFragment();
      pageData.forEach(row => {
        const tr = document.createElement('tr');
        if (String(row.Recipient||'').trim() !== '') tr.classList.add('has-recipient');
        tr.innerHTML = `
          <td class="message"   title="${escapeHtml(row.Message||'')}">${escapeHtml(row.Message||'')}</td>
          <td class="sender"    title="${escapeHtml(row.Sender||'')}"><span class="name-chip">${escapeHtml(row.Sender||'')}</span></td>
          <td class="recipient" title="${escapeHtml(row.Recipient||'')}"><span class="name-chip">${escapeHtml(row.Recipient||'')}</span></td>
          <td class="scope"     title="${escapeHtml(row.Scope||'')}"></td>
          <td class="date"><span class="date-chip">${escapeHtml(row.Date||'')}</span></td>
        `;
        const scopeTd  = tr.querySelector('.scope');
        scopeTd.setAttribute('data-scope', row.Scope || '');
        if ((row.Scope||'').trim()){
          scopeTd.innerHTML = `<span class="scope-badge">${escapeHtml(row.Scope)}</span>`;
        }
        frag.appendChild(tr);
      });
      tbody.innerHTML = '';
      tbody.appendChild(frag);
    }

    function cmp(a,b,key){
      if (key === 'Date'){ const ta = toTime(a), tb = toTime(b); return (ta||0) - (tb||0); }
      const sa = String(a||'').toLowerCase(), sb = String(b||'').toLowerCase();
      return sa.localeCompare(sb, 'en', {sensitivity:'base'});
    }

	// vlag
	function codeToFlagEmoji(code){
	  if (!code || code.length!==2) return '';
	  const base = 127397;
	  const A = code.toUpperCase().charCodeAt(0), B = code.toUpperCase().charCodeAt(1);
	  if (A<65||A>90||B<65||B>90) return '';
	  return String.fromCodePoint(base+A, base+B);
	}

	// Maak Twemoji SVG-pad voor 2-letter landcode (bv. 'NL' -> '1f1f3-1f1f1')
	function twemojiFlagUrl(cc){
	  cc = String(cc || '').toUpperCase();
	  if (cc.length !== 2) return null;
	  const base = 0x1F1E6; // 'A'
	  const a = base + (cc.charCodeAt(0) - 65);
	  const b = base + (cc.charCodeAt(1) - 65);
	  const hex = a.toString(16) + '-' + b.toString(16);
	  // Betrouwbare CDN:
	  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${hex}.svg`;
	}


	// Code -> volledige landnaam
	const _regionNames = (typeof Intl !== 'undefined' && Intl.DisplayNames)
	  ? new Intl.DisplayNames(['en'], { type: 'region' })
	  : null;

	function codeToCountryName(cc){
	  cc = String(cc||'').toUpperCase();
	  if (!cc) return '';
	  if (_regionNames){
		try { return _regionNames.of(cc) || cc; } catch { return cc; }
	  }
	  const fallback = { EG:'Egypt', EE:'Estonia', IQ:'Iraq', NL:'Netherlands', DE:'Germany', FR:'France', GB:'United Kingdom', US:'United States' };
	  return fallback[cc] || cc;
	}

	// Toon altijd de volledige naam (met vlag)
	function renderCountry(r){
	  const cc = (r['Country'] || '').toUpperCase();
	  // naam gebruiken als al aanwezig, anders via Intl (of fallback-map)
	  const name = (r['CountryName'] && r['CountryName'].trim())
		? r['CountryName'].trim()
		: codeToCountryName(cc);

	  if (!cc && !name) return '';

	  // 1) Probeer Twemoji SVG (betrouwbaar op alle systemen)
	  const url = twemojiFlagUrl(cc);
	  const flagHtml = url
		? `<img class="flag" alt="${cc} flag" src="${url}">`
		// 2) Fallback: echte emoji (werkt op macOS/Android, soms niet op Windows)
		: (function(){
			const e = codeToFlagEmoji(cc);
			return e ? `<span class="flag">${e}</span>` : '';
		  })();

	  return `<span class="name-chip" title="${escapeHtml(name)}">${flagHtml}${escapeHtml(name)}</span>`;
	}



	function ipv4ToInt(ip){
	  const m = String(ip).trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
	  if (!m) return null;
	  const a=+m[1], b=+m[2], c=+m[3], d=+m[4];
	  if ([a,b,c,d].some(x=>x<0||x>255)) return null;
	  return (((a<<24)>>>0) + (b<<16) + (c<<8) + d) >>> 0;
	}
	
	function parseIpDbText(text){
	  const lines = text.replace(/\r/g,'').trim().split('\n').filter(Boolean);
	  const out = [];

	  const isHeader = (rowLower) =>
		rowLower.includes('ip_from') || rowLower.includes('ip to') ||
		(rowLower.includes('start') && rowLower.includes('end') && (rowLower.includes('country') || rowLower.includes('cc')));

	  for (const ln of lines){
		const row = splitBest(ln);            // <— auto , ; of \t
		if (row.length < 3) continue;

		// headers overslaan
		const joined = (row[0]+row[1]+(row[2]||'')).toLowerCase();
		if (isHeader(joined)) continue;

		let a=row[0], b=row[1];
		let cc=(row[2]||'').toUpperCase();
		let nm=(row[3]||'') || cc;

		let from=null, to=null;

		// numerieke ranges (IP2Location DB1) of dotted IPv4 ranges
		if (/^\d+$/.test(a) && /^\d+$/.test(b)){
		  from = parseInt(a,10); to = parseInt(b,10);
		} else {
		  const ai = ipv4ToInt(a), bi = ipv4ToInt(b);
		  if (ai!=null && bi!=null){ from=ai; to=bi; }
		}

		if (from!=null && to!=null && to>=from){
		  if (!/^[A-Z]{2}$/.test(cc)) cc = (cc||'').slice(0,2).toUpperCase();
		  out.push([from, to, cc, nm]);
		}
	  }

	  out.sort((x,y)=> x[0]-y[0]);
	  return out;
	}


	
	function stripPort(ip){
	  const s = String(ip || '').trim();
	  // [IPv6]:port  -> IPv6
	  if (s.startsWith('[')){
		const m = s.match(/^\[([^\]]+)\](?::\d+)?$/);
		return m ? m[1] : s;
	  }
	  // IPv4:port -> IPv4
	  const i = s.indexOf(':');
	  return i > -1 ? s.slice(0, i) : s;
	}

	
	function lookupCountryByIP(ip){
	  if (!hasIpDB) return null;
	  const clean = stripPort(ip);
	  const x = ipv4ToInt(clean);
	  if (x==null) return null;
	  // binary search in ipDB
	  let lo=0, hi=ipDB.length-1;
	  while (lo<=hi){
		const mid = (lo+hi)>>1;
		const r = ipDB[mid];
		if (x < r[0]) { hi = mid-1; }
		else if (x > r[1]) { lo = mid+1; }
		else { return { code: r[2], name: r[3]||r[2] }; }
	  }
	  return null;
	}
	function enrichCountriesInSessions(){
	  if (!hasIpDB) return;
	  for (const r of sessRows){
		const info = lookupCountryByIP(r['IP']);
		r['Country'] = info ? info.code : '';
		r['CountryName'] = info ? info.name : '';
	  }
	}

	async function fetchCountry(ip){
	  // Gratis endpoint met CORS: https://ipwho.is/<ip>
	  const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
	  const res = await fetch(url, { cache: 'no-store' });
	  if (!res.ok) throw new Error(`HTTP ${res.status}`);
	  const data = await res.json();
	  if (data && data.success !== false) {
		return { code: String(data.country_code||'').toUpperCase(), name: data.country || '' };
	  }
	  throw new Error(data && data.message || 'lookup failed');
	}

	function applyCountryCacheToRows(){
	  for (const r of sessRows){
		const ip = stripPort(r.IP);
		const info = (window.countryCache ? window.countryCache.get(ip) : null);
		if (info){
		  r.Country     = info.code || r.Country || '';
		  // Gebruik info.name, anders afleiden uit de code:
		  r.CountryName = (info.name && info.name.trim()) ? info.name.trim()
						: (r.Country ? codeToCountryName(r.Country) : (r.CountryName||''));
		} else {
		  // Als we al een code hebben maar nog geen naam, vul die alsnog in
		  if (r.Country && !r.CountryName){
			r.CountryName = codeToCountryName(r.Country);
		  }
		}
	  }
	}



    /* ---------- Sessions: filter/sort/paging ---------- */
    sessQ.addEventListener('input', () => { sessCurrentPage = 1; sessApplyFilter(); });
    sessPageSizeSel.addEventListener('change', () => { sessPageSize = parseInt(sessPageSizeSel.value,10); sessCurrentPage = 1; sessRender(); });
    sessPrevBtn.addEventListener('click', () => { if (sessCurrentPage > 1){ sessCurrentPage--; sessRender(); } });
    sessNextBtn.addEventListener('click', () => { const pages = Math.max(1, Math.ceil(sessFiltered.length / sessPageSize)); if (sessCurrentPage < pages){ sessCurrentPage++; sessRender(); } });
    document.querySelectorAll('.sess-sort').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (sessSortKey === key){ sessSortDir = (sessSortDir === 'asc' ? 'desc' : 'asc'); }
        else { sessSortKey = key; sessSortDir = (key === 'Started on' ? 'desc' : 'asc'); }
        document.querySelectorAll('.sess-sort').forEach(b=>{ b.classList.toggle('active', b.dataset.key===sessSortKey); b.setAttribute('aria-sort', b.dataset.key===sessSortKey ? sessSortDir : 'none'); });
        sessRender();
      });
    });

	/* ---------- Kills: filter/sort/paging ---------- */
	kQ.addEventListener('input', () => { kCurrentPage = 1; kApplyFilter(); });
	kPageSizeSel.addEventListener('change', () => { kPageSize = parseInt(kPageSizeSel.value,10); kCurrentPage = 1; kRender(); });
	kPrevBtn.addEventListener('click', () => { if (kCurrentPage > 1){ kCurrentPage--; kRender(); } });
	kNextBtn.addEventListener('click', () => { const pages = Math.max(1, Math.ceil(killsFiltered.length / kPageSize)); if (kCurrentPage < pages){ kCurrentPage++; kRender(); } });
	document.querySelectorAll('.kill-sort').forEach(btn => {
	  btn.addEventListener('click', () => {
		const key = btn.dataset.key;
		if (kSortKey === key){ kSortDir = (kSortDir === 'asc' ? 'desc' : 'asc'); }
		else { kSortKey = key; kSortDir = (key === 'Time' ? 'desc' : 'asc'); }
		document.querySelectorAll('.kill-sort').forEach(b=>{
		  b.classList.toggle('active', b.dataset.key===kSortKey);
		  b.setAttribute('aria-sort', b.dataset.key===kSortKey ? kSortDir : 'none');
		});
		kRender();
	  });
	});

	function kApplyFilter(){
	  const term = kQ.value.trim().toLowerCase();
	  const headers = KILL_COLS;
	  killsFiltered = killsRows.filter(r => {
		const globalOk = !term || headers.some(k => String(r[k]||'').toLowerCase().includes(term));
		const colsOk   = rowMatchesColFilters(r, killColFilters, headers, {name:'kills'});
		return globalOk && colsOk;
	  });
	  kCurrentPage = 1;
	  kRender();
	}
	function kRender(){
	  let data = killsFiltered.slice();
	  if (kSortKey){
		data.sort((a,b)=> kCmp(a[kSortKey], b[kSortKey], kSortKey));
		if (kSortDir==='desc') data.reverse();
	  }
	  const pages = Math.max(1, Math.ceil(data.length / kPageSize));
	  if (kCurrentPage > pages) kCurrentPage = pages;
	  const start = (kCurrentPage - 1) * kPageSize;
	  const pageData = data.slice(start, start + kPageSize);

	  kCountEl.textContent = (data.length===killsRows.length) ? `${data.length} rows` : `${data.length} of ${killsRows.length} rows`;
	  kPageInfo.textContent = `Page ${pages === 0 ? 0 : kCurrentPage}/${pages}`;

	  if (!pageData.length){
		killsTbody.innerHTML = `<tr><td colspan="8" class="empty">No results for the current filter.</td></tr>`;
		return;
	  }

	  const frag = document.createDocumentFragment();
	  pageData.forEach(r => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
		  <td class="sender"    title="${escapeHtml(r['Attacker']||'')}"><span class="name-chip">${escapeHtml(r['Attacker']||'')}</span></td>
		  <td class="recipient" title="${escapeHtml(r['Victim']||'')}"><span class="name-chip">${escapeHtml(r['Victim']||'')}</span></td>
		  <td class="scope"     title="${escapeHtml(r['Team']||'')}">${escapeHtml(r['Team']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['Weapon']||'')}">${escapeHtml(r['Weapon']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['MOD']||'')}">${escapeHtml(r['MOD']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['Damage']||'')}">${escapeHtml(r['Damage']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['Body Part']||'')}">${escapeHtml(r['Body Part']||'')}</td>
		  <td class="date"><span class="date-chip">${escapeHtml(r['Time']||'')}</span></td>
		`;
		frag.appendChild(tr);
	  });
	  killsTbody.innerHTML = '';
	  killsTbody.appendChild(frag);
	}
	function kHeaders(){ return ['Time','Attacker','Victim','Team','Weapon','MOD','Damage','Body Part']; }
	function kCmp(a,b,key){
	  if (key === 'Time'){ const ta = toTime(a), tb = toTime(b); return (ta||0) - (tb||0); }
	  if (key === 'Damage'){ const na = parseInt(a,10)||0; const nb = parseInt(b,10)||0; return na - nb; }
	  const sa = String(a||'').toLowerCase(), sb = String(b||'').toLowerCase();
	  return sa.localeCompare(sb, 'en', {sensitivity:'base'});
	}

function buildStatsFromKills(src = killsRows){
  const isHeadshot = (row) => {
    const bp  = String(row['Body Part'] || '').toLowerCase();
    const mod = String(row['MOD'] || '').toLowerCase();
    return bp.includes('head') || /head.?shot/.test(mod);
  };

  const map = new Map();     // player -> stats
  const events = new Map();  // player -> [{t, type:'K'|'D'}]

  function ensure(name){
    let s = map.get(name);
    if (!s){
      s = { Player:name, Kills:0, Deaths:0, Headshots:0, Damage:0 };
      map.set(name, s);
    }
    if (!events.has(name)) events.set(name, []);
    return s;
  }

  for (const r of src){
    const t = toTime(r.Time) || 0;
    const attacker = String(r.Attacker||'').trim();
    const victim   = String(r.Victim||'').trim();
    const dmg = parseInt(r.Damage,10) || 0;

    if (attacker){
      const s = ensure(attacker);
      s.Kills  += 1;
      s.Damage += dmg;
      if (isHeadshot(r)) s.Headshots += 1;
      events.get(attacker).push({ t, type:'K' });
    }
    if (victim){
      const s = ensure(victim);
      s.Deaths += 1;
      events.get(victim).push({ t, type:'D' });
    }
  }

  const out = [];
  for (const s of map.values()){
    const ev = (events.get(s.Player) || []).sort((a,b)=> a.t - b.t);
    let maxKS=0, curKS=0, maxDS=0, curDS=0;
    for (const e of ev){
      if (e.type === 'K'){ curKS++; maxKS=Math.max(maxKS,curKS); curDS=0; }
      else               { curDS++; maxDS=Math.max(maxDS,curDS); curKS=0; }
    }

    const kdr = s.Deaths ? (s.Kills / s.Deaths) : (s.Kills > 0 ? s.Kills : 0);
    const KDRLabel = (s.Deaths===0 && s.Kills>0) ? '∞' : (Math.round(kdr*100)/100).toFixed(2);

    out.push({
      Player: s.Player,
      Kills: s.Kills,
      Deaths: s.Deaths,
      Headshots: s.Headshots,
      Damage: s.Damage,
      Killstreak: maxKS,
      Deathstreak: maxDS,
      KDR: kdr,
      KDRLabel
    });
  }
  return out;
}



	/* ---------- Statistics: filter/sort/paging ---------- */
	stQ.addEventListener('input', () => { stCurrentPage = 1; stApplyFilter(); });
	stPageSizeSel.addEventListener('change', () => { stPageSize = parseInt(stPageSizeSel.value,10); stCurrentPage = 1; stRender(); });
	stPrevBtn.addEventListener('click', () => { if (stCurrentPage > 1){ stCurrentPage--; stRender(); } });
	stNextBtn.addEventListener('click', () => { const pages = Math.max(1, Math.ceil(stFiltered.length / stPageSize)); if (stCurrentPage < pages){ stCurrentPage++; stRender(); } });
	document.querySelectorAll('.stat-sort').forEach(btn => {
	  btn.addEventListener('click', () => {
		const key = btn.dataset.key;
		if (stSortKey === key){ stSortDir = (stSortDir === 'asc' ? 'desc' : 'asc'); }
		else { stSortKey = key; stSortDir = (key === 'KDR' ? 'desc' : 'asc'); }
		document.querySelectorAll('.stat-sort').forEach(b=>{
		  b.classList.toggle('active', b.dataset.key===stSortKey);
		  b.setAttribute('aria-sort', b.dataset.key===stSortKey ? stSortDir : 'none');
		});
		stRender();
	  });
	});



	function stHeaders(){ return ['Player','Kills','Deaths','Headshots','Damage','KDR']; }

	function stApplyFilter(){
	  const term = stQ.value.trim().toLowerCase();
	  const headers = STATS_COLS;
	  stFiltered = stRows.filter(r => {
		const globalOk = !term || headers.some(k => {
		  if (k==='KDR') return includesLC(`${r['KDRLabel']||''} ${r['KDR']||''}`, term);
		  return includesLC(r[k], term);
		});
		const colsOk   = rowMatchesColFilters(r, statsColFilters, headers, {name:'stats'});
		return globalOk && colsOk;
	  });
	  stCurrentPage = 1;
	  stRender();
	}

function stCmp(a,b,key){
  if (key==='Kills' || key==='Deaths' || key==='Headshots' || key==='Killstreak' || key==='Deathstreak' || key==='Damage' || key==='KDR'){
    const na = +a || 0, nb = +b || 0;
    return na - nb;
  }
  const sa = String(a||'').toLowerCase(), sb = String(b||'').toLowerCase();
  return sa.localeCompare(sb, 'en', {sensitivity:'base'});
}



	function stRender(){
	  let data = stFiltered.slice();
	  if (stSortKey){
		data.sort((a,b)=> stCmp(a[stSortKey], b[stSortKey], stSortKey));
		if (stSortDir==='desc') data.reverse();
	  }
	  const pages = Math.max(1, Math.ceil(data.length / stPageSize));
	  if (stCurrentPage > pages) stCurrentPage = pages;
	  const start = (stCurrentPage - 1) * stPageSize;
	  const pageData = data.slice(start, start + stPageSize);

	  stCountEl.textContent = (data.length===stRows.length) ? `${data.length} rows` : `${data.length} of ${stRows.length} rows`;
	  stPageInfo.textContent = `Page ${pages === 0 ? 0 : stCurrentPage}/${pages}`;

	  if (!pageData.length){
		statsTbody.innerHTML = `<tr><td colspan="8" class="empty">No results for the current filter.</td></tr>`;
		return;
	  }

	  const frag = document.createDocumentFragment();
	  pageData.forEach(r => {
		const tr = document.createElement('tr');
tr.innerHTML = `
  <td class="sender"  title="${escapeHtml(r['Player']||'')}"><span class="name-chip">${escapeHtml(r['Player']||'')}</span></td>
  <td class="scope"   title="${escapeHtml(r['Kills']||0)}">${escapeHtml(r['Kills']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['Deaths']||0)}">${escapeHtml(r['Deaths']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['Headshots']||0)}">${escapeHtml(r['Headshots']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['Killstreak']||0)}">${escapeHtml(r['Killstreak']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['Deathstreak']||0)}">${escapeHtml(r['Deathstreak']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['Damage']||0)}">${escapeHtml(r['Damage']||0)}</td>
  <td class="scope"   title="${escapeHtml(r['KDRLabel']||'0.00')}">${escapeHtml(r['KDRLabel']||'0.00')}</td>
`;

		frag.appendChild(tr);
	  });
	  statsTbody.innerHTML = '';
	  statsTbody.appendChild(frag);
	}



// ---- Online country resolver (safe drop-in) -------------------------------
(function(){
  // Delayed DOM lookups (werken ook in de export)
  const btn = document.getElementById('sessResolve');
  const statusEl = document.getElementById('geoStatus');

  // Deelbare cache op window zodat export/andere blokken ‘m ook zien
  if (!window.countryCache) window.countryCache = new Map();

  // Helpers (alleen definiëren als ze nog niet bestaan)
  if (typeof fetchCountry !== 'function') {
    async function fetchCountry(ip){
      const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.success !== false) {
        return { code: String(data.country_code||'').toUpperCase(), name: data.country || '' };
      }
      throw new Error(data && data.message || 'lookup failed');
    }
  }

  if (typeof applyCountryCacheToRows !== 'function') {
    function applyCountryCacheToRows(){
      for (const r of sessRows){
        const ip = stripPort(r.IP);
        const info = window.countryCache.get(ip);
        if (info){
          r.Country     = info.code || r.Country || '';
          r.CountryName = info.name || r.CountryName || '';
        }
      }
    }
  }

  async function resolveCountriesOnline({force=false} = {}){
    if (!sessRows.length){
      if (statusEl) statusEl.textContent = 'Geo: no sessions loaded';
      return;
    }
    const ips = Array.from(new Set(
      sessRows.map(r => stripPort(r.IP)).filter(Boolean)
    ));
    const toDo = ips.filter(ip => force || !window.countryCache.has(ip));
    if (!toDo.length){
      applyCountryCacheToRows();
      sessApplyFilter();
      if (statusEl) statusEl.textContent = 'Geo: nothing to resolve';
      return;
    }

    let done = 0, ok = 0;
    const maxParallel = 4;
    const q = toDo.slice();
    if (statusEl) statusEl.textContent = `Geo: resolving 0/${toDo.length}`;

    async function worker(){
      while (q.length){
        const ip = q.shift();
        try{
          const info = await fetchCountry(ip);
          window.countryCache.set(ip, info);
          ok++;
        }catch{
          window.countryCache.set(ip, { code:'', name:'' });
        }finally{
          done++;
          if (statusEl) statusEl.textContent = `Geo: resolving ${done}/${toDo.length}`;
        }
      }
    }
    await Promise.all(Array.from({length: Math.min(maxParallel, q.length)}, worker));

    applyCountryCacheToRows();
    sessApplyFilter();
    if (statusEl) statusEl.textContent = `Geo: ${ok}/${toDo.length} resolved`;
  }

  if (btn){
    btn.addEventListener('click', () => resolveCountriesOnline());
  }
})();



	function sessApplyFilter(){
	  const term = sessQ.value.trim().toLowerCase();
	  const headers = SESS_COLS;
	  sessFiltered = sessRows.filter(r => {
		const globalOk = !term || headers.some(k => String(r[k]||'').toLowerCase().includes(term) ||
									   (k==='Country' && includesLC(`${r['CountryName']||''} ${r['Country']||''}`, term)));
		const colsOk   = rowMatchesColFilters(r, sessColFilters, headers, {name:'sessions'});
		return globalOk && colsOk;
	  });
	  sessCurrentPage = 1;
	  sessRender();
	}
    function sessRender(){
      let data = sessFiltered.slice();
      if (sessSortKey){
        data.sort((a,b)=> sessCmp(a[sessSortKey], b[sessSortKey], sessSortKey));
        if (sessSortDir==='desc') data.reverse();
      }
      const pages = Math.max(1, Math.ceil(data.length / sessPageSize));
      if (sessCurrentPage > pages) sessCurrentPage = pages;
      const start = (sessCurrentPage - 1) * sessPageSize;
      const pageData = data.slice(start, start + sessPageSize);

      sessCountEl.textContent = (data.length===sessRows.length) ? `${data.length} rows` : `${data.length} of ${sessRows.length} rows`;
      sessPageInfo.textContent = `Page ${pages === 0 ? 0 : sessCurrentPage}/${pages}`;

      if (!pageData.length){ sessTbody.innerHTML = `<tr><td colspan="9" class="empty">No results for the current filter.</td></tr>`; return; }

      const frag = document.createDocumentFragment();
      pageData.forEach(r => {
        const tr = document.createElement('tr');
		tr.innerHTML = `
		  <td class="sender"    title="${escapeHtml(r['Name']||'')}"><span class="name-chip">${escapeHtml(r['Name']||'')}</span></td>
		  <td class="recipient" title="${escapeHtml(r['IP']||'')}"><span class="name-chip">${escapeHtml(r['IP']||'')}</span></td>
		  <td class="country"   title="${escapeHtml(r['CountryName']||r['Country']||'')}">${renderCountry(r)}</td>
		  <td class="scope"     title="${escapeHtml(r['Game Version']||'')}">${escapeHtml(r['Game Version']||'')}</td>
		${(() => {
		  const skin = r['Allied model'] || '';
		  const bad  = skin && !isAllowedSkin('allied', skin);
		  const tip  = escapeHtml(skin || '') + (bad ? ' • niet toegestaan' : '');
		  return `<td class="scope ${bad ? 'invalid-skin' : ''}" title="${tip}">${escapeHtml(skin)}</td>`;
		})()}
		${(() => {
		  const skin = r['German model'] || '';
		  const bad  = skin && !isAllowedSkin('german', skin);
		  const tip  = escapeHtml(skin || '') + (bad ? ' • niet toegestaan' : '');
		  return `<td class="scope ${bad ? 'invalid-skin' : ''}" title="${tip}">${escapeHtml(skin)}</td>`;
		})()}		  <td class="scope"     title="${escapeHtml(r['Rate']||'')}">${escapeHtml(r['Rate']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['Snaps']||'')}">${escapeHtml(r['Snaps']||'')}</td>
		  <td class="scope"     title="${escapeHtml(r['Ping']||'')}">${escapeHtml(r['Ping']||'')}</td>
		  <td class="date"><span class="date-chip">${escapeHtml(r['Started on']||'')}</span></td>
		`;

        frag.appendChild(tr);
      });
      sessTbody.innerHTML = '';
      sessTbody.appendChild(frag);
    }
	function sessHeaders(){
	  return ['Name','IP','Country','Game Version','Allied model','German model','Rate','Snaps','Ping','Started on'];
	}
    function sessCmp(a,b,key){
      if (key === 'Started on'){ const ta = toTime(a), tb = toTime(b); return (ta||0) - (tb||0); }
      const na = (key==='Rate'||key==='Snaps'||key==='Ping') ? (parseInt(a,10)||0) : null;
      const nb = (key==='Rate'||key==='Snaps'||key==='Ping') ? (parseInt(b,10)||0) : null;
      if (na!==null && nb!==null) return na - nb;
      const sa = String(a||'').toLowerCase(), sb = String(b||'').toLowerCase();
      return sa.localeCompare(sb, 'en', {sensitivity:'base'});
    }

    /* ---------- Global interactive download (inject BOTH datasets) ---------- */
    function captureState(){ return { filterTerm: q.value, sortKey, sortDir, pageSize, currentPage }; }
    function captureSessState(){ return { filterTerm: sessQ.value, sortKey: sessSortKey, sortDir: sessSortDir, pageSize: sessPageSize, currentPage: sessCurrentPage }; }
	function captureKillState(){ 
	  return { filterTerm: kQ.value, sortKey: kSortKey, sortDir: kSortDir, pageSize: kPageSize, currentPage: kCurrentPage }; 
	}
	function captureStatsState(){
	  return {
		filterTerm: stQ.value,
		sortKey: stSortKey,
		sortDir: stSortDir,
		pageSize: stPageSize,
		currentPage: stCurrentPage,
		range: stRange
	  };
	}


    globalDlBtn.addEventListener('click', () => downloadInteractiveAll('viewer_interactive.html'));

	function downloadInteractiveAll(filename){
	  const killsJson = JSON.stringify(killsRows).replace(/</g,'\\u003C');
	  const killsStateJson = JSON.stringify(captureKillState()).replace(/</g,'\\u003C');
	  const chatJson = JSON.stringify(rows).replace(/</g,'\\u003C');
	  const chatStateJson = JSON.stringify(captureState()).replace(/</g,'\\u003C');
	  const sessJson = JSON.stringify(sessRows).replace(/</g,'\\u003C');
	  const sessStateJson = JSON.stringify(captureSessState()).replace(/</g,'\\u003C');
	  const END = '<' + '/script>';

	  const outer = document.documentElement.outerHTML.replace(
		/<\/body>\s*<\/html>\s*$/i,
		'\n<script id="bootstrap" type="application/json">' + chatJson + END + '\n' +
		'<script id="bootstrapState" type="application/json">' + chatStateJson + END + '\n' +
		'<script id="bootstrapSess" type="application/json">' + sessJson + END + '\n' +
		'<script id="bootstrapSessState" type="application/json">' + sessStateJson + END + '\n' +
		'<script id="bootstrapKills" type="application/json">' + killsJson + END + '\n' + 
		'<script id="bootstrapKillsState" type="application/json">' + killsStateJson + END + '\n' +
		'<script id="bootstrapStats" type="application/json">' + JSON.stringify(stRows).replace(/</g,'\\u003C') + END + '\n' +
		'<script id="bootstrapStatsState" type="application/json">' + JSON.stringify(captureStatsState()).replace(/</g,'\\u003C') + END + '\n' +
		'</body></html>'              // <-- plus toegevoegd
	  );

	  const html = '<!DOCTYPE html>\n' + outer;
	  const blob = new Blob([html], {type:'text/html;charset=utf-8;'});
	  const url = URL.createObjectURL(blob);
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = filename;
	  document.body.appendChild(a);
	  a.click();
	  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
	}


    /* ---------- Shared helpers ---------- */
    function toTime(v){
      const s = String(v||'').trim(); if (!s) return 0;
      let m = s.match(/^([0-3]?\d)\.([01]?\d)\.(\d{4})[ T](\d{2}):(\d{2}):(\d{2})$/); if (m) return Date.parse(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}T${m[4]}:${m[5]}:${m[6]}Z`);
      m = s.match(/^(\d{4})[-\/](\d{2})[-\/]?(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/); if (m) return Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`);
      m = s.match(/^([01]?\d)\/([0-3]?\d)\/(\d{4})[ T](\d{2}):(\d{2}):(\d{2})$/); if (m) return Date.parse(`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}T${m[4]}:${m[5]}:${m[6]}Z`);
      const t = Date.parse(s); return isNaN(t) ? 0 : t;
    }

    function escapeHtml(str){
      return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
    }

    async function readFileSmart(file){
      const buf = await file.arrayBuffer();
      const decode = (enc) => { try { return new TextDecoder(enc,{fatal:false}).decode(new Uint8Array(buf)); } catch { return ''; } };
      const bad = s => (s.match(/\ufffd/g)||[]).length;
      let best = decode('utf-8'); let score = bad(best);
      for (const enc of ['windows-1252','iso-8859-1']){ const t = decode(enc); const sc = bad(t); if (sc < score){ best = t; score = sc; } }
      return best;
    }

    function parseSmart(text){
      const cleaned = text.replaceAll('\r','').trim();
      let lines = cleaned.split('\n').filter(Boolean);
      lines = lines.filter(ln => !ln.trim().startsWith('*'));
      const delims = ['\t','|','; ',','];
      for (const dRaw of delims){
        const d = dRaw === '; ' ? ';' : dRaw;
        const rows = lines.map(ln => splitRow(ln, d));
        const ok = rows.filter(r=>r.length===5).length / rows.length;
        if (ok >= 0.8){
          const [head, ...body] = rows;
          let headers = head.map(h=>h.trim());
          if (!looksLikeHeaders(headers)){
            headers = ['Message','Sender','Recipient','Scope','Date'];
            body.unshift(rows[0]);
          }
          return { data: body.map(r => toObj(headers, r)) };
        }
      }
      return { data: parseLogLines(lines) };
    }
    function splitRow(line, sep){
      const out = []; let cur=''; let i=0; let inQ=false; const s=line, n=s.length;
      while (i<n){ const ch=s[i]; if (ch==='"'){ if (inQ && s[i+1]==='"'){cur+='"'; i+=2; continue;} inQ=!inQ; i++; continue; } if (ch===sep && !inQ){ out.push(cur.trim()); cur=''; i++; continue; } cur+=ch; i++; }
      out.push(cur.trim()); return out;
    }
	
	function splitBest(line){
  let best = [], bestLen = 0;
  for (const sep of [',',';','\t']){
    const cells = splitRow(line, sep).map(s => s.replace(/^"+|"+$/g,'').trim());
    if (cells.length > bestLen){ best = cells; bestLen = cells.length; }
  }
  return best;
}

	
	
    function looksLikeHeaders(arr){ const j = arr.join('|').toLowerCase(); return ['message','sender','recipient','scope','date'].every(k => j.includes(k)); }
    function toObj(headers, row){ const want = ['Message','Sender','Recipient','Scope','Date']; const map = headers.map(h => normalizeHeader(h)); const obj = {}; for (let i=0;i<5;i++){ const key = want[i]; const idx = map.indexOf(key); obj[key] = row[idx>-1 ? idx : i] ?? ''; } return obj; }
    function parseLogLines(lines){
      const out = [];
      for (const ln of lines){ const r = parseLogLine(ln); if (r) out.push(r); }
      return out;
    }
    function parseLogLine(ln){
      const s = ln.trim(); if (!s.startsWith('[')) return null; const close = s.indexOf(']'); if (close < 0) return null; const date = s.slice(1, close).trim(); let rest = s.slice(close+1).trim();
      const S='Sender:', T='Type:', R='Recipient:', M='Message:';
      const sIdx = rest.indexOf(S); if (sIdx === -1) return null; rest = rest.slice(sIdx + S.length).trim();
      const tIdx = rest.indexOf(T); if (tIdx === -1) return null; const sender = rest.slice(0, tIdx).trim(); rest = rest.slice(tIdx + T.length).trim();
      let scope = ''; if (rest.startsWith('(')){ const end = rest.indexOf(')'); if (end !== -1){ scope = rest.slice(1, end).trim(); rest = rest.slice(end+1).trim(); } } else { const rPos = rest.indexOf(R); if (rPos === -1) return null; scope = rest.slice(0, rPos).trim(); rest = rest.slice(rPos).trim(); }
      if (!rest.startsWith(R)) return null; rest = rest.slice(R.length).trim();
      const mPos = rest.indexOf(M); if (mPos === -1) return null; const recipient = rest.slice(0, mPos).trim(); const message = rest.slice(mPos + M.length).trim();
      return { Date: date, Sender: sender, Scope: scope, Recipient: recipient, Message: message };
    }
    function normalizeHeader(h){
      h = String(h||'').trim().toLowerCase();
      if (['msg','message','text'].includes(h)) return 'Message';
      if (['from','sender'].includes(h)) return 'Sender';
      if (['to','recipient'].includes(h)) return 'Recipient';
      if (['scope','channel','type'].includes(h)) return 'Scope';
      if (['date','time','timestamp'].includes(h)) return 'Date';
      return h.charAt(0).toUpperCase()+h.slice(1);
    }
    function cleanBadChars(s){ return String(s).split('\uFFFD').join(''); }
    function normalizeColumns(data){
      return data.map(r => {
        let recipient = r.Recipient || '';
        if (recipient.trim().toLowerCase() === '<unknown>') recipient = '';
        let scope = (r.Scope || '').trim().toLowerCase();
        if (scope==='all') scope='All';
        else if (scope==='team') scope='Team';
        else if (scope==='spectators' || scope==='spec') scope='Spectators';
        else scope = scope ? scope[0].toUpperCase()+scope.slice(1) : '';
        return { Message: cleanBadChars(r.Message || ''), Sender: cleanBadChars(r.Sender || ''), Recipient: cleanBadChars(recipient), Scope: cleanBadChars(scope), Date: cleanBadChars(r.Date || '') };
      });
    }

    /* ---------- Sessions parsing ---------- */
    function parseSessionsText(text){
      const cleaned = text.replaceAll('\r','').trim();
      const lines = cleaned.split('\n').filter(Boolean);
      const out = [];
      for (const ln of lines){
        const rec = parseSessionLine(ln);
        if (rec) out.push(rec);
      }
      return out;
    }
    // [dd.mm.yyyy hh:mm:ss] Connected at | Player Name: ... Player IP: A.B.C.D:PORT Game Version: ... Allied model: ... German model: ... Rate: ... Snaps: ... Ping: ...
    function parseSessionLine(ln){
      const s = ln.trim();
      if (!s.startsWith('[')) return null;
      const rb = s.indexOf(']');
      if (rb < 0) return null;
      const ts = s.slice(1, rb).trim();
      const rest = s.slice(rb+1).trim();
      if (!/^Connected at \|/i.test(rest)) return null;

      const payload = rest.replace(/^Connected at \|\s*/i,'');
      const getBetween = (full, startLabel, endLabelList) => {
        const startIdx = full.indexOf(startLabel);
        if (startIdx === -1) return '';
        let valStart = startIdx + startLabel.length;
        let nextIdx = -1;
        for (const endLabel of endLabelList){
          const i = full.indexOf(endLabel, valStart);
          if (i !== -1){ nextIdx = (nextIdx === -1) ? i : Math.min(nextIdx, i); }
        }
        const val = (nextIdx === -1) ? full.slice(valStart) : full.slice(valStart, nextIdx);
        return val.trim();
      };

      const name   = getBetween(payload, 'Player Name: ', [' Player ID:', ' Player IP:', ' Game Version:', ' Allied model:', ' German model:', ' Rate:', ' Snaps:', ' Ping:']);
      const ip     = getBetween(payload, 'Player IP: ',   [' Game Version:', ' Allied model:', ' German model:', ' Rate:', ' Snaps:', ' Ping:']);
      const gv     = getBetween(payload, 'Game Version: ',[' Allied model:', ' German model:', ' Rate:', ' Snaps:', ' Ping:']);
      const am     = getBetween(payload, 'Allied model: ',[' German model:', ' Rate:', ' Snaps:', ' Ping:']);
      const gm     = getBetween(payload, 'German model: ',[' Rate:', ' Snaps:', ' Ping:']);
      const rate   = getBetween(payload, 'Rate: ',        [' Snaps:', ' Ping:']);
      const snaps  = getBetween(payload, 'Snaps: ',       [' Ping:']);
      const ping   = getBetween(payload, 'Ping: ',        []);

      return {
        'Name': cleanBadChars(name),
        'IP': cleanBadChars(ip),
        'Game Version': cleanBadChars(gv),
        'Allied model': cleanBadChars(am),
        'German model': cleanBadChars(gm),
        'Rate': cleanBadChars(rate),
        'Snaps': cleanBadChars(snaps),
        'Ping': cleanBadChars(ping),
        'Started on': cleanBadChars(ts)
      };
    }
    function sessNormalize(r){
	  r.IP = stripPort(r.IP);
	  return r;
	}

	/* ---------- Kills parsing ---------- */
	function parseKillsText(text){
	  const cleaned = text.replaceAll('\r','').trim();
	  const lines = cleaned.split('\n').filter(Boolean);
	  const out = [];
	  for (const ln of lines){
		const r = parseKillLine(ln);
		if (r) out.push(r);
	  }
	  return out;
	}
	// [dd.mm.yyyy hh:mm:ss] Attacker Name: A Victim Name: B Victim Team: allies Weapon: Kar98 MOD: Fast Bullet Damage: 104 Body Part: Left Upper Arm
	function parseKillLine(ln){
	  const s = ln.trim();
	  if (!s.startsWith('[')) return null;
	  const rb = s.indexOf(']');
	  if (rb < 0) return null;
	  const ts = s.slice(1, rb).trim();
	  const payload = s.slice(rb+1).trim();

	  const labels = [' Attacker Name: ',' Victim Name: ',' Victim Team: ',' Weapon: ',' MOD: ',' Damage: ',' Body Part: '];

	  function pick(label){
		// accepteer ook zonder voorafgaande spatie
		const lab = (payload.includes(label) ? label : label.trim());
		const i = payload.indexOf(lab);
		if (i === -1) return '';
		const start = i + lab.length;
		let end = payload.length;
		for (const L of labels){
		  if (L.trim() === lab.trim()) continue;
		  const j = payload.indexOf(L, start);
		  const j2 = payload.indexOf(L.trim(), start);
		  const cand = (j !== -1 && j2 !== -1) ? Math.min(j, j2)
					 : (j !== -1 ? j : (j2 !== -1 ? j2 : -1));
		  if (cand !== -1 && cand < end) end = cand;
		}
		return payload.slice(start, end).trim();
	  }

	  return {
		'Time': cleanBadChars(ts),
		'Attacker': cleanBadChars(pick(' Attacker Name: ')),
		'Victim': cleanBadChars(pick(' Victim Name: ')),
		'Team': cleanBadChars(pick(' Victim Team: ')),
		'Weapon': cleanBadChars(pick(' Weapon: ')),
		'MOD': cleanBadChars(pick(' MOD: ')),
		'Damage': cleanBadChars(pick(' Damage: ')),
		'Body Part': cleanBadChars(pick(' Body Part: '))
	  };
	}
