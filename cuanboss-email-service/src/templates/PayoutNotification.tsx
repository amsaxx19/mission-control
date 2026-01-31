import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { PayoutNotificationData } from '../../types/email';

export const PayoutNotificationEmail: React.FC<PayoutNotificationData> = ({
  sellerName,
  amount,
  payoutMethod,
  accountNumber,
  referenceNumber,
  processedAt,
  estimatedArrival,
}) => {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <EmailLayout previewText={`Payout ${formatRupiah(amount)} sedang diproses`}>
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        💰 Payout Berhasil Diproses!
      </Heading>

      <Text className="text-gray-600 mb-4">Halo {sellerName},</Text>

      <Text className="text-gray-600 mb-6">
        Payoutmu telah berhasil diproses. Dana akan segera masuk ke rekeningmu.
      </Text>

      {/* Payout Summary */}
      <Section className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
        <Heading className="text-lg font-semibold text-green-800 mb-4 text-center">
          Detail Payout
        </Heading>

        <Section className="text-center mb-4">
          <Text className="text-gray-600 m-0">Jumlah Payout</Text>
          <Text className="text-3xl font-bold text-green-600 m-0">
            {formatRupiah(amount)}
          </Text>
        </Section>

        <Hr className="border-green-200 my-4" />

        <Section className="space-y-2">
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Metode</Text>
            <Text className="text-gray-800 m-0">{payoutMethod}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Nomor Rekening</Text>
            <Text className="font-mono text-gray-800 m-0">{accountNumber}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Reference ID</Text>
            <Text className="font-mono text-gray-800 m-0">{referenceNumber}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Tanggal Proses</Text>
            <Text className="text-gray-800 m-0">{formatDate(processedAt)}</Text>
          </Section>
          {estimatedArrival && (
            <Section className="flex justify-between">
              <Text className="text-gray-600 m-0">Estimasi Masuk</Text>
              <Text className="text-green-700 font-semibold m-0">
                {formatDate(estimatedArrival)}
              </Text>
            </Section>
          )}
        </Section>
      </Section>

      {/* Status */}
      <Section className="bg-gray-50 p-4 rounded-lg mb-6">
        <Text className="text-gray-700 m-0 text-center">
          <strong>Status:</strong>{' '}
          <span className="text-green-600">✓ Diproses</span>
        </Text>
      </Section>

      <Text className="text-gray-500 text-sm">
        <strong>Catatan:</strong>
        <br />• Waktu masuk dana tergantung bank (biasanya 1x24 jam)
        <br />• Cek mutasi rekening secara berkala
        <br />• Simpan reference ID ini untuk arsip
      </Text>
    </EmailLayout>
  );
};

export default PayoutNotificationEmail;
