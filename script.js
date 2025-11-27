/* Sri Book House — frontend behavior */
/* Data: sample catalog (replace or extend as needed) */
const BOOKS = [
  { id:1, title:"Fundamentals of Physics (Vol 1)", author:"R. K. Gupta", category:"School & College Books", price:320, isbn:"978-01-1001", cover:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4d3f2d", desc:"Comprehensive physics for college students with solved examples and practice exercises." },
  { id:2, title:"Advanced Mathematics for Engineers", author:"S. Nair", category:"School & College Books", price:420, isbn:"978-01-1002", cover:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b1f2a", desc:"A practical text covering calculus, linear algebra and differential equations." },
  { id:3, title:"The Quiet Library", author:"A. Raman", category:"Novels & Story Books", price:199, isbn:"978-01-2001", cover:"https://images.unsplash.com/photo-1496104679561-38f3f2c94d33?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7d3c2b", desc:"A warm novel about community, memory and small miracles." },
  { id:4, title:"Wings of Imagination", author:"N. Kapoor", category:"Novels & Story Books", price:249, isbn:"978-01-2002", cover:"https://images.unsplash.com/photo-1514894782793-9f16c1c1a8b5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f4e5d", desc:"A lyrical collection of short stories celebrating creativity." },
  { id:5, title:"Journal of Regional Studies — Vol. 12", author:"Sri Book House", category:"Research & Journals", price:150, isbn:"ISSN-9876-5432", cover:"https://images.unsplash.com/photo-1551024734-8b5cd4a2d9e7?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2c3f4b", desc:"Peer-reviewed research papers on regional socio-economic development." },
  { id:6, title:"Modern Teaching Methods", author:"P. Desai", category:"School & College Books", price:299, isbn:"978-01-1005", cover:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a7b8c", desc:"Practical handbook for instructors and educators." },
  { id:7, title:"Science Monthly — Issue 78", author:"Various", category:"Magazines", price:80, isbn:"MAG-0078", cover:"https://images.unsplash.com/photo-1455885662351-9d0c6f7f6f3d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b8c7a", desc:"Latest updates in science, research and technology." },
  { id:8, title:"Pocket Poems", author:"Various", category:"Novels & Story Books", price:149, isbn:"978-01-2005", cover:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9a8b7c", desc:"A compact collection of contemporary poems." },
  { id:9, title:"Research Methods — A Practical Guide", author:"L. Fernandes", category:"Research & Journals", price:349, isbn:"978-01-3003", cover:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c7b6a", desc:"Comprehensive guide to qualitative and quantitative research methods." },
  { id:10, title:"Campus Life — College Magazine", author:"Students' Union", category:"Magazines", price:60, isbn:"MAG-0102", cover:"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a5b4c", desc:"College highlights, events and student articles." },
  // Add more entries as needed...
];

/* ---------- UI references ---------- */
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const bookModal = document.getElementById('bookModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalCover = document.getElementById('modalCover');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDesc = document.getElementById('modalDesc');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const requestBtn = document.getElementById('requestBtn');
const isbnLink = document.getElementById('isbnLink');

let visibleCount = 6;
let filtered = BOOKS.slice();

/* Render book cards */
function renderBooks(reset=false){
  if(reset) booksGrid.innerHTML='';
  const list = filtered.slice(0, visibleCount);
  booksGrid.innerHTML = '';
  if(list.length === 0){
    booksGrid.innerHTML = '<div class="muted">No books found matching your search.</div>';
    return;
  }
  list.forEach(b=>{
    const card = document.createElement('article');
    card.className = 'book-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <img class="book-thumb" src="${b.cover}" alt="${escapeHtml(b.title)} cover">
      <div class="book-info">
        <h3>${escapeHtml(b.title)}</h3>
        <div class="meta">${escapeHtml(b.author)} • <span class="muted">${escapeHtml(b.isbn)}</span></div>
        <div class="tag">${escapeHtml(b.category)}</div>
        <div class="price">₹ ${b.price}</div>
      </div>
    `;
    card.addEventListener('click', ()=> openModal(b.id));
    card.addEventListener('keypress', (e)=> { if(e.key === 'Enter') openModal(b.id) });
    booksGrid.appendChild(card);
  });
}

/* Filtering & search */
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  filtered = BOOKS.filter(b=>{
    const matchQ = q === '' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.toLowerCase().includes(q));
    const matchCat = (cat === 'all') || (b.category === cat);
    return matchQ && matchCat;
  });

  // Sorting
  const s = sortSelect.value;
  if(s === 'title-asc') filtered.sort((a,b)=> a.title.localeCompare(b.title));
  if(s === 'price-asc') filtered.sort((a,b)=> a.price - b.price);
  if(s === 'price-desc') filtered.sort((a,b)=> b.price - a.price);

  visibleCount = 6;
  renderBooks(true);
}

/* Load more */
loadMoreBtn.addEventListener('click', ()=>{
  visibleCount += 6;
  renderBooks();
});

/* Modal behavior */
function openModal(id){
  const b = BOOKS.find(x=> x.id === id);
  if(!b) return;
  modalCover.src = b.cover;
  modalTitle.textContent = b.title;
  modalAuthor.textContent = `by ${b.author}`;
  modalDesc.textContent = b.desc;
  modalCategory.textContent = b.category;
  modalPrice.textContent = `Price: ₹ ${b.price}`;
  isbnLink.href = '#';
  bookModal.classList.add('show');
  bookModal.setAttribute('aria-hidden','false');
}

function closeModal(){
  bookModal.classList.remove('show');
  bookModal.setAttribute('aria-hidden','true');
}

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

/* Contact form (frontend demo) */
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('contactMsg');
  msg.textContent = 'Thanks — your request has been received (demo). We will contact you soon.';
  msg.style.color = '#d1ffd6';
  this.reset();
});

/* Search, filters events */
searchInput.addEventListener('input', debounce(applyFilters, 250));
categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

/* Utilities */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }
function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=> fn(...a), wait); } }

/* Testimonials slider */
(function testimonials(){
  const slides = document.querySelectorAll('.t-slide');
  let idx = 0;
  function show(i){
    slides.forEach((s,ii)=> s.classList.toggle('active', ii===i));
  }
  show(0);
  setInterval(()=> { idx = (idx+1) % slides.length; show(idx); }, 4200);
})();

/* Theme toggle */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  if(theme === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('sb_theme', theme);
}
themeToggle.addEventListener('click', ()=>{
  const isLight = document.documentElement.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});
const saved = localStorage.getItem('sb_theme') || 'dark';
applyTheme(saved);

/* Parallax effect (subtle) */
window.addEventListener('scroll', ()=> {
  const hero = document.querySelector('[data-parallax]');
  if(!hero) return;
  const sc = window.scrollY;
  hero.style.backgroundPosition = `center ${sc * 0.2}px`;
});

/* Accessibility & misc */
document.getElementById('year').textContent = new Date().getFullYear();

/* Initial render */
applyFilters();

