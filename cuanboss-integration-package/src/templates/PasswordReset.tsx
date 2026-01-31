import {
  Button,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { PasswordResetData } from '../../types/email';

export const PasswordResetEmail: React.FC<PasswordResetData> = ({
  userName,
  resetLink,
  expiresAt,
}) => {
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
    <EmailLayout previewText="Reset password CuanBoss-mu">
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        🔐 Reset Password
      </Heading>

      <Text className="text-gray-600 mb-4">Halo {userName},</Text>

      <Text className="text-gray-600 mb-6">
        Kami menerima permintaan untuk reset password akun CuanBoss-mu. Klik
tombol di bawah untuk membuat password baru:
      </Text>

      <Section className="text-center mb-6">
        <Button
          href={resetLink}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Reset Password
        </Button>
      </Section>

      <Text className="text-gray-500 text-sm mb-4">
        Atau copy link ini ke browser:
        <br />
        <span className="text-brand-600 break-all">{resetLink}</span>
      </Text>

      <Section className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <Text className="text-yellow-800 m-0">
          <strong>⏰ Link expired:</strong> {formatDate(expiresAt)}
        </Text>
      </Section>

      <Text className="text-gray-500 text-sm">
        Jika kamu tidak meminta reset password, abaikan email ini. Akunmu tetap
        aman.
      </Text>

      <Text className="text-gray-500 text-sm mt-4">
        Butuh bantuan? Hubungi{' '}
        <a href="mailto:support@cuanboss.id" className="text-brand-600">
          support@cuanboss.id
        </a>
      </Text>
    </EmailLayout>
  );
};

export default PasswordResetEmail;
