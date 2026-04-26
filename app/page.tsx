import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page';
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social sharing image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an Imposter Game Generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is a browser-based party tool that assigns secret roles, reveals hidden words, and helps groups run fast social deduction rounds without paper slips or app installs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many players can use this Imposter Game Generator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It runs from 4 to 10 players, but most groups feel best with 5 to 8 because the clues stay lively and the voting stays sharp.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I play this Imposter Game Generator offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Pass & Play mode lets your group use one device with no internet, which is handy for travel, classrooms, or casual party setups.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do all players need their own phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. If your group wants the live room experience, each player can join on their own phone. If not, one phone is enough in offline mode.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do players reveal secret roles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Players use the hold-to-peek screen to check their secret role and word without flashing it to the rest of the group.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the outsider is caught?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the group catches the outsider, that player gets one final chance to guess the secret word. A correct guess can steal the round, and a wrong guess gives the win to the rest of the table.',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Play the Imposter Game',
  description: 'Use this quick guide to get a party round running fast without overexplaining the rules.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Create or join a room',
      text: 'Start a party or enter a 4-digit code.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose online or offline play',
      text: 'Sync multiple phones or pass one device around.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Set players and roles',
      text: 'Adjust the imposter count and difficulty level.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Reveal secret identities',
      text: 'Hold to peek at your hidden word.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Discuss and bluff',
      text: 'Use verbal clues to find the imposter or hide your identity.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Vote and resolve the round',
      text: 'Eliminate a player and check win conditions automatically.',
    },
  ],
};

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Imposter Game Generator',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: HOME_DESCRIPTION,
  url: SITE_URL,
  browserRequirements: 'Requires a modern web browser with JavaScript enabled',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <HomePageClient />
    </>
  );
}
