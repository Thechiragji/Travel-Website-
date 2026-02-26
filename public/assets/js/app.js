import { db } from './firebase-init.js';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

const $ = (id) => document.getElementById(id);
const safe = (v, f = '') => (v ?? f);

async function loadSettings() {
  const s = await getDoc(doc(db, 'settings', 'siteContent'));
  const seo = await getDoc(doc(db, 'settings', 'seo'));
  if (s.exists()) {
    const d = s.data();
    document.querySelectorAll('[data-setting]').forEach((el) => {
      const key = el.dataset.setting;
      if (d[key]) el.textContent = d[key];
    });
    if ($('contact-phone')) $('contact-phone').textContent = safe(d.contactPhone, '+91 00000 00000');
    if ($('contact-email')) $('contact-email').textContent = safe(d.contactEmail, 'hello@example.com');
    if ($('contact-address')) $('contact-address').textContent = safe(d.contactAddress, 'Gwalior, India');
    if ($('opening-hours')) $('opening-hours').textContent = safe(d.openingHours, '11:00 AM - 11:00 PM');
    if ($('hero-image') && d.heroImage) $('hero-image').style.backgroundImage = `linear-gradient(120deg, rgba(0,0,0,.65), rgba(0,0,0,.25)), url('${d.heroImage}')`;
  }
  if (seo.exists()) {
    const meta = seo.data();
    if (meta.metaTitle) document.title = meta.metaTitle;
    const m = document.querySelector('meta[name="description"]');
    if (m && meta.metaDescription) m.setAttribute('content', meta.metaDescription);
  }
}

async function loadPopularDishes() {
  const holder = $('popular-dishes');
  if (!holder) return;
  const q = query(collection(db, 'menuItems'), where('popular', '==', true), where('available', '==', true), limit(6));
  const snap = await getDocs(q);
  holder.innerHTML = '';
  snap.forEach((docSnap) => {
    const i = docSnap.data();
    holder.innerHTML += `<article class="card menu-item"><img loading="lazy" src="${safe(i.image, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80')}" alt="${i.name}"><h3>${i.name}</h3><p>${safe(i.description)}</p><strong>₹${i.price}</strong></article>`;
  });
}

async function loadFaq() {
  const container = $('faq-list');
  if (!container) return;
  const s = await getDoc(doc(db, 'settings', 'siteContent'));
  const faq = s.exists() ? s.data().faq || [] : [];
  container.innerHTML = faq.map((item) => `<div class="faq-item"><strong>${item.q}</strong><p>${item.a}</p></div>`).join('');
}

async function loadReviews() {
  const container = $('reviews-list');
  if (!container) return;
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(6));
  const snap = await getDocs(q);
  container.innerHTML = '';
  snap.forEach((d) => {
    const r = d.data();
    container.innerHTML += `<article class="card"><p>“${r.message}”</p><strong>${r.name}</strong></article>`;
  });
}

async function loadChefSpecial() {
  const el = $('chef-special');
  if (!el) return;
  const s = await getDoc(doc(db, 'settings', 'siteContent'));
  const text = s.exists() ? s.data().chefSpecial : 'Chef\'s signature smoky paneer sizzler with Indo-Chinese sauce.';
  el.textContent = text;
}

async function loadMenuPage() {
  const wrap = $('menu-categories');
  if (!wrap) return;
  const cats = await getDocs(query(collection(db, 'menuCategories'), orderBy('order', 'asc')));
  wrap.innerHTML = '';
  for (const c of cats.docs) {
    const cat = c.data();
    const items = await getDocs(query(collection(db, 'menuItems'), where('categoryId', '==', c.id), where('available', '==', true)));
    let html = `<section class="card"><h2>${cat.name}</h2><div class="grid grid-3">`;
    items.forEach((iDoc) => {
      const i = iDoc.data();
      html += `<article class="menu-item"><img loading="lazy" src="${safe(i.image)}" alt="${i.name}"><h3>${i.name}</h3><p>${safe(i.description)}</p><strong>₹${i.price}</strong></article>`;
    });
    html += '</div></section>';
    wrap.innerHTML += html;
  }
}

async function loadBlogPage() {
  const holder = $('blog-list');
  if (!holder) return;
  const snap = await getDocs(query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc')));
  holder.innerHTML = '';
  snap.forEach((d) => {
    const p = d.data();
    holder.innerHTML += `<article><h3>${p.title}</h3><p>${safe(p.excerpt)}</p><small>${new Date(p.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</small></article>`;
  });
}

loadSettings();
loadPopularDishes();
loadChefSpecial();
loadReviews();
loadFaq();
loadMenuPage();
loadBlogPage();
