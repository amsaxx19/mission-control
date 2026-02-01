# CuanBoss Payment Gateway - Integration Guide

Complete payment solution for CuanBoss platform. Supports Midtrans and Xendit with automatic failover.

## 🚀 Quick Start

### 1. Installation

```bash
npm install @cuanboss/payment-gateway
# or
yarn add @cuanboss/payment-gateway
```

### 2. Environment Variables

Create `.env.local`:

```env
# Midtrans (Primary)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Xendit (Fallback + Payouts)
XENDIT_SECRET_KEY=xnd_development_xxxxxxxx
XENDIT_WEBHOOK_TOKEN=xxxxxxxx
XENDIT_IS_PRODUCTION=false

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxx
```

### 3. Database Setup

Run this SQL in Supabase:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  seller_earnings INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_payment',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  paid_at TIMESTAMP,
  access_granted BOOLEAN DEFAULT false,
  access_granted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sellers table
CREATE TABLE sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  social_links JSONB DEFAULT '{}',
  niche TEXT[],
  verification_status VARCHAR(50) DEFAULT 'unverified',
  onboarding_status VARCHAR(50) DEFAULT 'in_progress',
  can_sell BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seller balances
CREATE TABLE seller_balances (
  seller_id UUID PRIMARY KEY,
  available_balance INTEGER DEFAULT 0,
  pending_balance INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  last_payout_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bank accounts
CREATE TABLE seller_bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  bank_code VARCHAR(50) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  account_holder_name VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  gross_amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  seller_earnings INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payouts
CREATE TABLE payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  bank_account_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reference VARCHAR(255),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook logs
CREATE TABLE payment_webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID,
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding steps
CREATE TABLE onboarding_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  step_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  is_required BOOLEAN DEFAULT true,
  "order" INTEGER NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seller_id, step_id)
);

-- Indexes for performance
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_payouts_seller ON payouts(seller_id);
```

## 💳 Usage Examples

### Creating a Payment (Midtrans Snap)

```typescript
import { MidtransClient, createMidtransClient } from '@cuanboss/payment-gateway';

// Initialize client
const midtrans = createMidtransClient(
  process.env.MIDTRANS_SERVER_KEY!,
  process.env.MIDTRANS_CLIENT_KEY!,
  process.env.MIDTRANS_IS_PRODUCTION === 'true'
);

// Create order
const order = midtrans.createCuanBossOrder({
  orderId: 'ORDER-123',
  productId: 'PROD-456',
  productName: 'Kelas TikTok Affiliate Pro',
  productPrice: 299000,
  platformFee: 44850, // 15%
  sellerEarnings: 254150,
  buyerId: 'USER-789',
  buyerEmail: 'buyer@example.com',
  buyerName: 'John Doe',
  sellerId: 'SELLER-111',
  sellerEmail: 'seller@example.com',
  sellerName: 'Creator Name',
});

// Create Snap transaction
const snap = await midtrans.createSnapTransaction(order);

// Redirect to payment
window.location.href = snap.redirectUrl;
// OR use snap token for popup
// window.snap.pay(snap.token);
```

### Creating a Payment (Xendit Invoice)

```typescript
import { XenditClient, createXenditClient } from '@cuanboss/payment-gateway';

const xendit = createXenditClient(
  process.env.XENDIT_SECRET_KEY!,
  {
    webhookToken: process.env.XENDIT_WEBHOOK_TOKEN,
    isProduction: process.env.XENDIT_IS_PRODUCTION === 'true',
  }
);

// Create invoice
const invoice = xendit.createCuanBossInvoice({
  orderId: 'ORDER-123',
  productName: 'Kelas TikTok Affiliate Pro',
  productPrice: 299000,
  buyerEmail: 'buyer@example.com',
  buyerName: 'John Doe',
  sellerId: 'SELLER-111',
  successUrl: 'https://cuanboss.id/order/success?order=ORDER-123',
  failureUrl: 'https://cuanboss.id/order/failed?order=ORDER-123',
});

const response = await xendit.createInvoice(invoice);

// Redirect to payment
window.location.href = response.invoiceUrl;
```

### Webhook Handlers (Next.js App Router)

Create `src/app/api/webhook/midtrans/route.ts`:

```typescript
import { handleMidtransWebhook } from '@cuanboss/payment-gateway';

export async function POST(req: Request) {
  return handleMidtransWebhook(req);
}
```

Create `src/app/api/webhook/xendit/route.ts`:

```typescript
import { handleXenditWebhook } from '@cuanboss/payment-gateway';

export async function POST(req: Request) {
  return handleXenditWebhook(req);
}
```

### React Components

```tsx
import { 
  PaymentMethodsSelector, 
  CheckoutButton,
  PayoutDashboard,
  SellerOnboardingService 
} from '@cuanboss/payment-gateway';

// In your checkout page:
function CheckoutPage({ product }) {
  const [selectedMethod, setSelectedMethod] = useState();
  
  return (
    <div>
      <PaymentMethodsSelector
        amount={product.price}
        onSelect={setSelectedMethod}
        selectedMethod={selectedMethod?.id}
      />
      
      <CheckoutButton
        productId={product.id}
        productName={product.name}
        price={product.price}
        sellerId={product.sellerId}
        buyerId={currentUser.id}
        selectedMethod={selectedMethod}
        onSuccess={(orderId) => router.push(`/order/success?order=${orderId}`)}
      />
    </div>
  );
}

// In seller dashboard:
function SellerDashboard({ seller }) {
  return <PayoutDashboard sellerId={seller.id} />;
}
```

### Seller Onboarding

```typescript
import { SellerOnboardingService } from '@cuanboss/payment-gateway';

const onboarding = new SellerOnboardingService();

// Initialize
const status = await onboarding.initializeOnboarding(userId);

// Complete profile
await onboarding.completeProfileStep(sellerId, {
  displayName: 'Creator Name',
  bio: 'Content creator specializing in...',
  niche: ['education', 'technology'],
});

// Submit verification
await onboarding.submitVerification(sellerId, {
  fullName: 'Full Legal Name',
  idNumber: '1234567890123456',
  idPhotoFront: 'https://...',
  idPhotoBack: 'https://...',
  selfiePhoto: 'https://...',
});

// Add bank account
await onboarding.addBankAccount(sellerId, {
  bankCode: 'BCA',
  bankName: 'Bank Central Asia',
  accountNumber: '1234567890',
  accountHolderName: 'Full Name',
  isPrimary: true,
});

// Check progress
const progress = await onboarding.getOnboardingProgress(sellerId);
console.log(`${progress.percentage}% complete`);
console.log(`Can sell: ${progress.canStartSelling}`);
```

### Processing Payouts

```typescript
import { XenditClient } from '@cuanboss/payment-gateway';

const xendit = new XenditClient({
  secretKey: process.env.XENDIT_SECRET_KEY!,
  isProduction: true,
});

// Process seller payout
const payout = await xendit.processSellerPayout({
  payoutId: 'PAYOUT-123',
  sellerId: 'SELLER-111',
  sellerEmail: 'seller@example.com',
  sellerName: 'Creator Name',
  bankCode: 'BCA',
  accountNumber: '1234567890',
  accountHolderName: 'Full Name',
  amount: 1000000, // Rp 1,000,000
  description: 'Weekly payout - Jan 2024',
});

console.log(`Payout status: ${payout.status}`);
```

## 🔒 Security Checklist

- [ ] Webhook signatures verified (both Midtrans & Xendit)
- [ ] Server keys never exposed to client
- [ ] HTTPS only in production
- [ ] Rate limiting on payment endpoints
- [ ] Idempotency keys for payout requests
- [ ] Audit logs for all transactions

## 📊 Fee Structure

| Payment Method | Processing Fee | Platform Fee | Seller Gets |
|---------------|----------------|--------------|-------------|
| Bank Transfer (VA) | Rp 0 | 15% | 85% |
| E-Wallet | Rp 0 | 15% | 85% |
| QRIS | 0.7% | 15% | ~84.3% |
| Credit Card | 2.9% | 15% | ~82.1% |
| Retail (Alfa/Indo) | Rp 2,500 | 15% | 85% - Rp 2,500 |

## 🧪 Testing

### Midtrans Sandbox
- **Cards**: Use `4811 1111 1111 1114` for success
- **VA**: Any number works
- **E-Wallet**: Use sandbox apps

### Xendit Sandbox
- **API**: Same endpoints, different key
- **Test amounts**: Use specific amounts for specific responses

## 📞 Support

- **Issues**: https://github.com/cuanboss/payment-gateway/issues
- **Docs**: https://docs.cuanboss.id/payments
- **Discord**: https://discord.gg/cuanboss

---

Built with ❤️ by the CuanBoss Team
