
/* SAKANY | واجهة تجريبية تفاعلية - جميع البيانات محلية على الجهاز */

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = 'sakany-properties-v2';
const IMAGE_KEY = 'sakany-images-v2';

/* قراءة الصور من ملف HTML */
function getImage(key) {
  const image = document.querySelector(
    `#imageAssets [data-image="${key}"]`
  );

  return image?.getAttribute('src') || '';
}

const DEFAULT_HERO = getImage('hero');
const DEFAULT_IMAGE = getImage('house1');

/* سعر السرير الواحد */
const BED_PRICE = 800;

/* العقارات التجريبية */
const seedProperties = [

  {
    id: 1,
    title: 'شقة عصرية بإضاءة طبيعية',
    area: 'الإسكان الاجتماعي',
    type: 'شقة كاملة',
    price: 4800,
    rooms: 2,
    baths: 1,
    size: 95,
    image: getImage('house1'),
    description: 'شقة مريحة بتقسيم عملي وإضاءة طبيعية. تضم مساحة معيشة ومطبخًا وحمامًا، ومناسبة لأسرة صغيرة.',
    phone: '0103119016',
    tag: 'اختيار مميز'
  },

  {
    id: 2,
    title: 'غرفة مفروشة للطلاب',
    area: 'الإسكان القومي',
    type: 'غرفة',
    price: 1200,
    rooms: 1,
    baths: 1,
    size: 22,
    image: getImage('house2'),
    description: 'غرفة مفروشة بسرير ودولاب ومكتب. يرجى تأكيد التوافر والخدمات المشمولة مع المعلن.',
    phone: '0103119016',
    tag: 'مناسبة للطلاب'
  },

  {
    id: 3,
    title: 'سكن مشترك هادئ ومنظم',
    area: 'إسكان البنك',
    type: 'سكن مشترك',
    price: 6200,
    rooms: 2,
    baths: 1,
    size: 70,
    image: getImage('house3'),
    description: 'سكن مشترك بمساحات منظمة ومطبخ وحمام مشترك. مناسب لمن يبحث عن تكلفة اقتصادية.',
    phone: '0103119016',
    tag: 'سعر اقتصادي'
  },

  {
    id: 4,
    title: 'سرير داخل غرفة مجهزة',
    area: 'مدينة الشمس',
    type: 'سرير داخل غرفة',
    price: 800,
    beds: 1,
    rooms: 1,
    baths: 1,
    size: 18,
    image: getImage('house4'),
    description: 'سرير داخل غرفة مشتركة بسعر 800 جنيه شهريًا للسرير الواحد.',
    phone: '0103119016',
    tag: '800 جنيه للسرير'
  },

  {
    id: 5,
    title: 'شقة واسعة للعائلات',
    area: 'الإسكان الاجتماعي',
    type: 'شقة كاملة',
    price: 5500,
    rooms: 3,
    baths: 1,
    size: 115,
    image: getImage('house5'),
    description: 'شقة واسعة بتقسيم عملي وثلاث غرف ومساحة معيشة مناسبة للأسرة.',
    phone: '0103119016',
    tag: 'مساحة واسعة'
  },

  {
    id: 6,
    title: 'غرفة خاصة بخصوصية وهدوء',
    area: 'الإسكان القومي',
    type: 'غرفة',
    price: 1500,
    rooms: 1,
    baths: 1,
    size: 28,
    image: getImage('house6'),
    description: 'غرفة خاصة بمساحة مناسبة للإقامة الفردية. استفسر عن الأثاث والمرافق المتاحة.',
    phone: '0103119016',
    tag: 'غرفة خاصة'
  }

];

/* تنسيق الأسعار */
const money = n =>
  new Intl.NumberFormat('ar-EG').format(Number(n) || 0);

const grid = $('propertyGrid');

/* تحميل العقارات من التخزين المحلي */
function loadProperties() {

  try {

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved)) {

      return saved.map(p => {

        let area = p.area;

        /* تحويل أسماء المناطق القديمة */
        if (area === 'المساكن') {
          area = 'الإسكان الاجتماعي';
        }

        if (area === 'مدينة طيبة') {
          area = 'الإسكان القومي';
        }

        /* تحديث أسعار الأسرّة القديمة */
        if (p.type === 'سرير داخل غرفة') {

          const beds = Math.max(
            1,
            Number(p.beds) || 1
          );

          return {
            ...p,
            area,
            beds,
            price: beds * BED_PRICE,
            tag: `${beds} سرير - ${money(beds * BED_PRICE)} جنيه`
          };

        }

        return {
          ...p,
          area
        };

      });

    }

    return seedProperties.map(p => ({ ...p }));

  } catch {

    return seedProperties.map(p => ({ ...p }));

  }

}

let properties = loadProperties();

let pendingImageTarget = null;
let adminAuthenticated = false;

const ADMIN_USERNAME = 'karim';
const ADMIN_PASSWORD = '2002';

/* حفظ العقارات */
function saveProperties() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(properties)
    );

  } catch {

    showToast('مساحة التخزين ممتلئة؛ جرّب صورة أصغر.');

  }

}

/* حماية النصوص */
function escapeHtml(s = '') {

  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

}

/* رسائل التنبيه */
function showToast(msg) {

  const t = $('toast');

  t.textContent = msg;
  t.classList.add('show');

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    t.classList.remove('show');
  }, 2800);

}

/* عرض عدد الأسرّة أو الغرف */
function getPropertyCountText(p) {

  if (p.type === 'سرير داخل غرفة') {
    const beds = Math.max(1, Number(p.beds) || 1);
    return `${money(beds)} سرير`;
  }

  return `${money(p.rooms || 1)} غرفة`;

}

/* عرض العقارات */
function renderProperties() {

  const area = $('areaFilter').value;
  const type = $('typeFilter').value;
  const min = Number($('priceFilter').value);
  const sort = $('sortFilter').value;

  let list = properties.filter(p =>
    (area === 'all' || p.area === area) &&
    (type === 'all' || p.type === type) &&
    Number(p.price) >= min
  );

  if (sort === 'low' || sort === 'recommended') {

    list.sort((a, b) => a.price - b.price);

  } else if (sort === 'high') {

    list.sort((a, b) => b.price - a.price);

  }

  $('resultCount').textContent =
    `${money(list.length)} إعلانات متاحة في مدينة طيبة`;

  $('emptyState').hidden = !!list.length;

  grid.innerHTML = list.map(p => `

    <article class="property-card" data-id="${p.id}">

      <div class="property-image">

        <img
          src="${escapeHtml(p.image || DEFAULT_IMAGE)}"
          alt="صورة ${escapeHtml(p.title)}"
          loading="lazy"
        >

        <span class="property-badge">
          ${escapeHtml(p.tag || p.type)}
        </span>

        <button
          class="favorite"
          data-fav="${p.id}"
          aria-label="إضافة للمفضلة"
        >
          ♡
        </button>

        <button
          class="change-photo"
          data-change-photo="${p.id}"
          aria-label="تغيير صورة العقار"
          title="تغيير الصورة"
        >
          كاميرا <span>＋</span>
        </button>

      </div>

      <div class="property-body">

        <div class="property-location">
          ⌖ ${escapeHtml(p.area)}، مدينة طيبة
        </div>

        <h3 class="property-title">
          ${escapeHtml(p.title)}
        </h3>

        <div class="property-meta">

          <span>▦ ${escapeHtml(p.type)}</span>

          <span>⌂ ${getPropertyCountText(p)}</span>

          <span>
            ◫ ${p.size ? money(p.size) + ' م²' : 'مساحة غير محددة'}
          </span>

        </div>

        <div class="property-bottom">

          <div class="property-price">
            ${money(p.price)}
            <small>جنيه / شهر</small>
          </div>

          <button class="details-link" data-details="${p.id}">
            التفاصيل <span>←</span>
          </button>

        </div>

      </div>

    </article>

  `).join('');

}

/* فتح وإغلاق النوافذ */
function openModal(id) {

  $(id).hidden = false;

  document.body.classList.add('modal-open');

  const focus = $(id).querySelector(
    'input,button,select,textarea'
  );

  if (focus) {
    setTimeout(() => focus.focus(), 50);
  }

}

function closeModal(id) {

  $(id).hidden = true;

  if (!document.querySelector('.modal-backdrop:not([hidden])')) {
    document.body.classList.remove('modal-open');
  }

}

/* تفاصيل العقار */
function showDetails(id) {

  const p = properties.find(x => x.id === Number(id));

  if (!p) return;

  $('detailsContent').innerHTML = `

    <div class="modal-kicker">
      ${escapeHtml(p.area)} · مدينة طيبة
    </div>

    <h2 id="detailsTitle">
      ${escapeHtml(p.title)}
    </h2>

    <img
      class="detail-image"
      src="${escapeHtml(p.image || DEFAULT_IMAGE)}"
      alt="${escapeHtml(p.title)}"
    >

    <div class="detail-price">
      ${money(p.price)}
      <small>جنيه مصري / شهريًا</small>
    </div>

    <div class="detail-facts">

      <span>${escapeHtml(p.type)}</span>

      <span>${getPropertyCountText(p)}</span>

      <span>${money(p.baths || 1)} حمام</span>

      <span>
        ${p.size ? money(p.size) + ' م²' : 'المساحة غير محددة'}
      </span>

    </div>

    <p class="detail-description">
      ${escapeHtml(p.description || 'لا يوجد وصف إضافي.')}
    </p>

    <a
      class="btn btn-primary contact-button"
      href="tel:${escapeHtml(p.phone)}"
    >
      اتصل بالمعلن · ${escapeHtml(p.phone)}
    </a>

    <p class="detail-description safety-note">
      عاين الوحدة وتأكد من هوية المعلن والاتفاق على جميع الشروط قبل دفع أي مبلغ.
    </p>

  `;

  openModal('detailsModal');

}

/* ضغط الصور قبل الحفظ */
function compressImage(file) {

  return new Promise((resolve, reject) => {

    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('اختار ملف صورة صالح.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('تعذر قراءة الصورة.'));
    };

    reader.onload = () => {

      const img = new Image();

      img.onerror = () => {
        reject(new Error('الصورة غير صالحة.'));
      };

      img.onload = () => {

        const max = 1400;

        const scale = Math.min(
          1,
          max / Math.max(img.width, img.height)
        );

        const canvas = document.createElement('canvas');

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        canvas.getContext('2d').drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(
          canvas.toDataURL('image/jpeg', .78)
        );

      };

      img.src = reader.result;

    };

    reader.readAsDataURL(file);

  });

}

/* اختيار صورة */
function pickImage(target) {

  pendingImageTarget = target;

  $('imagePicker').value = '';

  $('imagePicker').click();

}

/* تغيير صور الواجهة والعقارات */
$('imagePicker').addEventListener('change', async e => {

  const file = e.target.files?.[0];

  if (!file) return;

  try {

    const data = await compressImage(file);

    if (pendingImageTarget === 'hero') {

      try {

        localStorage.setItem(IMAGE_KEY, data);

      } catch {

        throw new Error('الصورة كبيرة على مساحة التخزين المتاحة.');

      }

      $('heroPhoto').src = data;

    } else {

      const p = properties.find(
        x => x.id === Number(pendingImageTarget)
      );

      if (!p) return;

      p.image = data;

      saveProperties();

      renderProperties();

    }

    showToast('تم تحديث الصورة على هذا الجهاز.');

  } catch (err) {

    showToast(err.message || 'تعذر تغيير الصورة.');

  } finally {

    pendingImageTarget = null;

  }

});

/* استعادة صورة الواجهة */
function restoreHero() {

  let src = DEFAULT_HERO;

  try {

    src = localStorage.getItem(IMAGE_KEY) || DEFAULT_HERO;

  } catch {}

  $('heroPhoto').src = src;

}

/* البحث */
$('searchButton').addEventListener('click', () => {

  $('listings').scrollIntoView({
    behavior: 'smooth'
  });

  renderProperties();

});

/* الفلاتر */
[
  'areaFilter',
  'typeFilter',
  'priceFilter',
  'sortFilter'
].forEach(id => {

  $(id).addEventListener('change', renderProperties);

});

/* إعادة ضبط البحث */
function resetFilters() {

  $('areaFilter').value = 'all';
  $('typeFilter').value = 'all';
  $('priceFilter').value = '700';
  $('sortFilter').value = 'recommended';

  renderProperties();

}

$('resetFilters').addEventListener('click', resetFilters);

$('clearEmpty').addEventListener('click', resetFilters);

/* أزرار العقارات */
grid.addEventListener('click', e => {

  const photo = e.target.closest('[data-change-photo]');

  if (photo) {

    pickImage(photo.dataset.changePhoto);

    return;

  }

  const fav = e.target.closest('[data-fav]');

  if (fav) {

    fav.classList.toggle('saved');

    fav.textContent = fav.classList.contains('saved')
      ? '♥'
      : '♡';

    return;

  }

  const detail = e.target.closest('[data-details]');

  const card = e.target.closest('.property-card');

  if (detail || card) {

    showDetails(
      detail?.dataset.details || card.dataset.id
    );

  }

});

/* تغيير صورة الواجهة */
$('heroChangePhoto').addEventListener('click', () => {
  pickImage('hero');
});

/* تسجيل الدخول وإضافة إعلان */
function requestAddAccess() {

  if (adminAuthenticated) {

    openModal('addModal');

    return;

  }

  $('adminLoginError').hidden = true;

  $('adminLoginForm').reset();

  openModal('adminLoginModal');

}

[
  'openAddTop',
  'openAddBanner'
].forEach(id => {

  $(id).addEventListener('click', requestAddAccess);

});

/* التحقق من بيانات الأدمن */
$('adminLoginForm').addEventListener('submit', e => {

  e.preventDefault();

  const data = new FormData(e.currentTarget);

  const username = String(
    data.get('username') || ''
  ).trim();

  const password = String(
    data.get('password') || ''
  );

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {

    adminAuthenticated = true;

    $('adminLoginError').hidden = true;

    closeModal('adminLoginModal');

    openModal('addModal');

    showToast('تم تسجيل الدخول بنجاح. تقدر تضيف إعلانك الآن.');

  } else {

    $('adminLoginError').hidden = false;

    $('adminLoginForm').elements.password.value = '';

    $('adminLoginForm').elements.password.focus();

  }

});

/* إغلاق النوافذ */
document.querySelectorAll('[data-close]').forEach(b => {

  b.addEventListener('click', () => {
    closeModal(b.dataset.close);
  });

});

document.querySelectorAll('.modal-backdrop').forEach(back => {

  back.addEventListener('click', e => {

    if (e.target === back) {
      closeModal(back.id);
    }

  });

});

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {

    document
      .querySelectorAll('.modal-backdrop:not([hidden])')
      .forEach(m => closeModal(m.id));

  }

});

/* معاينة صورة الإعلان */
$('addImage').addEventListener('change', async e => {

  const file = e.target.files?.[0];

  if (!file) return;

  try {

    $('newImageData').value = await compressImage(file);

    $('imagePreview').innerHTML = `
      <img
        src="${$('newImageData').value}"
        alt="معاينة صورة الإعلان"
      >
    `;

    $('imagePreview').classList.add('has-image');

  } catch (err) {

    showToast(err.message);

  }

});

/* حساب سعر السرير تلقائيًا */
const propertyType = document.querySelector('#addForm [name="type"]');
const propertyPrice = $('propertyPrice');
const bedCount = $('bedCount');
const bedCountField = $('bedCountField');
const roomCountField = $('roomCountField');

function updateBedPrice() {

  if (!propertyType || !propertyPrice || !bedCount) return;

  const isBed = propertyType.value === 'سرير داخل غرفة';

  if (bedCountField) {
    bedCountField.hidden = !isBed;
  }

  if (roomCountField) {
    roomCountField.hidden = isBed;
  }

  propertyPrice.readOnly = isBed;

  if (isBed) {

    const beds = Math.max(
      1,
      Number(bedCount.value) || 1
    );

    propertyPrice.value = beds * BED_PRICE;

  } else {

    propertyPrice.value = '';

  }

}

propertyType?.addEventListener('change', updateBedPrice);

bedCount?.addEventListener('input', updateBedPrice);

/* إضافة إعلان جديد */
$('addForm').addEventListener('submit', e => {

  e.preventDefault();

  if (!adminAuthenticated) {

    closeModal('addModal');

    requestAddAccess();

    return;

  }

  const f = new FormData(e.currentTarget);

  const phone = String(
    f.get('phone')
  ).replace(/[\s-]/g, '');

  if (!/^(\+?20)?01[0125][0-9]{8}$/.test(phone)) {

    showToast('من فضلك أدخل رقم موبايل مصري صحيح.');

    return;

  }

  const type = f.get('type');

  const beds = Math.max(
    1,
    Number(f.get('beds')) || 1
  );

  const price = type === 'سرير داخل غرفة'
    ? beds * BED_PRICE
    : Number(f.get('price'));

  if (!price || price < 700) {

    showToast('الحد الأدنى للسعر هو 700 جنيه شهريًا.');

    return;

  }

  const p = {

    id: Date.now(),

    title: String(
      f.get('title')
    ).trim(),

    area: f.get('area'),

    type,

    price,

    beds: type === 'سرير داخل غرفة' ? beds : 0,

    rooms: Number(f.get('rooms')) || 1,

    baths: 1,

    size: Number(f.get('size')) || 0,

    image: $('newImageData').value || DEFAULT_IMAGE,

    description:
      String(f.get('description')).trim() ||
      'لم يضف المعلن وصفًا إضافيًا.',

    phone,

    tag: type === 'سرير داخل غرفة'
      ? `${beds} سرير - ${money(price)} جنيه`
      : 'إعلان تجريبي'

  };

  properties.unshift(p);

  saveProperties();

  renderProperties();

  e.currentTarget.reset();

  $('newImageData').value = '';

  $('imagePreview').innerHTML = '';

  $('imagePreview').classList.remove('has-image');

  updateBedPrice();

  closeModal('addModal');

  resetFilters();

  $('listings').scrollIntoView({
    behavior: 'smooth'
  });

  showToast('تمت إضافة إعلانك وحفظه على هذا الجهاز.');

});

/* القائمة في الهاتف */
$('menuToggle').addEventListener('click', () => {

  const nav = document.querySelector('.desktop-nav');

  const opened = nav.classList.toggle('open');

  $('menuToggle').setAttribute(
    'aria-expanded',
    String(opened)
  );

});

document.querySelectorAll('.desktop-nav a').forEach(a => {

  a.addEventListener('click', () => {

    document.querySelector('.desktop-nav').classList.remove('open');

    $('menuToggle').setAttribute('aria-expanded', 'false');

  });

});

/* تشغيل الموقع */
restoreHero();

/* حفظ الأسعار بعد تحديث الإعلانات القديمة */
saveProperties();

updateBedPrice();

renderProperties();
