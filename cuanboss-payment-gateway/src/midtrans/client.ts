import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

// Types
export interface MidtransConfig {
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
}

export interface TransactionItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
  brand?: string;
  category?: string;
  merchantName?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  billingAddress?: Address;
  shippingAddress?: Address;
}

export interface Address {
  firstName: string;
  lastName?: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
}

export interface SnapTransaction {
  transactionDetails: {
    orderId: string;
    grossAmount: number;
  };
  itemDetails?: TransactionItem[];
  customerDetails?: CustomerDetails;
  enabledPayments?: string[];
  creditCard?: {
    secure?: boolean;
    channel?: string;
    bank?: string;
    installment?: {
      required: boolean;
      terms: {
        [bank: string]: number[];
      };
    };
  };
  expiry?: {
    startTime: string;
    unit: 'second' | 'minute' | 'hour' | 'day';
    duration: number;
  };
  customField1?: string;
  customField2?: string;
  customField3?: string;
}

export interface SnapResponse {
  token: string;
  redirectUrl: string;
}

export interface TransactionStatus {
  transactionId: string;
  orderId: string;
  grossAmount: string;
  transactionStatus: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire' | 'refund';
  fraudStatus: 'accept' | 'deny' | 'challenge';
  statusCode: string;
  statusMessage: string;
  paymentType: string;
  transactionTime: string;
  settlementTime?: string;
  currency: string;
  vaNumbers?: Array<{
    bank: string;
    vaNumber: string;
  }>;
  billKey?: string;
  billerCode?: string;
  permataVaNumber?: string;
}

// CuanBoss-specific types
export interface CuanBossOrder {
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  platformFee: number; // 15%
  sellerEarnings: number;
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  sellerId: string;
  sellerEmail: string;
  sellerName: string;
}

/**
 * Midtrans Payment Gateway Client
 * 
 * Supports:
 * - Snap (redirect/popup payment page)
 * - Core API (direct API integration)
 * - Transaction status checking
 * - Refund handling
 */
export class MidtransClient {
  private config: MidtransConfig;
  private snapClient: AxiosInstance;
  private coreClient: AxiosInstance;

  constructor(config: MidtransConfig) {
    this.config = config;
    
    const baseURL = config.isProduction 
      ? 'https://app.midtrans.com'
      : 'https://app.sandbox.midtrans.com';

    // Snap API Client (for creating transactions)
    this.snapClient = axios.create({
      baseURL: `${baseURL}/snap/v1`,
      auth: {
        username: config.serverKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Core API Client (for transaction operations)
    this.coreClient = axios.create({
      baseURL: `${baseURL}/v2`,
      auth: {
        username: config.serverKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Create a Snap transaction token
   * This generates a token for the payment popup/redirect
   */
  async createSnapTransaction(transaction: SnapTransaction): Promise<SnapResponse> {
    try {
      const response = await this.snapClient.post('/transactions', {
        transaction_details: {
          order_id: transaction.transactionDetails.orderId,
          gross_amount: transaction.transactionDetails.grossAmount,
        },
        item_details: transaction.itemDetails?.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
          brand: item.brand,
          category: item.category,
          merchant_name: item.merchantName,
        })),
        customer_details: transaction.customerDetails ? {
          first_name: transaction.customerDetails.firstName,
          last_name: transaction.customerDetails.lastName,
          email: transaction.customerDetails.email,
          phone: transaction.customerDetails.phone,
          billing_address: transaction.customerDetails.billingAddress ? {
            first_name: transaction.customerDetails.billingAddress.firstName,
            last_name: transaction.customerDetails.billingAddress.lastName,
            phone: transaction.customerDetails.billingAddress.phone,
            address: transaction.customerDetails.billingAddress.address,
            city: transaction.customerDetails.billingAddress.city,
            postal_code: transaction.customerDetails.billingAddress.postalCode,
            country_code: transaction.customerDetails.billingAddress.countryCode,
          } : undefined,
          shipping_address: transaction.customerDetails.shippingAddress ? {
            first_name: transaction.customerDetails.shippingAddress.firstName,
            last_name: transaction.customerDetails.shippingAddress.lastName,
            phone: transaction.customerDetails.shippingAddress.phone,
            address: transaction.customerDetails.shippingAddress.address,
            city: transaction.customerDetails.shippingAddress.city,
            postal_code: transaction.customerDetails.shippingAddress.postalCode,
            country_code: transaction.customerDetails.shippingAddress.countryCode,
          } : undefined,
        } : undefined,
        enabled_payments: transaction.enabledPayments,
        credit_card: transaction.creditCard,
        expiry: transaction.expiry ? {
          start_time: transaction.expiry.startTime,
          unit: transaction.expiry.unit,
          duration: transaction.expiry.duration,
        } : undefined,
        custom_field1: transaction.customField1,
        custom_field2: transaction.customField2,
        custom_field3: transaction.customField3,
      });

      return {
        token: response.data.token,
        redirectUrl: response.data.redirect_url,
      };
    } catch (error: any) {
      console.error('Midtrans Snap Error:', error.response?.data || error.message);
      throw new Error(`Failed to create Snap transaction: ${error.response?.data?.error_messages?.join(', ') || error.message}`);
    }
  }

  /**
   * Check transaction status
   */
  async getTransactionStatus(orderId: string): Promise<TransactionStatus> {
    try {
      const response = await this.coreClient.get(`/${orderId}/status`);
      const data = response.data;

      return {
        transactionId: data.transaction_id,
        orderId: data.order_id,
        grossAmount: data.gross_amount,
        transactionStatus: data.transaction_status,
        fraudStatus: data.fraud_status,
        statusCode: data.status_code,
        statusMessage: data.status_message,
        paymentType: data.payment_type,
        transactionTime: data.transaction_time,
        settlementTime: data.settlement_time,
        currency: data.currency,
        vaNumbers: data.va_numbers,
        billKey: data.bill_key,
        billerCode: data.biller_code,
        permataVaNumber: data.permata_va_number,
      };
    } catch (error: any) {
      console.error('Midtrans Status Error:', error.response?.data || error.message);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  /**
   * Refund a transaction
   */
  async refundTransaction(orderId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const payload: any = {};
      if (amount) payload.refund_amount = amount;
      if (reason) payload.reason = reason;

      const response = await this.coreClient.post(`/${orderId}/refund`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Midtrans Refund Error:', error.response?.data || error.message);
      throw new Error(`Failed to refund transaction: ${error.message}`);
    }
  }

  /**
   * Cancel a pending transaction
   */
  async cancelTransaction(orderId: string): Promise<any> {
    try {
      const response = await this.coreClient.post(`/${orderId}/cancel`);
      return response.data;
    } catch (error: any) {
      console.error('Midtrans Cancel Error:', error.response?.data || error.message);
      throw new Error(`Failed to cancel transaction: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   * This is CRITICAL for security - always verify webhook callbacks
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHash('sha512')
      .update(this.config.serverKey + payload)
      .digest('hex');

    return computedSignature === signature;
  }

  /**
   * Create a CuanBoss order with proper fee calculation
   * 15% platform fee, 85% to seller
   */
  createCuanBossOrder(order: CuanBossOrder): SnapTransaction {
    const grossAmount = order.productPrice;
    const platformFee = Math.round(grossAmount * 0.15);
    const sellerEarnings = grossAmount - platformFee;

    return {
      transactionDetails: {
        orderId: order.orderId,
        grossAmount: grossAmount,
      },
      itemDetails: [
        {
          id: order.productId,
          price: order.productPrice,
          quantity: 1,
          name: order.productName,
          merchantName: order.sellerName,
        },
      ],
      customerDetails: {
        firstName: order.buyerName.split(' ')[0],
        lastName: order.buyerName.split(' ').slice(1).join(' '),
        email: order.buyerEmail,
        phone: '', // To be filled
      },
      customField1: order.sellerId, // Store seller ID for webhook processing
      customField2: String(platformFee),
      customField3: String(sellerEarnings),
    };
  }
}

// Factory function for easy instantiation
export function createMidtransClient(
  serverKey: string,
  clientKey: string,
  isProduction: boolean = false
): MidtransClient {
  return new MidtransClient({ serverKey, clientKey, isProduction });
}

export default MidtransClient;
