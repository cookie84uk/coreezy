import { NextResponse } from 'next/server';

const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';
const AIRDROP_WALLET = 'core1qxaaycuv8jj669fn0ppqn96ylxfdcw58clwc6d';
const TOTAL_OG_NFTS = 100; // Total OG NFT supply for per-NFT calculation

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
        inputs?: Array<{ address: string; coins: Array<{ denom: string; amount: string }> }>;
        outputs?: Array<{ address: string; coins: Array<{ denom: string; amount: string }> }>;
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
    // Use query parameter format with proper URL encoding
    const query = encodeURIComponent(`message.sender='${AIRDROP_WALLET}'`);
    const url = `${COREUM_REST}/cosmos/tx/v1beta1/txs?query=${query}&pagination.limit=100&order_by=ORDER_BY_DESC`;
    
    console.log('Fetching distributions from:', url);
    
    const response = await fetch(url, { 
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.status);
      return [];
    }

    const data = await response.json();
    const txs: Transaction[] = data.tx_responses || [];

    // Group transactions by date to identify distribution batches
    const distributionsByDate = new Map<string, {
      date: string;
      txHashes: Set<string>;
      totalAmount: number;
      recipientAddresses: Set<string>;
    }>();

    for (const tx of txs) {
      const date = tx.timestamp.split('T')[0]; // YYYY-MM-DD
      
      for (const msg of tx.tx.body.messages) {
        // Handle regular MsgSend (single recipient)
        if (
          msg['@type'] === '/cosmos.bank.v1beta1.MsgSend' &&
          msg.from_address === AIRDROP_WALLET &&
          msg.to_address &&
          msg.amount
        ) {
          const coreAmount = msg.amount.find(a => a.denom === 'ucore');
          if (coreAmount) {
            const existing = distributionsByDate.get(date) || {
              date,
              txHashes: new Set<string>(),
              totalAmount: 0,
              recipientAddresses: new Set<string>(),
            };

            existing.txHashes.add(tx.txhash);
            existing.totalAmount += Number(coreAmount.amount);
            existing.recipientAddresses.add(msg.to_address);

            distributionsByDate.set(date, existing);
          }
        }
        
        // Handle MsgMultiSend (batch sends)
        if (
          msg['@type'] === '/cosmos.bank.v1beta1.MsgMultiSend' &&
          msg.inputs?.some(input => input.address === AIRDROP_WALLET) &&
          msg.outputs
        ) {
          const existing = distributionsByDate.get(date) || {
            date,
            txHashes: new Set<string>(),
            totalAmount: 0,
            recipientAddresses: new Set<string>(),
          };

          existing.txHashes.add(tx.txhash);
          
          for (const output of msg.outputs) {
            const coreAmount = output.coins.find(c => c.denom === 'ucore');
            if (coreAmount) {
              existing.totalAmount += Number(coreAmount.amount);
              existing.recipientAddresses.add(output.address);
            }
          }

          distributionsByDate.set(date, existing);
        }
      }
    }

    // Convert to distribution format
    const distributions: Distribution[] = [];
    const entries = Array.from(distributionsByDate.values());
    
    for (const dist of entries) {
      const recipients = dist.recipientAddresses.size;
      // Only include if there are actual recipients (outgoing transactions)
      if (recipients >= 1 && dist.totalAmount > 0) {
        const totalCORE = dist.totalAmount / 1_000_000;
        // Calculate per NFT based on total OG NFTs (100), not number of recipients
        const perNft = totalCORE / TOTAL_OG_NFTS;

        distributions.push({
          date: dist.date,
          txHash: Array.from(dist.txHashes)[0], // Link to first transaction of the batch
          recipients: recipients,
          totalAmount: totalCORE.toFixed(2),
          perNft: perNft.toFixed(4),
        });
      }
    }

    // Sort by date descending
    distributions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return distributions; // Return all distributions
  } catch (error) {
    console.error('Error fetching airdrop transactions:', error);
    return [];
  }
}

export async function GET() {
  try {
    const distributions = await fetchAirdropTransactions();
    
    // Calculate total distributed over all time
    const totalDistributed = distributions.reduce((sum, d) => sum + parseFloat(d.totalAmount), 0);

    return NextResponse.json({
      wallet: AIRDROP_WALLET,
      distributions,
      totals: {
        totalDistributed: totalDistributed.toFixed(2),
        distributionCount: distributions.length,
      }
    });
  } catch (error) {
    console.error('Failed to fetch distributions:', error);
    return NextResponse.json({ 
      wallet: AIRDROP_WALLET,
      distributions: [],
      totals: {
        totalDistributed: '0',
        distributionCount: 0,
      }
    });
  }
}
