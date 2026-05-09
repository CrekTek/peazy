const HOLIDAYS = [
  { id:'beach',   label:'🏖 Beach',        cats:['essentials','summer'] },
  { id:'city',    label:'🏙 City break',   cats:['essentials'] },
  { id:'winter',  label:'⛷ Winter sports', cats:['essentials','winter_sports'] },
  { id:'hiking',  label:'🥾 Hiking',       cats:['essentials','hiking'] },
  { id:'camping', label:'⛺ Camping',      cats:['essentials','hiking','camping'] },
];

const CAT_META = {
  essentials:    { label:'Essentials',    dot:'#1A3D27' },
  summer:        { label:'Summer',        dot:'#8A5A00' },
  winter_sports: { label:'Winter sports', dot:'#4A3FA0' },
  hiking:        { label:'Hiking',        dot:'#0D5C52' },
  camping:       { label:'Camping',       dot:'#8A3020' },
};

const CAT_ORDER = ['essentials','summer','winter_sports','hiking','camping'];

const ITEMS = [
  { id:1,  name:'Passport / ID',             cats:['essentials'],    qty:()=>1 },
  { id:2,  name:'Travel insurance docs',     cats:['essentials'],    qty:()=>1 },
  { id:3,  name:'Phone charger',             cats:['essentials'],    qty:()=>1 },
  { id:4,  name:'Power adapter',             cats:['essentials'],    qty:()=>1 },
  { id:5,  name:'Headphones',                cats:['essentials'],    qty:()=>1 },
  { id:6,  name:'Medication',                cats:['essentials'],    qty:()=>1 },
  { id:7,  name:'Toothbrush & toothpaste',   cats:['essentials'],    qty:()=>1 },
  { id:8,  name:'Deodorant',                 cats:['essentials'],    qty:()=>1 },
  { id:9,  name:'Underwear',                 cats:['essentials'],    qty:n=>n+1 },
  { id:10, name:'Socks',                     cats:['essentials'],    qty:n=>n+1 },
  { id:11, name:'T-shirts / tops',           cats:['essentials'],    qty:n=>Math.ceil(n*0.7) },
  { id:12, name:'Trousers / jeans',          cats:['essentials'],    qty:n=>Math.max(2,Math.ceil(n/3)) },
  { id:13, name:'Pyjamas',                   cats:['essentials'],    qty:()=>1 },
  { id:14, name:'Swimwear',                  cats:['summer'],        qty:()=>2 },
  { id:15, name:'Sunscreen SPF 50+',         cats:['summer'],        qty:n=>n>10?2:1 },
  { id:16, name:'Sunglasses',                cats:['summer'],        qty:()=>1 },
  { id:17, name:'Flip flops / sandals',      cats:['summer'],        qty:()=>1 },
  { id:18, name:'After-sun lotion',          cats:['summer'],        qty:()=>1 },
  { id:19, name:'Beach bag / tote',          cats:['summer'],        qty:()=>1 },
  { id:20, name:'Hat / cap',                 cats:['summer','hiking'],qty:()=>1 },
  { id:21, name:'Ski jacket',                cats:['winter_sports'], qty:()=>1 },
  { id:22, name:'Ski trousers',              cats:['winter_sports'], qty:()=>1 },
  { id:23, name:'Thermal base layers',       cats:['winter_sports'], qty:n=>Math.max(2,Math.ceil(n/3)) },
  { id:24, name:'Ski gloves',               cats:['winter_sports'], qty:()=>1 },
  { id:25, name:'Beanie / warm hat',         cats:['winter_sports'], qty:()=>1 },
  { id:26, name:'Ski socks',                 cats:['winter_sports'], qty:n=>Math.max(3,Math.ceil(n/2)) },
  { id:27, name:'Goggles',                   cats:['winter_sports'], qty:()=>1 },
  { id:28, name:'Lip balm (SPF)',            cats:['winter_sports'], qty:()=>1 },
  { id:29, name:'Neck gaiter / balaclava',   cats:['winter_sports'], qty:()=>1 },
  { id:30, name:'Hiking boots',              cats:['hiking'],        qty:()=>1 },
  { id:31, name:'Walking socks',             cats:['hiking'],        qty:n=>Math.max(2,Math.ceil(n/2)) },
  { id:32, name:'Hiking trousers / leggings',cats:['hiking'],        qty:()=>2 },
  { id:33, name:'Waterproof jacket',         cats:['hiking'],        qty:()=>1 },
  { id:34, name:'Backpack / daypack',        cats:['hiking'],        qty:()=>1 },
  { id:35, name:'Water bottle',              cats:['hiking'],        qty:()=>1 },
  { id:36, name:'Blister plasters',          cats:['hiking'],        qty:()=>1 },
  { id:37, name:'Trekking poles',            cats:['hiking'],        qty:()=>2 },
  { id:38, name:'Tent',                      cats:['camping'],       qty:()=>1 },
  { id:39, name:'Sleeping bag',              cats:['camping'],       qty:()=>1 },
  { id:40, name:'Sleeping mat / pad',        cats:['camping'],       qty:()=>1 },
  { id:41, name:'Camping stove & gas',       cats:['camping'],       qty:()=>1 },
  { id:42, name:'Mess kit',                  cats:['camping'],       qty:()=>1 },
  { id:43, name:'Head torch & batteries',    cats:['camping'],       qty:()=>1 },
  { id:44, name:'Fire lighter / matches',    cats:['camping'],       qty:()=>1 },
];

let nights = 7;
let activeHolidays = new Set(['beach']);
let checked = new Set();
let collapsed = new Set();

function changeNights(d) { setNights(Math.min(30, Math.max(1, nights + d))); }
function setNights(n) {
  nights = n;
  document.getElementById('nights-display').textContent = n;
  document.getElementById('nights-slider').value = n;
  render();
}

function toggleHoliday(id) {
  if (activeHolidays.has(id)) { if (activeHolidays.size > 1) activeHolidays.delete(id); }
  else activeHolidays.add(id);
  renderChips();
  render();
}

function getActiveCats() {
  const cats = new Set();
  for (const hid of activeHolidays) {
    const h = HOLIDAYS.find(x => x.id === hid);
    if (h) h.cats.forEach(c => cats.add(c));
  }
  return cats;
}

function getVisible() {
  const cats = getActiveCats();
  return ITEMS.filter(i => i.cats.some(c => cats.has(c)));
}

function toggleCheck(id) {
  checked.has(id) ? checked.delete(id) : checked.add(id);
  render();
}

function toggleCollapse(cat) {
  collapsed.has(cat) ? collapsed.delete(cat) : collapsed.add(cat);
  render();
}

function renderChips() {
  document.getElementById('chips').innerHTML = HOLIDAYS.map(h =>
    `<div class="chip ${activeHolidays.has(h.id)?'active':''}" onclick="toggleHoliday('${h.id}')" role="button" aria-pressed="${activeHolidays.has(h.id)}">${h.label}</div>`
  ).join('');
}

function render() {
  const cats = getActiveCats();
  const visible = getVisible();
  const total = visible.length;
  const packedCount = visible.filter(i => checked.has(i.id)).length;

  document.getElementById('s-total').textContent = total;
  document.getElementById('s-packed').textContent = packedCount;
  document.getElementById('s-left').textContent = total - packedCount;
  document.getElementById('progress').style.width = total ? Math.round(packedCount/total*100)+'%' : '0%';

  const container = document.getElementById('list');
  if (!visible.length) {
    container.innerHTML = '<div class="empty"><div class="empty-icon">🧳</div>Select a holiday type to get started</div>';
    return;
  }

  container.innerHTML = CAT_ORDER.filter(c => cats.has(c)).map(cat => {
    const items = visible.filter(i => i.cats.includes(cat));
    if (!items.length) return '';
    const isOpen = !collapsed.has(cat);
    const packedHere = items.filter(i => checked.has(i.id)).length;
    const meta = CAT_META[cat];
    return `<div class="section">
      <div class="section-header ${isOpen?'open':''}" onclick="toggleCollapse('${cat}')" role="button" aria-expanded="${isOpen}">
        <span class="cat-dot" style="background:${meta.dot}"></span>
        <span class="section-title">${meta.label}</span>
        <span class="section-badge">${packedHere}/${items.length}</span>
        <span class="chevron ${isOpen?'open':''}">▼</span>
      </div>
      ${isOpen ? `<div class="items">${items.map(item => {
        const isPacked = checked.has(item.id);
        const q = item.qty(nights);
        return `<div class="item ${isPacked?'packed':''}" onclick="toggleCheck(${item.id})" role="checkbox" aria-checked="${isPacked}">
          <div class="checkbox ${isPacked?'checked':''}">
            <svg class="checkmark" viewBox="0 0 10 7"><path d="M1 3.5L4 6.5L9 1"/></svg>
          </div>
          <span class="item-name">${item.name}</span>
          <span class="qty">× ${q}</span>
        </div>`;
      }).join('')}</div>` : ''}
    </div>`;
  }).join('');
}

function resetAll() {
  if (confirm('Reset all checked items?')) { checked.clear(); render(); }
}

function exportCSV() {
  const cats = getActiveCats();
  const visible = getVisible();
  const rows = [['Category','Item','Quantity','Packed']];
  for (const cat of CAT_ORDER) {
    if (!cats.has(cat)) continue;
    visible.filter(i => i.cats.includes(cat)).forEach(item => {
      rows.push([CAT_META[cat].label, item.name, item.qty(nights), checked.has(item.id)?'Yes':'No']);
    });
  }
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  a.download = 'packing-list.csv';
  a.click();
}

renderChips();
render();