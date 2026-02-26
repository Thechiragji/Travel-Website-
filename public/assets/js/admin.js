import { auth, db, storage } from './firebase-init.js';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getDownloadURL, listAll, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

const $ = (id) => document.getElementById(id);
const appShell = $('admin-app');
const loginWrap = $('login-wrap');

function section(name) {
  document.querySelectorAll('.admin-panel').forEach((p) => p.classList.remove('active'));
  $(`panel-${name}`).classList.add('active');
}
document.querySelectorAll('[data-panel]').forEach((btn) => btn.addEventListener('click', () => section(btn.dataset.panel)));

$('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  await signInWithEmailAndPassword(auth, data.email, data.password);
});
$('logout-btn')?.addEventListener('click', () => signOut(auth));

$('bootstrap-admin')?.addEventListener('click', async () => {
  const email = prompt('Admin email');
  const password = prompt('Admin password (min 6)');
  if (!email || !password) return;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'admins', cred.user.uid), { email, role: 'superadmin', createdAt: serverTimestamp() });
  alert('Admin created.');
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    appShell.classList.add('hidden');
    loginWrap.classList.remove('hidden');
    return;
  }
  const adminSnap = await getDoc(doc(db, 'admins', user.uid));
  if (!adminSnap.exists()) {
    await signOut(auth);
    return;
  }
  loginWrap.classList.add('hidden');
  appShell.classList.remove('hidden');
  loadDashboard();
  loadCategories();
  loadMenuItems();
  loadReservations();
  loadSettings();
  loadMedia();
  loadBlog();
});

async function loadDashboard() {
  const all = await getDocs(collection(db, 'reservations'));
  const today = new Date().toISOString().slice(0, 10);
  $('metric-total-bookings').textContent = all.size;
  $('metric-today-bookings').textContent = all.docs.filter((d) => d.data().date === today).length;
  const pop = await getDocs(query(collection(db, 'menuItems'), where('popular', '==', true), limit(5)));
  $('metric-popular-dishes').textContent = pop.size;
}

$('category-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  await setDoc(doc(db, 'menuCategories', d.id || crypto.randomUUID()), { name: d.name, order: Number(d.order) || 0 });
  e.target.reset();
  loadCategories();
});

async function loadCategories() {
  const list = $('category-list');
  const snap = await getDocs(query(collection(db, 'menuCategories'), orderBy('order')));
  let options = '';
  list.innerHTML = '';
  snap.forEach((d) => {
    const c = d.data();
    options += `<option value="${d.id}">${c.name}</option>`;
    list.innerHTML += `<li>${c.name} <button data-del-cat="${d.id}">Delete</button></li>`;
  });
  $('menu-categoryId').innerHTML = options;
  list.querySelectorAll('button').forEach((b) => b.addEventListener('click', async () => {
    await deleteDoc(doc(db, 'menuCategories', b.dataset.delCat));
    loadCategories();
  }));
}

$('menu-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const d = Object.fromEntries(new FormData(f).entries());
  let imageUrl = d.existingImage || '';
  const file = $('menu-image').files[0];
  if (file) {
    const path = `menu/${Date.now()}-${file.name}`;
    const sRef = ref(storage, path);
    await uploadBytes(sRef, file);
    imageUrl = await getDownloadURL(sRef);
  }
  const id = d.id || crypto.randomUUID();
  await setDoc(doc(db, 'menuItems', id), {
    categoryId: d.categoryId,
    name: d.name,
    description: d.description,
    price: Number(d.price),
    image: imageUrl,
    available: d.available === 'on',
    popular: d.popular === 'on',
    updatedAt: serverTimestamp()
  });
  f.reset();
  loadMenuItems();
});

async function loadMenuItems() {
  const body = $('menu-table-body');
  const snap = await getDocs(query(collection(db, 'menuItems'), orderBy('name')));
  body.innerHTML = '';
  snap.forEach((d) => {
    const i = d.data();
    body.innerHTML += `<tr><td>${i.name}</td><td>${i.categoryId}</td><td>₹${i.price}</td><td>${i.available ? 'Yes' : 'No'}</td><td>${i.popular ? 'Yes' : 'No'}</td><td><button data-edit-item="${d.id}">Edit</button> <button data-del-item="${d.id}">Delete</button></td></tr>`;
  });
  body.querySelectorAll('[data-del-item]').forEach((b) => b.addEventListener('click', async () => {
    await deleteDoc(doc(db, 'menuItems', b.dataset.delItem));
    loadMenuItems();
  }));
  body.querySelectorAll('[data-edit-item]').forEach((b) => b.addEventListener('click', async () => {
    const s = await getDoc(doc(db, 'menuItems', b.dataset.editItem));
    const i = s.data();
    $('menu-id').value = b.dataset.editItem;
    $('menu-name').value = i.name;
    $('menu-description').value = i.description;
    $('menu-price').value = i.price;
    $('menu-categoryId').value = i.categoryId;
    $('menu-available').checked = i.available;
    $('menu-popular').checked = i.popular;
    $('menu-existingImage').value = i.image || '';
  }));
}

$('reservation-filter')?.addEventListener('change', loadReservations);
async function loadReservations() {
  const date = $('reservation-filter').value;
  const body = $('reservation-table-body');
  const qy = date ? query(collection(db, 'reservations'), where('date', '==', date), orderBy('time')) : query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(qy);
  body.innerHTML = '';
  snap.forEach((d) => {
    const r = d.data();
    body.innerHTML += `<tr><td>${r.customerName}</td><td>${r.phone}</td><td>${r.date} ${r.time}</td><td>${r.guests}</td><td><select data-status="${d.id}"><option ${r.status==='pending'?'selected':''}>pending</option><option ${r.status==='confirmed'?'selected':''}>confirmed</option><option ${r.status==='cancelled'?'selected':''}>cancelled</option></select></td><td><button data-del-res="${d.id}">Delete</button></td></tr>`;
  });
  body.querySelectorAll('[data-del-res]').forEach((b) => b.addEventListener('click', async () => {
    await deleteDoc(doc(db, 'reservations', b.dataset.delRes));
    loadReservations();
  }));
  body.querySelectorAll('[data-status]').forEach((sel) => sel.addEventListener('change', async () => {
    await updateDoc(doc(db, 'reservations', sel.dataset.status), { status: sel.value });
  }));
}

$('content-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  d.faq = [
    { q: d.faqQ1, a: d.faqA1 },
    { q: d.faqQ2, a: d.faqA2 },
    { q: d.faqQ3, a: d.faqA3 }
  ];
  await setDoc(doc(db, 'settings', 'siteContent'), d, { merge: true });
  alert('Content saved.');
});

$('seo-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  await setDoc(doc(db, 'settings', 'seo'), d, { merge: true });
  alert('SEO saved.');
});

async function loadSettings() {
  const c = await getDoc(doc(db, 'settings', 'siteContent'));
  if (c.exists()) {
    const d = c.data();
    Object.keys(d).forEach((k) => {
      const el = document.querySelector(`[name="${k}"]`);
      if (el && typeof d[k] !== 'object') el.value = d[k];
    });
    if (Array.isArray(d.faq)) {
      d.faq.slice(0, 3).forEach((f, i) => {
        const idx = i + 1;
        if ($(`faqQ${idx}`)) $(`faqQ${idx}`).value = f.q;
        if ($(`faqA${idx}`)) $(`faqA${idx}`).value = f.a;
      });
    }
  }
  const s = await getDoc(doc(db, 'settings', 'seo'));
  if (s.exists()) {
    const d = s.data();
    if ($('metaTitle')) $('metaTitle').value = d.metaTitle || '';
    if ($('metaDescription')) $('metaDescription').value = d.metaDescription || '';
  }
}

async function loadMedia() {
  const list = $('media-list');
  if (!list) return;
  const refs = await listAll(ref(storage, 'menu'));
  list.innerHTML = '';
  for (const itemRef of refs.items) {
    const url = await getDownloadURL(itemRef);
    list.innerHTML += `<div class="card"><img loading="lazy" src="${url}" alt="media"><small>${itemRef.name}</small><button data-copy="${url}">Copy URL</button></div>`;
  }
  list.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => navigator.clipboard.writeText(b.dataset.copy)));
}

$('blog-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target).entries());
  const id = d.id || crypto.randomUUID();
  await setDoc(doc(db, 'blogPosts', id), {
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    createdAt: serverTimestamp()
  }, { merge: true });
  e.target.reset();
  loadBlog();
});

async function loadBlog() {
  const body = $('blog-table-body');
  const snap = await getDocs(query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc')));
  body.innerHTML = '';
  snap.forEach((d) => {
    const p = d.data();
    body.innerHTML += `<tr><td>${p.title}</td><td>${p.excerpt || ''}</td><td><button data-edit-blog="${d.id}">Edit</button><button data-del-blog="${d.id}">Delete</button></td></tr>`;
  });
  body.querySelectorAll('[data-del-blog]').forEach((b) => b.addEventListener('click', async () => {
    await deleteDoc(doc(db, 'blogPosts', b.dataset.delBlog));
    loadBlog();
  }));
  body.querySelectorAll('[data-edit-blog]').forEach((b) => b.addEventListener('click', async () => {
    const s = await getDoc(doc(db, 'blogPosts', b.dataset.editBlog));
    const p = s.data();
    $('blog-id').value = b.dataset.editBlog;
    $('blog-title').value = p.title;
    $('blog-excerpt').value = p.excerpt;
    $('blog-content').value = p.content;
  }));
}
