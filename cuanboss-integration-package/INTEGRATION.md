# CuanBoss Email Integration - Copy-Paste Ready

## 📦 Files to Copy

Copy these folders ke project CuanBoss lu:

```
src/
├── email/
│   ├── templates/
│   │   ├── OrderConfirmation.tsx
│   │   ├── ProductSold.tsx
│   │   ├── PayoutNotification.tsx
│   │   ├── WelcomeSeller.tsx
│   │   ├── PasswordReset.tsx
│   │   └── components/
│   │       └── EmailLayout.tsx
│   └── services/
│       ├── resend.ts
│       ├── orderEmails.ts
│       ├── sellerEmails.ts
│       └── onboardingEmails.ts
└── api/
    └── midtrans-webhook.ts (UPDATE INI)
```

## ⚡ Quick Integration (5 Menit)

### 1. Install Dependencies
```bash
npm install resend react-email @react-email/components
```

### 2. Environment Variables
Tambahin ke `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=noreply@cuanboss.id
EMAIL_FROM_NAME="CuanBoss"
```

### 3. Update Midtrans Webhook

Cari file webhook Midtrans lu (biasanya di `src/app/api/webhook/midtrans/route.ts` atau similar).

**Tambahin ini di ATAS file:**
```typescript
import { handlePaymentSuccess } from '@/email/api/midtrans-integration';
```

**Cari bagian "payment success" — biasanya kaya gini:**
```typescript
// Cari code kaya ini di webhook lu:
if (transaction_status === 'capture' || transaction_status === 'settlement') {
  // Update order status...
}
```

**Ganti jadi:**
```typescript
if (transaction_status === 'capture' || transaction_status === 'settlement') {
  // Update order status...
  await updateOrderStatus(orderId, 'paid');
  
  // ✅ KIRIM EMAIL (tambahin ini)
  await handlePaymentSuccess(orderId);
}
```

Done! 🎉

## 🧪 Test

1. Login Resend: https://resend.com
2. Verify domain cuanboss.id
3. Create API key, paste ke `.env.local`
4. Jalankan test: `npx tsx src/email/test-emails.ts`

## 📁 File Structure (Setelah Copy)

```
cuanboss/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── webhook/
│   │           └── midtrans/
│   │               └── route.ts  ← UPDATE INI
│   └── email/                     ← COPY FOLDER INI
│       ├── templates/
│       ├── services/
│       ├── api/
│       │   └── midtrans-integration.ts
│       └── test-emails.ts
```

## 🎯 Yang Bakal Terjadi

Setiap ada pembayaran sukses:
1. Buyer dapet email konfirmasi + link download
2. Seller dapet email "Produk lu laku!"
3. Semua otomatis, ga perlu manual

## ❓ Troubleshooting

**"Module not found"**
→ Pastiin path import bener. Sesuaikan sama struktur project lu.

**"Resend API key invalid"**
→ Cek API key di Resend dashboard, pastiin domain udah verified.

**"Email ga kekirim"**
→ Cek logs, pastiin `handlePaymentSuccess()` dipanggil.

---

Butuh bantuan? Send error log ke gw.