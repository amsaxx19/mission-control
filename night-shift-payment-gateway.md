# 🏦 PAYMENT GATEWAY DECISION — Xendit vs Midtrans

> Research Date: Feb 2, 2026 (Night Shift)
> Status: COMPLETE — Recommendation Included
> For: CuanBoss MVP Integration

---

## 📊 QUICK COMPARISON

| Feature | Xendit | Midtrans |
|---------|--------|----------|
| **Virtual Account** | Rp 4.500-5.000 | Rp 4.000-5.000 |
| **QRIS** | 0.63% | 0.7% |
| **GoPay** | 2% | 2% |
| **Credit Card** | 2.9% + Rp 2.000 | 2.9% + Rp 2.000 |
| **ShopeePay** | 2% (retail), 3.6% (digital) | 1.5-2% |
| **OVO** | 2.73-3.18% | Not prominently listed |
| **Setup Fee** | FREE | FREE |
| **Monthly Fee** | FREE | FREE |
| **Integration** | REST API, well documented | REST API, well documented |
| **Sandbox** | Available | Available |

---

## 💰 DETAILED PRICING BREAKDOWN

### XENDIT (IDR)

| Payment Method | Fee | Notes |
|----------------|-----|-------|
| Virtual Account (all banks) | Rp 4.500-5.000/transaction | Flat fee |
| QRIS | 0.63% | Cheapest QRIS option |
| GoPay | 2% | Standard e-wallet rate |
| OVO | 2.73% (local), 3.18% (foreign digital) | Higher for digital content |
| ShopeePay | 2% (retail), 3.6% (digital content) | Digital content = higher |
| Credit Card | 2.9% + Rp 2.000 | Standard |
| Kredivo | 2.3% | PayLater |
| Akulaku | 1.7% | PayLater |
| UangMe | 1.8% | PayLater |
| Indomaret/Alfa | Rp 5.000-7.000 | OTC (Over The Counter) |

**Xendit Strengths:**
- QRIS paling murah (0.63%)
- XenPlatform khusus marketplace (split payment)
- 100+ payment methods SEA
- Strong fraud detection
- Early settlement available (accelerate cash flow)

---

### MIDTRANS (IDR)

| Payment Method | Fee | Notes |
|----------------|-----|-------|
| Virtual Account | Rp 4.000/transaction | Slightly cheaper |
| QRIS | 0.7% | Slightly higher than Xendit |
| GoPay | 2% | Same as Xendit |
| ShopeePay | 1.5-2% | Cheaper for digital products |
| DANA | 1.5% | Lower than Xendit |
| Credit Card | 2.9% + Rp 2.000 | Same as Xendit |
| Indomaret/Alfa | Rp 5.000 | OTC |
| Akulaku | 1.7% | Same |
| Kredivo | 2% | Slightly lower than Xendit |
| Direct Debit (BCA, BRI) | Rp 2.200-5.000 | Bank transfer direct |

**Midtrans Strengths:**
- Bank transfer VA slightly cheaper (Rp 4.000 vs Rp 4.500)
- ShopeePay & DANA cheaper for digital content
- Part of Gojek ecosystem (GoPay integration seamless)
- Simple integration (Snap API)
- GoPay Mini App ecosystem

---

## 🎯 RECOMMENDATION FOR CUANBOSS

### WINNER: **XENDIT** ✅

**Reasons:**

1. **XenPlatform = Perfect for CuanBoss**
   - Built-in marketplace infrastructure
   - Automatic seller payout (split payment)
   - Escrow capability
   - Multi-seller disbursement
   - This is EXACTLY what CuanBoss needs

2. **QRIS Pricing Advantage**
   - 0.63% vs 0.7% (Midtrans)
   - Small difference tapi scale besar = significant

3. **Fraud Detection**
   - Xendit known for strong fraud protection
   - Important untuk digital products (high fraud risk)

4. **SEA Expansion Ready**
   - Xendit support Philippines, Malaysia, Thailand, Vietnam
   - Midtrans mostly Indonesia only
   - CuanBoss bisa expand ke SEA nanti

5. **Early Settlement**
   - Cash flow acceleration
   - Sellers get paid faster = happy sellers

---

## ⚠️ WHEN TO CHOOSE MIDTRANS?

**Pick Midtrans if:**
- Lu fokus 100% Indonesia only
- Lu udah deep integration dengan GoPay ecosystem
- ShopeePay/DANA adalah payment method utama (cheaper rates)
- Lu mau simple simple aja (Midtrans slightly easier setup)

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Setup (Week 1)
- [ ] Register Xendit account (business)
- [ ] Complete KYC verification
- [ ] Activate XenPlatform (request access)
- [ ] Setup sandbox environment
- [ ] Test API integration

### Phase 2: Integration (Week 2)
- [ ] Install Xendit SDK/REST API
- [ ] Build payment flow (buyer → checkout → payment)
- [ ] Build seller onboarding (KYC, bank setup)
- [ ] Implement webhook handlers
- [ ] Test with sandbox transactions

### Phase 3: XenPlatform Setup (Week 3)
- [ ] Configure XenPlatform for marketplace
- [ ] Setup seller payout automation
- [ ] Configure escrow rules
- [ ] Test split payment (buyer → CuanBoss → Seller)
- [ ] Test disbursement timing

### Phase 4: Go Live (Week 4)
- [ ] Switch to production API keys
- [ ] Beta test with 10 sellers
- [ ] Monitor transactions
- [ ] Optimize settlement timing

---

## 📋 CUANBOSS SPECIFIC SETUP

**Business Model:** Marketplace (Seller → Platform → Buyer)

**XenPlatform Configuration:**
- Platform fee: 15% (Free tier) / 8% (Pro) / 5% (Business)
- Settlement: T+1 (daily) atau T+7 (weekly)
- Escrow: Release upon delivery confirmation (untuk services)
- Instant release (untuk digital products)

**Payment Methods to Enable:**
1. Virtual Account (all major banks) — Rp 4.500
2. QRIS — 0.63%
3. GoPay — 2%
4. Credit Card — 2.9% + Rp 2.000
5. ShopeePay — 2%

**Estimated Cost per Rp 100.000 Transaction:**
- VA: Rp 4.500 (4.5%)
- QRIS: Rp 630 (0.63%)
- GoPay: Rp 2.000 (2%)
- CC: Rp 2.900 + Rp 2.000 = Rp 4.900 (4.9%)

**With CuanBoss 15% fee:**
- Seller gets: Rp 85.000 - payment fee
- Example VA: Rp 85.000 - Rp 4.500 = Rp 80.500 nett

---

## 🔗 USEFUL LINKS

**Xendit:**
- Docs: https://docs.xendit.co.id/
- API Reference: https://developers.xendit.co.id/
- XenPlatform: https://www.xendit.co/id/products/xenplatform/

**Midtrans (Comparison Only):**
- Docs: https://docs.midtrans.com/

---

## ✅ FINAL DECISION

**USE XENDIT**

XenPlatform adalah game-changer untuk CuanBoss. Fitur marketplace-nya jauh lebih mature dibanding Midtrans yang lebih fokus ke simple payment gateway.

**Next Action:** Register Xendit besok dan apply XenPlatform access.

---

*Compiled by Jarvis (Night Shift)*
*Feb 2, 2026 21:00 WIB*