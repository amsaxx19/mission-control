import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayoutProps } from '../types/email';

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
  previewText = 'Notification from CuanBoss',
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: {
                  50: '#eef2ff',
                  100: '#e0e7ff',
                  500: '#6366f1',
                  600: '#4f46e5',
                  700: '#4338ca',
                },
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans py-8">
          <Container className="bg-white rounded-lg shadow-sm max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-brand-600 p-8 text-center rounded-t-lg">
              <Img
                src="https://cuanboss.id/logo-white.png"
                alt="CuanBoss"
                width={140}
                className="mx-auto"
              />
              <Text className="text-white/80 text-sm mt-2">
                Platform Digital Product Indonesia
              </Text>
            </Section>

            {/* Content */}
            <Section className="p-8">{children}</Section>

            {/* Footer */}
            <Section className="bg-gray-50 p-6 rounded-b-lg">
              <Hr className="border-gray-200 mb-6" />
              
              <Text className="text-gray-500 text-xs text-center">
                Butuh bantuan? Hubungi kami di{' '}
                <Link
                  href="https://wa.me/6281234567890"
                  className="text-brand-600"
                >
                  WhatsApp
                </Link>{' '}
                atau{' '}
                <Link
                  href="mailto:support@cuanboss.id"
                  className="text-brand-600"
                >
                  support@cuanboss.id
                </Link>
              </Text>
              
              <Text className="text-gray-400 text-xs text-center mt-4">
                © {new Date().getFullYear()} CuanBoss. All rights reserved.
                <br />
                Platform creator marketplace Indonesia
              </Text>
              
              <Text className="text-gray-400 text-xs text-center mt-2">
                <Link
                  href="https://cuanboss.id/privacy"
                  className="text-gray-500 underline"
                >
                  Kebijakan Privasi
                </Link>
                {' • '}
                <Link
                  href="https://cuanboss.id/terms"
                  className="text-gray-500 underline"
                >
                  Syarat & Ketentuan
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
