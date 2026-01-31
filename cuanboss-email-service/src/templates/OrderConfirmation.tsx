import {
  Button,
  Heading,
  Hr,
  Img,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { OrderConfirmationData } from '../../types/email';

export const OrderConfirmationEmail: React.FC<OrderConfirmationData> = ({
  orderId,
  productName,
  productImage,
  amount,
  buyerName,
  downloadLink,
  accessInstructions,
}) => {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <EmailLayout previewText={`Pembelian Berhasil - ${productName}`}>
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        🎉 Pembayaran Berhasil!
      </Heading>

      <Text className="text-gray-600 mb-4">Halo {buyerName},</Text>

      <Text className="text-gray-600 mb-6">
        Terima kasih atas pembelianmu! Pembayaran untuk{' '}
        <strong>{productName}</strong> telah berhasil diproses.
      </Text>

      {/* Order Summary */}
      <Section className="bg-gray-50 p-6 rounded-lg mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          Detail Pesanan
        </Heading>

        {productImage && (
          <Img
            src={productImage}
            alt={productName}
            width={200}
            className="rounded-lg mb-4"
          />
        )}

        <Section className="space-y-2">
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Order ID</Text>
            <Text className="font-mono text-gray-800 m-0">{orderId}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Produk</Text>
            <Text className="text-gray-800 m-0">{productName}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Total Pembayaran</Text>
            <Text className="font-bold text-brand-600 m-0">
              {formatRupiah(amount)}
            </Text>
          </Section>
        </Section>
      </Section>

      {/* Access Instructions */}
      <Section className="mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          Cara Akses Produk
        </Heading>

        {downloadLink ? (
          <>
            <Text className="text-gray-600 mb-4">
              Klik tombol di bawah untuk mengunduh atau mengakses produkmu:
            </Text>
            <Button
              href={downloadLink}
              className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Akses Produk Sekarang
            </Button>
          </>
        ) : (
          <Text className="text-gray-600">
            {accessInstructions ||
              'Produk akan segera dikirim ke akunmu. Silakan login ke dashboard untuk melihat detailnya.'}
          </Text>
        )}
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-gray-500 text-sm">
        <strong>Catatan Penting:</strong>
      </Text>
      <Text className="text-gray-500 text-sm">
        • Simpan email ini sebagai bukti pembelian
        <br />• Link download aktif selamanya
        <br />• Hubungi seller jika ada kendala mengakses produk
      </Text>
    </EmailLayout>
  );
};

export default OrderConfirmationEmail;
