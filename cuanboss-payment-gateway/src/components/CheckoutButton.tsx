'use client';

import React, { useState, useCallback } from 'react';
import { PaymentMethod } from './PaymentMethodsSelector';

interface CheckoutButtonProps {
  productId: string;
  productName: string;
  price: number;
  sellerId: string;
  buyerId: string;
  selectedMethod?: PaymentMethod;
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  orderId: string | null;
}

/**
 * Checkout Button Component
 * 
 * Handles the complete checkout flow:
 * 1. Creates order in database
 * 2. Initializes payment with selected provider
 * 3. Redirects to payment page
 * 
 * Usage:
 * ```tsx
 * <CheckoutButton
 *   productId="prod_123"
 *   productName="Kelas TikTok Affiliate"
 *   price={299000}
 *   sellerId="seller_456"
 *   buyerId={user.id}
 *   selectedMethod={selectedPaymentMethod}
 *   onSuccess={(orderId) => router.push(`/order/success?order=${orderId}`)}
 * />
 * ```
 */
export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId,
  productName,
  price,
  sellerId,
  buyerId,
  selectedMethod,
  onSuccess,
  onError,
  className = '',
  children,
}) => {
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    orderId: null,
  });

  const handleCheckout = useCallback(async () => {
    if (!selectedMethod) {
      setState(prev => ({ ...prev, error: 'Pilih metode pembayaran terlebih dahulu' }));
      return;
    }

    setState({ isLoading: true, error: null, orderId: null });

    try {
      // Step 1: Create order
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          sellerId,
          buyerId,
          amount: price,
          paymentMethod: selectedMethod.id,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const { orderId } = await orderResponse.json();

      // Step 2: Initialize payment
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productName,
          amount: price,
          paymentMethod: selectedMethod.id,
        }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        throw new Error(error.message || 'Failed to initialize payment');
      }

      const paymentData = await paymentResponse.json();

      // Step 3: Redirect to payment
      if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      } else if (paymentData.token) {
        // For Midtrans Snap popup
        if (typeof window !== 'undefined' && (window as any).snap) {
          (window as any).snap.pay(paymentData.token, {
            onSuccess: () => {
              onSuccess?.(orderId);
            },
            onPending: () => {
              onSuccess?.(orderId);
            },
            onError: () => {
              setState(prev => ({ ...prev, isLoading: false, error: 'Pembayaran gagal' }));
            },
            onClose: () => {
              setState(prev => ({ ...prev, isLoading: false }));
            },
          });
        } else {
          throw new Error('Payment library not loaded');
        }
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      setState({
        isLoading: false,
        error: error.message || 'Terjadi kesalahan saat checkout',
        orderId: null,
      });
      onError?.(error);
    }
  }, [productId, productName, price, sellerId, buyerId, selectedMethod, onSuccess, onError]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    if (!selectedMethod) return price;
    if (selectedMethod.processingFee === 0) return price;
    if (selectedMethod.processingFee < 100) {
      return price + (price * selectedMethod.processingFee / 100);
    }
    return price + selectedMethod.processingFee;
  };

  return (
    <div className="w-full">
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={state.isLoading || !selectedMethod}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white
          transition-all duration-200
          ${state.isLoading || !selectedMethod
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
          }
          ${className}
        `}
      >
        {state.isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Memproses...
          </span>
        ) : (
          children || (
            <span className="flex flex-col items-center">
              <span className="text-lg">Bayar Sekarang</span>
              {selectedMethod && (
                <span className="text-sm opacity-90">
                  {formatPrice(calculateTotal())}
                </span>
              )}
            </span>
          )
        )}
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        Pembayaran aman & terenkripsi. Dana akan disimpan oleh CuanBoss 
        sampai produk diterima.
      </p>
    </div>
  );
};

export default CheckoutButton;
