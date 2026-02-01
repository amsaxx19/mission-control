# 💳 CuanBoss Payment Gateway

Complete payment solution for the CuanBoss creator marketplace platform.

## ✨ Features

- **Dual Gateway Support**: Midtrans + Xendit with automatic failover
- **15% Platform Fee**: Automatically calculated and deducted
- **Seller Payouts**: Direct bank transfer to sellers
- **Webhooks**: Secure, verified payment notifications
- **Onboarding Flow**: Complete KYC and bank setup for sellers
- **React Components**: Ready-to-use payment UI components
- **TypeScript**: Fully typed for better DX

## 🚀 Supported Payment Methods

### Indonesia
- 💳 **Virtual Account**: BCA, BNI, BRI, Mandiri, Permata
- 📱 **E-Wallet**: GoPay, OVO, DANA, ShopeePay, LinkAja
- 📷 **QRIS**: All supported wallets
- 💰 **Retail**: Alfamart, Indomaret
- 💎 **Credit Card**: Visa, Mastercard, JCB

## 📦 Installation

```bash
npm install @cuanboss/payment-gateway
```

## 🎯 Quick Example

```typescript
import { MidtransClient } from '@cuanboss/payment-gateway';

const midtrans = new MidtransClient({
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  isProduction: false,
});

// Create payment
const snap = await midtrans.createSnapTransaction({
  transactionDetails: {
    orderId: 'ORDER-123',
    grossAmount: 299000,
  },
  customerDetails: {
    firstName: 'John',
    email: 'john@example.com',
    phone: '081234567890',
  },
});

// Redirect to payment
window.location.href = snap.redirectUrl;
```

## 📚 Documentation

- [Integration Guide](./docs/INTEGRATION.md) - Complete setup instructions
- [API Reference](./docs/API.md) - Detailed API documentation
- [React Components](./docs/COMPONENTS.md) - UI component usage

## 🏗️ Architecture

```
┌─────────────────┐
│  CuanBoss App   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│Midtrans│  │Xendit │
└────────┘  └───────┘
    │         │
    └────┬────┘
         │
    ┌────┴────┐
    │ Webhooks│
    └────┬────┘
         │
    ┌────┴────┐
    │Supabase │
    └─────────┘
```

## 🎨 React Components

```tsx
import { PaymentMethodsSelector, CheckoutButton } from '@cuanboss/payment-gateway';

function Checkout() {
  const [method, setMethod] = useState();
  
  return (
    <>
      <PaymentMethodsSelector 
        amount={299000} 
        onSelect={setMethod}
        selectedMethod={method?.id}
      />
      <CheckoutButton 
        productId="prod_123"
        productName="Kelas TikTok"
        price={299000}
        sellerId="seller_456"
        buyerId={user.id}
        selectedMethod={method}
      />
    </>
  );
}
```

## 💰 Fee Calculation

```
Product Price:    Rp 100,000
Platform Fee:     -  Rp 15,000  (15%)
Processing Fee:   -  Rp 0-2,900 (depends on method)
─────────────────────────────────────
Seller Receives:  Rp 82,100-85,000
```

## 🔐 Security

- Webhook signature verification
- Server-side payment initialization only
- Encrypted API keys
- Audit logging
- Rate limiting

## 🧪 Testing

```bash
# Run tests
npm test

# Run typecheck
npm run typecheck
```

## 📄 License

MIT © CuanBoss

---

Built for creators, by creators 🚀
