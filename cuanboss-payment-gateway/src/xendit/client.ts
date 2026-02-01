import axios, { AxiosInstance } from 'axios';

// Types
export interface XenditConfig {
  secretKey: string;
  publicKey?: string;
  webhookToken?: string;
  isProduction: boolean;
}

export interface XenditInvoice {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  invoiceDuration?: number; // in seconds
  shouldSendEmail?: boolean;
  customer?: {
    givenNames: string;
    surname?: string;
    email: string;
    mobileNumber?: string;
    addresses?: Array<{
      country: string;
      streetLine1: string;
      streetLine2?: string;
      city: string;
      province?: string;
      state?: string;
      postalCode: string;
    }>;
  };
  customerNotificationPreference?: {
    invoiceCreated: ('email' | 'whatsapp' | 'viber')[];
    invoiceReminder: ('email' | 'whatsapp' | 'viber')[];
    invoicePaid: ('email' | 'whatsapp' | 'viber')[];
  };
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethods?: string[];
  currency?: string;
  midLabel?: string;
  shouldAuthenticateCreditCard?: boolean;
  fees?: Array<{
    type: string;
    value: number;
  }>;
}

export interface XenditInvoiceResponse {
  id: string;
  externalId: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SETTLED' | 'EXPIRED';
  merchantName: string;
  merchantProfilePictureUrl: string;
  amount: number;
  payerEmail: string;
  description: string;
  expiryDate: string;
  invoiceUrl: string;
  availableBanks: Array<{
    bankCode: string;
    collectionType: string;
    transferAmount: number;
    bankBranch: string;
    accountHolderName: string;
    identityAmount: number;
  }>;
  availableRetailOutlets: Array<{
    retailOutletName: string;
    paymentCode: string;
    transferAmount: number;
    merchantName: string;
  }>;
  availableEwallets: Array<{
    ewalletType: string;
  }>;
  availableQrCodes: Array<{
    qrCodeType: string;
  }>;
  availableDirectDebits: Array<{
    directDebitType: string;
  }>;
  availablePaylaters: Array<{
    paylaterType: string;
  }>;
  shouldExcludeCreditCard?: boolean;
  shouldSendEmail?: boolean;
  created: string;
  updated: string;
  currency: string;
}

export interface XenditDisbursement {
  externalId: string;
  amount: number;
  bankCode: string;
  accountHolderName: string;
  accountNumber: string;
  description?: string;
  emailTo?: string[];
  emailCc?: string[];
  emailBcc?: string[];
}

export interface XenditDisbursementResponse {
  id: string;
  externalId: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  bankCode: string;
  accountHolderName: string;
  disbursementDescription: string;
  failureCode?: string;
  emailTo?: string[];
  emailCc?: string[];
  emailBcc?: string[];
  isInstant?: boolean;
}

export interface XenditPayout {
  externalId: string;
  amount: number;
  email: string;
  description?: string;
}

// CuanBoss-specific types
export interface CuanBossPayout {
  payoutId: string;
  sellerId: string;
  sellerEmail: string;
  sellerName: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number; // Net amount after platform fee
  description: string;
}

export interface XenditWebhookPayload {
  id: string;
  externalId: string;
  userId: string;
  isHigh: boolean;
  paymentMethod: string;
  status: 'PAID' | 'EXPIRED' | 'SETTLED';
  merchantName: string;
  amount: number;
  paidAmount: number;
  bankCode?: string;
  paidAt?: string;
  payerEmail: string;
  description: string;
  created: string;
  updated: string;
  currency: string;
  paymentChannel: string;
  paymentDestination?: string;
}

/**
 * Xendit Payment Gateway Client
 * 
 * Supports:
 * - Invoice (payment links)
 * - Disbursement (payout to sellers)
 * - Multi-payment methods (VA, QRIS, e-wallet, credit card)
 */
export class XenditClient {
  private config: XenditConfig;
  private client: AxiosInstance;

  constructor(config: XenditConfig) {
    this.config = config;

    const baseURL = config.isProduction
      ? 'https://api.xendit.co'
      : 'https://api.xendit.co'; // Xendit uses same URL for sandbox, different key

    this.client = axios.create({
      baseURL,
      auth: {
        username: config.secretKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create an invoice (payment link)
   * This generates a payment URL that supports all payment methods
   */
  async createInvoice(invoice: XenditInvoice): Promise<XenditInvoiceResponse> {
    try {
      const response = await this.client.post('/v2/invoices', {
        external_id: invoice.externalId,
        amount: invoice.amount,
        payer_email: invoice.payerEmail,
        description: invoice.description,
        invoice_duration: invoice.invoiceDuration,
        should_send_email: invoice.shouldSendEmail ?? true,
        customer: invoice.customer ? {
          given_names: invoice.customer.givenNames,
          surname: invoice.customer.surname,
          email: invoice.customer.email,
          mobile_number: invoice.customer.mobileNumber,
          addresses: invoice.customer.addresses?.map(addr => ({
            country: addr.country,
            street_line1: addr.streetLine1,
            street_line2: addr.streetLine2,
            city: addr.city,
            province: addr.province,
            state: addr.state,
            postal_code: addr.postalCode,
          })),
        } : undefined,
        customer_notification_preference: invoice.customerNotificationPreference,
        success_redirect_url: invoice.successRedirectUrl,
        failure_redirect_url: invoice.failureRedirectUrl,
        payment_methods: invoice.paymentMethods,
        currency: invoice.currency || 'IDR',
        mid_label: invoice.midLabel,
        should_authenticate_credit_card: invoice.shouldAuthenticateCreditCard,
        fees: invoice.fees,
      });

      return {
        id: response.data.id,
        externalId: response.data.external_id,
        userId: response.data.user_id,
        status: response.data.status,
        merchantName: response.data.merchant_name,
        merchantProfilePictureUrl: response.data.merchant_profile_picture_url,
        amount: response.data.amount,
        payerEmail: response.data.payer_email,
        description: response.data.description,
        expiryDate: response.data.expiry_date,
        invoiceUrl: response.data.invoice_url,
        availableBanks: response.data.available_banks,
        availableRetailOutlets: response.data.available_retail_outlets,
        availableEwallets: response.data.available_ewallets,
        availableQrCodes: response.data.available_qr_codes,
        availableDirectDebits: response.data.available_direct_debits,
        availablePaylaters: response.data.available_paylaters,
        shouldExcludeCreditCard: response.data.should_exclude_credit_card,
        shouldSendEmail: response.data.should_send_email,
        created: response.data.created,
        updated: response.data.updated,
        currency: response.data.currency,
      };
    } catch (error: any) {
      console.error('Xendit Invoice Error:', error.response?.data || error.message);
      throw new Error(`Failed to create invoice: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string): Promise<XenditInvoiceResponse> {
    try {
      const response = await this.client.get(`/v2/invoices/${invoiceId}`);
      
      return {
        id: response.data.id,
        externalId: response.data.external_id,
        userId: response.data.user_id,
        status: response.data.status,
        merchantName: response.data.merchant_name,
        merchantProfilePictureUrl: response.data.merchant_profile_picture_url,
        amount: response.data.amount,
        payerEmail: response.data.payer_email,
        description: response.data.description,
        expiryDate: response.data.expiry_date,
        invoiceUrl: response.data.invoice_url,
        availableBanks: response.data.available_banks,
        availableRetailOutlets: response.data.available_retail_outlets,
        availableEwallets: response.data.available_ewallets,
        availableQrCodes: response.data.available_qr_codes,
        availableDirectDebits: response.data.available_direct_debits,
        availablePaylaters: response.data.available_paylaters,
        shouldExcludeCreditCard: response.data.should_exclude_credit_card,
        shouldSendEmail: response.data.should_send_email,
        created: response.data.created,
        updated: response.data.updated,
        currency: response.data.currency,
      };
    } catch (error: any) {
      console.error('Xendit Get Invoice Error:', error.response?.data || error.message);
      throw new Error(`Failed to get invoice: ${error.message}`);
    }
  }

  /**
   * Expire an invoice
   */
  async expireInvoice(invoiceId: string): Promise<any> {
    try {
      const response = await this.client.post(`/invoices/${invoiceId}/expire!`);
      return response.data;
    } catch (error: any) {
      console.error('Xendit Expire Error:', error.response?.data || error.message);
      throw new Error(`Failed to expire invoice: ${error.message}`);
    }
  }

  /**
   * Create a disbursement (payout to seller's bank account)
   * Use this for paying sellers their earnings
   */
  async createDisbursement(disbursement: XenditDisbursement): Promise<XenditDisbursementResponse> {
    try {
      const response = await this.client.post('/disbursements', {
        external_id: disbursement.externalId,
        amount: disbursement.amount,
        bank_code: disbursement.bankCode,
        account_holder_name: disbursement.accountHolderName,
        account_number: disbursement.accountNumber,
        description: disbursement.description || 'CuanBoss Seller Payout',
        email_to: disbursement.emailTo,
        email_cc: disbursement.emailCc,
        email_bcc: disbursement.emailBcc,
      });

      return {
        id: response.data.id,
        externalId: response.data.external_id,
        userId: response.data.user_id,
        amount: response.data.amount,
        status: response.data.status,
        bankCode: response.data.bank_code,
        accountHolderName: response.data.account_holder_name,
        disbursementDescription: response.data.disbursement_description,
        failureCode: response.data.failure_code,
        emailTo: response.data.email_to,
        emailCc: response.data.email_cc,
        emailBcc: response.data.email_bcc,
        isInstant: response.data.is_instant,
      };
    } catch (error: any) {
      console.error('Xendit Disbursement Error:', error.response?.data || error.message);
      throw new Error(`Failed to create disbursement: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get disbursement status
   */
  async getDisbursement(disbursementId: string): Promise<XenditDisbursementResponse> {
    try {
      const response = await this.client.get(`/disbursements/${disbursementId}`);
      
      return {
        id: response.data.id,
        externalId: response.data.external_id,
        userId: response.data.user_id,
        amount: response.data.amount,
        status: response.data.status,
        bankCode: response.data.bank_code,
        accountHolderName: response.data.account_holder_name,
        disbursementDescription: response.data.disbursement_description,
        failureCode: response.data.failure_code,
        emailTo: response.data.email_to,
        emailCc: response.data.email_cc,
        emailBcc: response.data.email_bcc,
        isInstant: response.data.is_instant,
      };
    } catch (error: any) {
      console.error('Xendit Get Disbursement Error:', error.response?.data || error.message);
      throw new Error(`Failed to get disbursement: ${error.message}`);
    }
  }

  /**
   * Get available banks for disbursement
   */
  async getAvailableBanks(): Promise<Array<{ name: string; code: string }>> {
    try {
      const response = await this.client.get('/available_banks');
      return response.data.map((bank: any) => ({
        name: bank.name,
        code: bank.code,
      }));
    } catch (error: any) {
      console.error('Xendit Banks Error:', error.response?.data || error.message);
      throw new Error(`Failed to get available banks: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   * CRITICAL for security - always verify Xendit callbacks
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookToken) {
      console.warn('No webhook token configured, skipping signature verification');
      return true;
    }

    // Xendit uses HMAC-SHA256 for webhook verification
    const crypto = require('crypto');
    const computedSignature = crypto
      .createHmac('sha256', this.config.webhookToken)
      .update(payload)
      .digest('hex');

    return computedSignature === signature;
  }

  /**
   * Create a CuanBoss order invoice
   * Automatically calculates platform fee and creates invoice
   */
  createCuanBossInvoice(params: {
    orderId: string;
    productName: string;
    productPrice: number;
    buyerEmail: string;
    buyerName: string;
    sellerId: string;
    successUrl?: string;
    failureUrl?: string;
  }): XenditInvoice {
    const platformFee = Math.round(params.productPrice * 0.15);
    const sellerEarnings = params.productPrice - platformFee;

    return {
      externalId: params.orderId,
      amount: params.productPrice,
      payerEmail: params.buyerEmail,
      description: `Pembelian ${params.productName} di CuanBoss`,
      invoiceDuration: 86400, // 24 hours
      shouldSendEmail: true,
      customer: {
        givenNames: params.buyerName.split(' ')[0],
        surname: params.buyerName.split(' ').slice(1).join(' ') || undefined,
        email: params.buyerEmail,
      },
      successRedirectUrl: params.successUrl || `https://cuanboss.id/order/success?order=${params.orderId}`,
      failureRedirectUrl: params.failureUrl || `https://cuanboss.id/order/failed?order=${params.orderId}`,
      fees: [
        {
          type: 'Platform Fee (15%)',
          value: platformFee,
        },
      ],
    };
  }

  /**
   * Process seller payout
   * Automatically handles disbursement with proper metadata
   */
  async processSellerPayout(payout: CuanBossPayout): Promise<XenditDisbursementResponse> {
    return this.createDisbursement({
      externalId: payout.payoutId,
      amount: payout.amount,
      bankCode: payout.bankCode,
      accountHolderName: payout.accountHolderName,
      accountNumber: payout.accountNumber,
      description: payout.description,
      emailTo: [payout.sellerEmail],
    });
  }
}

// Factory function
export function createXenditClient(
  secretKey: string,
  options?: { publicKey?: string; webhookToken?: string; isProduction?: boolean }
): XenditClient {
  return new XenditClient({
    secretKey,
    publicKey: options?.publicKey,
    webhookToken: options?.webhookToken,
    isProduction: options?.isProduction ?? false,
  });
}

export default XenditClient;
