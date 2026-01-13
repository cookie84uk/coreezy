import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SlothProfile } from '@/components/race/sloth-profile';

type Props = {
  params: { address: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Sloth Profile | ${params.address.slice(0, 8)}...`,
    description: `View the Sloth Race profile for ${params.address}`,
  };
}

export default function SlothProfilePage({ params }: Props) {
  const { address } = params;

  // Basic validation
  if (!address || !address.startsWith('core')) {
    notFound();
  }

  return (
    <div className="bg-gradient-jungle py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SlothProfile address={address} />
      </div>
    </div>
  );
}
