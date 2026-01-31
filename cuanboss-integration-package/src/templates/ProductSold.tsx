import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { ProductSoldData } from '../../types/email';

export const ProductSoldEmail: React.FC<ProductSoldData> = ({
  productName,
  productImage,
  buyerName,
  amount,
  yourEarnings,
  platformFee,
  orderId,
  dashboardLink,
}) => {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <EmailLayout previewText={`🎉 Produkmu terjual! +${formatRupiah(yourEarnings)}`}>
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        🎉 Ada Pembelian Baru!
      </Heading>

      <Text className="text-gray-600 mb-4">Selamat!</Text>

      <Text className="text-gray-600 mb-6">
        Produk <strong>{productName}</strong> baru saja dibeli oleh{' '}
        <strong>{buyerName}</strong>.
      </Text>

      {/* Sale Summary */}
      <Section className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
        <Heading className="text-lg font-semibold text-green-800 mb-4">
          Detail Penjualan
        </Heading>

        {productImage && (
          <Img
            src={productImage}
            alt={productName}
            width={150}
            className="rounded-lg mb-4"
          />
        )}

        <Section className="space-y-2">
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Produk</Text>
            <Text className="text-gray-800 m-0">{productName}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Order ID</Text>
            <Text className="font-mono text-gray-800 m-0">{orderId}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Pembeli</Text>
            <Text className="text-gray-800 m-0">{buyerName}</Text>
          </Section>
          
          <Hr className="border-green-200 my-2" />
          
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Harga Jual</Text>
            <Text className="text-gray-800 m-0">{formatRupiah(amount)}</Text>
          </Section>
          <Section className="flex justify-between">
            <Text className="text-gray-600 m-0">Fee Platform (15%)</Text>
            <Text className="text-red-600 m-0">-{formatRupiah(platformFee)}</Text>
          </Section>
          <Section className="flex justify-between bg-green-100 p-2 rounded">
            <Text className="text-green-800 font-semibold m-0">Pendapatanmu</Text>
            <Text className="text-green-800 font-bold m-0">
              {formatRupiah(yourEarnings)}
            </Text>
          </Section>
        </Section>
      </Section>

      <Text className="text-gray-600 mb-6">
        Dana telah masuk ke walletmu dan siap untuk withdrawal. Produk otomatis
        dikirim ke pembeli.
      </Text>

      {/* CTA */}
      <Section className="text-center mb-6">
        <Button
          href={dashboardLink}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Lihat Dashboard
        </Button>
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-gray-500 text-sm">
        <strong>Tips meningkatkan penjualan:</strong>
        <br />• Share link produk di sosial media
        <br />• Buat konten review/testimoni
        <br />• Optimasi judul dan deskripsi produk
      </Text>
    </EmailLayout>
  );
};

export default ProductSoldEmail;
