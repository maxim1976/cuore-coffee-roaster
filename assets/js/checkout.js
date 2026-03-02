/* ============================================================
   checkout.js — Form validation + POST to /api/checkout
   ============================================================ */

const ERRORS = {
  'zh-TW': {
    name:     '請填寫收件人姓名',
    phone:    '手機格式不正確（09xxxxxxxx）',
    email:    '電子郵件格式不正確',
    shipping: '請選擇配送方式',
    address:  '請填寫收件地址',
    cvsStore: '請選擇超商',
    cvsName:  '請填寫門市名稱',
    empty:    '購物車是空的',
    server:   '伺服器錯誤，請稍後再試',
  },
  en: {
    name:     'Please enter your name',
    phone:    'Invalid mobile number (09xxxxxxxx)',
    email:    'Invalid email address',
    shipping: 'Please select a delivery method',
    address:  'Please enter a delivery address',
    cvsStore: 'Please select a convenience store',
    cvsName:  'Please enter the store name',
    empty:    'Your cart is empty',
    server:   'Server error, please try again',
  },
};

function getErrors() {
  const lang = localStorage.getItem('cuore-lang') || 'en';
  return ERRORS[lang === 'zh-TW' ? 'zh-TW' : 'en'];
}

document.getElementById('checkoutForm').addEventListener('submit', async e => {
  e.preventDefault();

  const err      = getErrors();
  const errorEl  = document.getElementById('formError');
  errorEl.style.display = 'none';

  const name      = document.getElementById('cusName').value.trim();
  const phone     = document.getElementById('cusPhone').value.trim();
  const email     = document.getElementById('cusEmail').value.trim();
  const method    = document.querySelector('input[name="shipping"]:checked')?.value;
  const address   = document.getElementById('cusAddress').value.trim();
  const cvsStore  = document.getElementById('cvsStore').value;
  const cvsName   = document.getElementById('cvsStoreName').value.trim();
  const note      = document.getElementById('cusNote').value.trim();

  if (!name)                                      return showError(err.name);
  if (!/^09\d{8}$/.test(phone))                  return showError(err.phone);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(err.email);
  if (!method)                                    return showError(err.shipping);
  if (method === 'delivery' && !address)          return showError(err.address);
  if (method === 'cvs' && !cvsStore)              return showError(err.cvsStore);
  if (method === 'cvs' && !cvsName)               return showError(err.cvsName);

  const cart = getCart();
  if (!cart.length) return showError(err.empty);

  const items = cart.map(i => ({
    sku:   i.sku,
    name:  `${i.name_zh}（${i.grind}/${i.weight}g）`,
    price: i.price,
    qty:   i.qty,
  }));

  const shipping = { method };
  if (method === 'delivery') shipping.address      = address;
  if (method === 'cvs')      { shipping.cvsStore = cvsStore; shipping.cvsStoreName = cvsName; }

  const customer = { name, phone, email, note };

  const btn      = document.getElementById('checkoutBtn');
  const btnSpan  = btn.querySelector('[data-i18n="shop.checkout.btn"]') || btn;
  btn.disabled   = true;
  btnSpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${window.i18n?.t('shop.checkout.processing', localStorage.getItem('cuore-lang') || 'en') || 'Processing...'}`;

  try {
    const res = await fetch('/api/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items, customer, shipping }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || err.server);
    }

    // Server returns HTML that auto-submits to ECPay
    const html = await res.text();
    document.open();
    document.write(html);
    document.close();

  } catch (e) {
    showError(e.message);
    btn.disabled   = false;
    btnSpan.innerHTML = `<i class="fas fa-lock"></i> ${window.i18n?.t('shop.checkout.btn', localStorage.getItem('cuore-lang') || 'en') || 'Proceed to Pay'}`;
  }

  function showError(msg) {
    errorEl.textContent   = msg;
    errorEl.style.display = 'block';
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
