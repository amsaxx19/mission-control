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
import { WelcomeSellerData } from '../../types/email';

export const WelcomeSellerEmail: React.FC<WelcomeSellerData> = ({
  sellerName,
  dashboardLink,
  firstProductLink,
}) => {
  return (
    <EmailLayout previewText="Selamat datang di CuanBoss! 🚀">
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        🎉 Selamat Datang di CuanBoss!
      </Heading>

      <Text className="text-gray-600 mb-4">Halo {sellerName},</Text>

      <Text className="text-gray-600 mb-4">
        Akun sellermu telah aktif! Sekarang kamu bisa mulai menjual digital
        products dan monetize audiensmu.
      </Text>

      <Text className="text-gray-600 mb-6">
        CuanBoss adalah platform marketplace digital product pertama di Indonesia
        yang memudahkan creator seperti kamu untuk:
      </Text>

      {/* Features */}
      <Section className="space-y-3 mb-6">
        <Section className="flex items-start">
          <Text className="text-2xl mr-3 m-0">📚</Text>
          <Section>
            <Text className="font-semibold text-gray-800 m-0">
              Jual Online Course
            </Text>
            <Text className="text-gray-600 text-sm m-0">
              Video course, ebook, template, atau digital product apapun
            </Text>
          </Section>
        </Section>

        <Section className="flex items-start">
          <Text className="text-2xl mr-3 m-0">💰</Text>
          <Section>
            <Text className="font-semibold text-gray-800 m-0">
              Dapatkan 85% dari Setiap Penjualan
            </Text>
            <Text className="text-gray-600 text-sm m-0">
              Fee platform hanya 15%, kamu dapat sisanya
            </Text>
          </Section>
        </Section>

        <Section className="flex items-start">
          <Text className="text-2xl mr-3 m-0">🏆</Text>
          <Section>
            <Text className="font-semibold text-gray-800 m-0">
              Cari Clipping Jobs
            </Text>
            <Text className="text-gray-600 text-sm m-0">
              Brand posting job clipping, kamu bisa apply dan dapat bayaran
            </Text>
          </Section>
        </Section>

        <Section className="flex items-start">
          <Text className="text-2xl mr-3 m-0">⚡</Text>
          <Section>
            <Text className="font-semibold text-gray-800 m-0">
              Payout Cepat
            </Text>
            <Text className="text-gray-600 text-sm m-0">
              Withdrawal ke rekening bank kapan saja, diproses dalam 24 jam
            </Text>
          </Section>
        </Section>
      </Section>

      <Hr className="border-gray-200 my-6" />

      {/* Quick Start Guide */}
      <Heading className="text-lg font-semibold text-gray-800 mb-4">
        Langkah Selanjutnya
      </Heading>

      <Section className="space-y-2 mb-6">
        <Text className="text-gray-600 m-0">
          1. <strong>Lengkapi profil</strong> - Tambahkan bio dan foto profil
        </Text>
        <Text className="text-gray-600 m-0">
          2. <strong>Upload produk pertama</strong> - Course, ebook, atau template
        </Text>
        <Text className="text-gray-600 m-0">
          3. <strong>Share link</strong> - Promosikan ke audiensmu
        </Text>
        <Text className="text-gray-600 m-0">
          4. <strong>Mulai jualan!</strong> - Dapat notifikasi tiada ada pembelian
        </Text>
      </Section>

      {/* CTA Buttons */}
      <Section className="text-center space-y-3">
        <Button
          href={dashboardLink}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold block w-full"
        >
          Buka Dashboard Seller
        </Button>

        {firstProductLink && (
          <Button
            href={firstProductLink}
            className="bg-white text-brand-600 border-2 border-brand-600 px-8 py-3 rounded-lg font-semibold block w-full"
          >
            Upload Produk Pertama
          </Button>
        )}
      </Section>

      <Hr className="border-gray-200 my-6" />

      {/* Community */}
      <Section className="bg-brand-50 p-4 rounded-lg">
        <Text className="text-gray-700 m-0 text-center">
          <strong>Join Komunitas CuanBoss</strong>
          <br />
          <Link href="https://t.me/cuanbosscommunity" className="text-brand-600">
            t.me/cuanbosscommunity
          </Link>
        </Text>
        <Text className="text-gray-600 text-sm text-center mt-2 m-0">
          Belajar dari seller lain, dapat tips, dan networking
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default WelcomeSellerEmail;
