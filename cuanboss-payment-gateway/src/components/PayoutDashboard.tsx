'use client';

import React, { useState, useEffect } from 'react';

interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  reference?: string;
}

interface SellerBalance {
  available: number;
  pending: number;
  totalEarned: number;
  lastPayout?: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  isPrimary: boolean;
}

interface PayoutDashboardProps {
  sellerId: string;
}

/**
 * Seller Payout Dashboard
 * 
 * Shows:
 * - Current balance (available & pending)
 * - Payout history
 * - Request payout button
 * - Bank account management
 * 
 * Usage:
 * ```tsx
 * <PayoutDashboard sellerId={seller.id} />
 * ```
 */
export const PayoutDashboard: React.FC<PayoutDashboardProps> = ({ sellerId }) => {
  const [balance, setBalance] = useState<SellerBalance | null>(null);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [sellerId]);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, payoutsRes, banksRes] = await Promise.all([
        fetch(`/api/sellers/${sellerId}/balance`),
        fetch(`/api/sellers/${sellerId}/payouts`),
        fetch(`/api/sellers/${sellerId}/bank-accounts`),
      ]);

      if (balanceRes.ok) setBalance(await balanceRes.json());
      if (payoutsRes.ok) setPayouts(await payoutsRes.json());
      if (banksRes.ok) setBankAccounts(await banksRes.json());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!requestAmount || !selectedBankId) return;

    setIsRequesting(true);
    try {
      const response = await fetch('/api/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          amount: parseInt(requestAmount),
          bankAccountId: selectedBankId,
        }),
      });

      if (!response.ok) throw new Error('Failed to request payout');

      setShowRequestModal(false);
      setRequestAmount('');
      fetchDashboardData();
    } catch (error) {
      console.error('Payout request failed:', error);
      alert('Gagal mengajukan payout. Silakan coba lagi.');
    } finally {
      setIsRequesting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      failed: 'Gagal',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const primaryBank = bankAccounts.find(b => b.isPrimary) || bankAccounts[0];
  const canRequestPayout = balance && balance.available >= 50000; // Minimum 50k

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Saldo Tersedia</p>
          <p className="text-3xl font-bold mt-1">
            {formatPrice(balance?.available || 0)}
          </p>
          <button
            onClick={() => setShowRequestModal(true)}
            disabled={!canRequestPayout}
            className="mt-4 w-full py-2 bg-white text-green-600 rounded-lg font-medium 
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
          >
            {canRequestPayout ? 'Tarik Saldo' : 'Minimal Rp50.000'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-500 text-sm font-medium">Dalam Proses</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatPrice(balance?.pending || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Akan masuk ke saldo dalam 1-2 hari
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-500 text-sm font-medium">Total Penghasilan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatPrice(balance?.totalEarned || 0)}
          </p>
          {balance?.lastPayout && (
            <p className="text-xs text-gray-400 mt-2">
              Payout terakhir: {formatDate(balance.lastPayout)}
            </p>
          )}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Riwayat Payout</h3>
        </div>
        
        {payouts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">Belum ada riwayat payout</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {payouts.map((payout) => (
              <div key={payout.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{formatPrice(payout.amount)}</p>
                  <p className="text-sm text-gray-500">{formatDate(payout.date)}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(payout.status)}
                  {payout.reference && (
                    <p className="text-xs text-gray-400 mt-1">{payout.reference}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tarik Saldo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="50000"
                    min="50000"
                    max={balance?.available}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimal Rp50.000, maksimal {formatPrice(balance?.available || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rekening Tujuan
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih rekening bank</option>
                  {bankAccounts.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bankName} - {bank.accountNumber} ({bank.accountHolderName})
                      {bank.isPrimary ? ' (Utama)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {primaryBank && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Rekening Utama:</p>
                  <p className="text-sm text-gray-600">{primaryBank.bankName}</p>
                  <p className="text-sm text-gray-600">{primaryBank.accountNumber}</p>
                  <p className="text-sm text-gray-600">a.n. {primaryBank.accountHolderName}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleRequestPayout}
                disabled={!requestAmount || !selectedBankId || isRequesting}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? 'Memproses...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutDashboard;
