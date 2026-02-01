'use client';

import React, { useState, useCallback } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  category: 'ewallet' | 'bank_transfer' | 'credit_card' | 'retail' | 'qris';
  processingFee: number;
}

interface PaymentMethodsSelectorProps {
  amount: number;
  onSelect: (method: PaymentMethod) => void;
  selectedMethod?: string;
  enabledMethods?: string[];
}

const PAYMENT_METHODS: PaymentMethod[] = [
  // E-Wallets
  { id: 'gopay', name: 'GoPay', icon: '💳', category: 'ewallet', processingFee: 0 },
  { id: 'ovo', name: 'OVO', icon: '💳', category: 'ewallet', processingFee: 0 },
  { id: 'dana', name: 'DANA', icon: '💳', category: 'ewallet', processingFee: 0 },
  { id: 'shopeepay', name: 'ShopeePay', icon: '🛒', category: 'ewallet', processingFee: 0 },
  { id: 'linkaja', name: 'LinkAja', icon: '💳', category: 'ewallet', processingFee: 0 },
  
  // Bank Transfer
  { id: 'bca_va', name: 'BCA Virtual Account', icon: '🏦', category: 'bank_transfer', processingFee: 0 },
  { id: 'bni_va', name: 'BNI Virtual Account', icon: '🏦', category: 'bank_transfer', processingFee: 0 },
  { id: 'bri_va', name: 'BRI Virtual Account', icon: '🏦', category: 'bank_transfer', processingFee: 0 },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏦', category: 'bank_transfer', processingFee: 0 },
  { id: 'permata_va', name: 'Permata Virtual Account', icon: '🏦', category: 'bank_transfer', processingFee: 0 },
  
  // Credit Card
  { id: 'credit_card', name: 'Kartu Kredit/Debit', icon: '💳', category: 'credit_card', processingFee: 2.9 },
  
  // QRIS
  { id: 'qris', name: 'QRIS (Semua E-Wallet)', icon: '📱', category: 'qris', processingFee: 0.7 },
  
  // Retail
  { id: 'alfamart', name: 'Alfamart', icon: '🏪', category: 'retail', processingFee: 2500 },
  { id: 'indomaret', name: 'Indomaret', icon: '🏪', category: 'retail', processingFee: 2500 },
];

const CATEGORY_LABELS: Record<string, string> = {
  ewallet: 'E-Wallet',
  bank_transfer: 'Transfer Bank (Virtual Account)',
  credit_card: 'Kartu Kredit/Debit',
  retail: 'Gerai Retail',
  qris: 'QRIS',
};

export const PaymentMethodsSelector: React.FC<PaymentMethodsSelectorProps> = ({
  amount,
  onSelect,
  selectedMethod,
  enabledMethods,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ewallet');

  const filteredMethods = enabledMethods 
    ? PAYMENT_METHODS.filter(m => enabledMethods.includes(m.id))
    : PAYMENT_METHODS;

  const groupedMethods = filteredMethods.reduce((acc, method) => {
    if (!acc[method.category]) acc[method.category] = [];
    acc[method.category].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  const calculateTotal = (method: PaymentMethod) => {
    if (method.processingFee === 0) return amount;
    if (method.processingFee < 100) return amount + (amount * method.processingFee / 100);
    return amount + method.processingFee;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pilih Metode Pembayaran
      </h3>

      {Object.entries(groupedMethods).map(([category, methods]) => (
        <div key={category} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-700">{CATEGORY_LABELS[category]}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                expandedCategory === category ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedCategory === category && (
            <div className="divide-y divide-gray-100">
              {methods.map((method) => {
                const isSelected = selectedMethod === method.id;
                const total = calculateTotal(method);
                const fee = total - amount;

                return (
                  <button
                    key={method.id}
                    onClick={() => onSelect(method)}
                    className={`w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        {fee > 0 && (
                          <p className="text-sm text-gray-500">
                            Biaya: {method.processingFee < 100 
                              ? `${method.processingFee}%` 
                              : formatPrice(method.processingFee)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(total)}</p>
                      {isSelected && (
                        <span className="inline-flex items-center text-sm text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Dipilih
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal Produk</span>
          <span className="font-medium">{formatPrice(amount)}</span>
        </div>
        {selectedMethod && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Biaya Admin</span>
            <span className="font-medium">
              {(() => {
                const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);
                if (!method || method.processingFee === 0) return 'Gratis';
                if (method.processingFee < 100) {
                  return formatPrice(amount * method.processingFee / 100);
                }
                return formatPrice(method.processingFee);
              })()}
            </span>
          </div>
        )}
        <div className="border-t border-blue-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Pembayaran</span>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(selectedMethod 
                ? calculateTotal(PAYMENT_METHODS.find(m => m.id === selectedMethod)!)
                : amount
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsSelector;
