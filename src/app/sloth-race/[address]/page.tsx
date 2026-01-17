import { Metadata } from 'next';
import { SlothProfile } from '@/components/race/sloth-profile';

interface Props {
  params: { address: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shortAddress = `${params.address.slice(0, 8)}...${params.address.slice(-6)}`;
  
  return {
    title: `Sloth Profile - ${shortAddress}`,
    description: `View the Sloth Race profile for ${shortAddress}. Track delegation, ranking, and race progress.`,
  };
}

export default function SlothProfilePage({ params }: Props) {
  return (
    <div className="bg-gradient-jungle py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SlothProfile address={params.address} />
      </div>
    </div>
  );
}
