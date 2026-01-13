import { NextResponse } from 'next/server';

const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';
const AIRDROP_WALLET = 'core1qxaaycuv8jj669fn0ppqn96ylxfdcw58clwc6d';

interface Transaction {
  txhash: string;
  timestamp: string;
  tx: {
    body: {
      messages: Array<{
        '@type': string;
        from_address?: string;
        to_address?: string;
        amount?: Array<{ denom: string; amount: string }>;
      }>;
    };
  };
}

interface Distribution {
  date: string;
  txHash: string;
  recipients: number;
  totalAmount: string;
  perNft: string;
}

async function fetchAirdropTransactions(): Promise<Distribution[]> {
  try {
    // Fetch transactions where airdrop wallet is the sender (outgoing distributions)
    const response = await fetch(
      `${COREUM_REST}/cosmos/tx/v1beta1/txs?events=message.sender%3D%27${AIRDROP_WALLET}%27&pagination.limit=50&order_by=ORDER_BY_DESC`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.status);
      return [];
    }

    const data = await response.json();
    const txs: Transaction[] = data.tx_responses || [];

    // Group transactions by date to identify distribution batches
    const distributionsByDate = new Map<string, {
      date: string;
      txHashes: string[];
      totalAmount: number;
      recipients: number;
    }>();

    for (const tx of txs) {
      const date = tx.timestamp.split('T')[0]; // YYYY-MM-DD
      
      // Look for bank send messages
      for (const msg of tx.tx.body.messages) {
        if (
          msg['@type'] === '/cosmos.bank.v1beta1.MsgSend' &&
          msg.from_address === AIRDROP_WALLET &&
          msg.amount
        ) {
          // Find CORE amount
          const coreAmount = msg.amount.find(a => a.denom === 'ucore');
          if (coreAmount) {
            const existing = distributionsByDate.get(date) || {
              date,
              txHashes: [],
              totalAmount: 0,
              recipients: 0,
            };

            existing.txHashes.push(tx.txhash);
            existing.totalAmount += Number(coreAmount.amount);
            existing.recipients += 1;

            distributionsByDate.set(date, existing);
          }
        }
      }
    }

    // Convert to distribution format
    const distributions: Distribution[] = [];
    for (const [, dist] of distributionsByDate) {
      // Only include distributions with multiple recipients (likely NFT distributions)
      if (dist.recipients >= 1) {
        const totalCORE = dist.totalAmount / 1_000_000;
        const perNft = totalCORE / Math.max(dist.recipients, 1);

        distributions.push({
          date: dist.date,
          txHash: dist.txHashes[0], // Link to first transaction of the batch
          recipients: dist.recipients,
          totalAmount: totalCORE.toFixed(2),
          perNft: perNft.toFixed(4),
        });
      }
    }

    // Sort by date descending
    distributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return distributions.slice(0, 20); // Limit to 20 most recent
  } catch (error) {
    console.error('Error fetching airdrop transactions:', error);
    return [];
  }
}

export async function GET() {
  try {
    const distributions = await fetchAirdropTransactions();

    return NextResponse.json({
      wallet: AIRDROP_WALLET,
      distributions,
    });
  } catch (error) {
    console.error('Failed to fetch distributions:', error);
    return NextResponse.json({ 
      wallet: AIRDROP_WALLET,
      distributions: [] 
    });
  }
}
