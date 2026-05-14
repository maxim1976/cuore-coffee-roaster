# VIP Annual Membership Section — Design Spec
Date: 2026-05-14

## Overview

Add a premium `#vip-plan` section between `#beans` and `#contact` in `public/index.html`.
Bilingual zh-TW/EN with i18n keys for JA and KO. Dark coffee-brown visual treatment.

---

## Content

**Title:** 《2026年度VIP年繳制優惠方案》

| Field | Value |
|---|---|
| Registration period | 即日起至 2026.06.25 |
| Active period | 2026年7月 ～ 2027年6月（一年） |
| Annual prepayment | NT$11,000 |

**Benefits (5 items):**
1. 每月5號前公布5款精品咖啡（定價NT$600–$800），任選兩款，15日前寄出
2. 生日當月收到驚喜生日禮
3. 加選咖啡豆一律85折
4. 免運費配送（7-11店到店 或 新瑞宅配到府）
5. *(Exclusion, styled as caveat)* 不適用於年節禮採購及買五送一方案

**CTA:** 加入LINE群組報名 → `https://line.me/R/ti/p/@050gvmxr`

**Constraint:** No bank account numbers on the page.

---

## HTML Structure

Inserted in `public/index.html` between `</section>` (end of `#beans`, line ~1226) and `<!-- Contact Section -->` (line ~1228):

```html
<section id="vip-plan" class="vip-section section">
  <div class="container">
    <h2 class="section-title vip-section-title">
      <span data-i18n="vip.title">2026年度VIP年繳制優惠方案</span>
      <span data-i18n="vip.title.en">VIP Annual Membership</span>
    </h2>

    <div class="vip-layout">
      <!-- Left: price card -->
      <div class="vip-card vip-card--left">
        <div class="vip-deadline-badge">
          <span data-i18n="vip.signup.label">報名期間</span>
          <strong data-i18n="vip.signup.value">即日起至 2026.06.25</strong>
        </div>
        <div class="vip-price-block">
          <span class="vip-price-label" data-i18n="vip.price.label">年繳預付</span>
          <span class="vip-price">NT$11,000</span>
        </div>
        <div class="vip-period">
          <span class="vip-period-label" data-i18n="vip.period.label">有效期間</span>
          <span class="vip-period-value" data-i18n="vip.period.value">2026年7月 ～ 2027年6月（一年）</span>
        </div>
      </div>

      <!-- Right: benefits list -->
      <div class="vip-card vip-card--right">
        <ul class="vip-benefits">
          <li class="vip-benefit"><span class="vip-check">✓</span><span data-i18n="vip.benefit.1">每月5號前公布5款精選豆，任選兩款，15日前寄出</span></li>
          <li class="vip-benefit"><span class="vip-check">✓</span><span data-i18n="vip.benefit.2">生日當月收到驚喜生日禮</span></li>
          <li class="vip-benefit"><span class="vip-check">✓</span><span data-i18n="vip.benefit.3">加選咖啡豆一律85折</span></li>
          <li class="vip-benefit"><span class="vip-check">✓</span><span data-i18n="vip.benefit.4">免運費（7-11店到店 或 新瑞宅配到府）</span></li>
          <li class="vip-benefit vip-benefit--caveat"><span class="vip-check vip-check--caveat">※</span><span data-i18n="vip.benefit.5">不適用於年節禮採購及買五送一方案</span></li>
        </ul>
      </div>
    </div>

    <div class="vip-cta-wrap">
      <a href="https://line.me/R/ti/p/@050gvmxr"
         target="_blank" rel="noopener noreferrer"
         class="btn vip-cta-btn"
         data-i18n="vip.cta">加入LINE群組報名</a>
    </div>
  </div>
</section>
```

---

## Navigation

Add to `public/index.html` navbar `<ul class="nav-links">` between beans and contact:

```html
<li><a href="#vip-plan" data-i18n="nav.vip">會員方案</a></li>
```

---

## CSS

Add to `public/assets/css/style.css` (after the beans-section block, before media queries):

```css
/* ==========================================================================
   VIP Plan Section
   ========================================================================== */
.vip-section {
  background-color: #2c1810;
}

.vip-section-title {
  color: #f5e6d3;
}
.vip-section-title span { color: rgba(245, 230, 211, 0.6); }
.vip-section-title::after {
  background: linear-gradient(90deg, #8b6914, #c4a574);
}

.vip-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 28px;
  margin-bottom: 40px;
}

.vip-card {
  border: 1px solid rgba(139, 105, 20, 0.4);
  border-radius: var(--radius-lg);
  padding: 32px;
  background: rgba(255, 255, 255, 0.04);
}

/* Left card */
.vip-deadline-badge {
  display: inline-flex;
  flex-direction: column;
  background: rgba(139, 105, 20, 0.25);
  border: 1px solid #8b6914;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 28px;
  font-size: 0.82rem;
  color: #c4a574;
}
.vip-deadline-badge strong {
  font-size: 1rem;
  color: #f5e6d3;
  margin-top: 2px;
}

.vip-price-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}
.vip-price-label {
  font-size: 0.8rem;
  color: rgba(245, 230, 211, 0.6);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.vip-price {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  color: #c4a574;
  line-height: 1;
}

.vip-period {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(139, 105, 20, 0.3);
  padding-top: 16px;
}
.vip-period-label {
  font-size: 0.78rem;
  color: rgba(245, 230, 211, 0.5);
  margin-bottom: 4px;
}
.vip-period-value {
  font-size: 0.95rem;
  color: #f5e6d3;
}

/* Right card */
.vip-benefits {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.vip-benefit {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #f5e6d3;
  font-size: 0.95rem;
  line-height: 1.5;
}
.vip-check {
  color: #c4a574;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.vip-benefit--caveat { color: rgba(245, 230, 211, 0.55); }
.vip-check--caveat { color: rgba(196, 165, 116, 0.55); }

/* CTA */
.vip-cta-wrap { text-align: center; }
.vip-cta-btn {
  display: inline-block;
  background: #8b6914;
  color: #f5e6d3;
  padding: 14px 40px;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background var(--transition-normal), transform var(--transition-normal);
}
.vip-cta-btn:hover {
  background: #c4a574;
  color: #2c1810;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .vip-layout { grid-template-columns: 1fr; }
  .vip-price { font-size: 2.2rem; }
  .vip-cta-btn { width: 100%; text-align: center; }
}
```

---

## i18n Keys

Add to all four language blocks in `public/assets/js/i18n.js`:

### zh-TW
```js
"nav.vip": "會員方案",
"vip.title": "2026年度VIP年繳制優惠方案",
"vip.title.en": "VIP Annual Membership",
"vip.signup.label": "報名期間",
"vip.signup.value": "即日起至 2026.06.25",
"vip.period.label": "有效期間",
"vip.period.value": "2026年7月 ～ 2027年6月（一年）",
"vip.price.label": "年繳預付",
"vip.benefit.1": "每月5號前公布5款精品咖啡（定價$600–$800），任選兩款，15日前寄出",
"vip.benefit.2": "生日當月收到驚喜生日禮",
"vip.benefit.3": "加選咖啡豆一律85折",
"vip.benefit.4": "免運費（7-11店到店 或 新瑞宅配到府）",
"vip.benefit.5": "不適用於年節禮採購及買五送一方案",
"vip.cta": "加入LINE群組報名",
```

### en
```js
"nav.vip": "Membership",
"vip.title": "2026 VIP Annual Membership Plan",
"vip.title.en": "VIP Annual Membership",
"vip.signup.label": "Registration",
"vip.signup.value": "Now through June 25, 2026",
"vip.period.label": "Active Period",
"vip.period.value": "July 2026 – June 2027 (one year)",
"vip.price.label": "Annual Prepayment",
"vip.benefit.1": "5 specialty coffees (NT$600–800 each) announced by the 5th — pick 2, shipped by the 15th",
"vip.benefit.2": "Surprise birthday gift in your birth month",
"vip.benefit.3": "15% off any additional bean orders",
"vip.benefit.4": "Free shipping (7-Eleven pickup or home delivery)",
"vip.benefit.5": "Not applicable to holiday gift orders or buy-5-get-1 promotions",
"vip.cta": "Join LINE Group to Sign Up",
```

### ja
```js
"nav.vip": "メンバー",
"vip.title": "2026年度VIPプラン",
"vip.title.en": "VIP Annual Membership",
"vip.signup.label": "受付期間",
"vip.signup.value": "本日より2026年6月25日まで",
"vip.period.label": "有効期間",
"vip.period.value": "2026年7月〜2027年6月（1年間）",
"vip.price.label": "年払い",
"vip.benefit.1": "毎月5日までに5種（NT$600–800）発表、2種選択、15日までに発送",
"vip.benefit.2": "誕生月にサプライズギフトをお届け",
"vip.benefit.3": "追加注文は15%割引",
"vip.benefit.4": "送料無料（コンビニ受取または宅配）",
"vip.benefit.5": "年末年始ギフト・5個購入で1個無料は対象外",
"vip.cta": "LINEグループで申し込む",
```

### ko
```js
"nav.vip": "회원 혜택",
"vip.title": "2026 VIP 연간 플랜",
"vip.title.en": "VIP Annual Membership",
"vip.signup.label": "신청 기간",
"vip.signup.value": "지금 ~ 2026년 6월 25일",
"vip.period.label": "유효 기간",
"vip.period.value": "2026년 7월 ~ 2027년 6월 (1년)",
"vip.price.label": "연간 선납",
"vip.benefit.1": "매월 5일 전 5종(NT$600–800) 공개, 2종 선택, 15일 전 발송",
"vip.benefit.2": "생일 달에 서프라이즈 선물",
"vip.benefit.3": "추가 원두 주문 15% 할인",
"vip.benefit.4": "무료 배송 (편의점 픽업 또는 택배)",
"vip.benefit.5": "명절 선물 및 5+1 행사 미적용",
"vip.cta": "LINE 그룹으로 신청하기",
```

---

## Implementation Checklist

- [ ] Add i18n keys to all four language blocks in `i18n.js`
- [ ] Add `#vip-plan` nav link in `index.html`
- [ ] Insert `#vip-plan` section HTML between `#beans` and `#contact`
- [ ] Add VIP CSS block to `style.css`
- [ ] Verify section renders correctly on mobile (< 768px)
- [ ] Verify language switching updates all `data-i18n` targets in the section
- [ ] Confirm no bank account numbers appear anywhere in the section
