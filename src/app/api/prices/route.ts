import { NextResponse } from 'next/server';

const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';

// COREZ token contract address on Cruise Control
const COREZ_POOL_ADDRESS = 'core1ppuayqt2t0chjkt9jemtyr4v2tl2krqcpjc6ed2yzl9kx75gvwzqquenfg';

interface PriceData {
  corez: {
    priceInCoreum: number;
    priceInUsd: number | null;
  };
  coreum: {
    priceInUsd: number;
  };
  lastUpdated: string;
}

async function getCoreumPrice(): Promise<number> {
  try {
    // Fetch from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=coreum&vs_currencies=usd',
      { next: { revalidate: 60 } } // Cache for 1 minute
    );
    
    if (!response.ok) {
      console.error('CoinGecko API error:', response.status);
      return 0;
    }
    
    const data = await response.json();
    return data.coreum?.usd || 0;
  } catch (error) {
    console.error('Failed to fetch COREUM price:', error);
    return 0;
  }
}

async function getCorezPriceInCoreum(): Promise<number> {
  try {
    // Query the DEX pool to get COREZ/COREUM price
    // This queries the Cruise Control pool contract for reserves
    const response = await fetch(
      `${COREUM_REST}/cosmwasm/wasm/v1/contract/${COREZ_POOL_ADDRESS}/smart/${btoa(JSON.stringify({ pool: {} }))}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      // Fallback to manual price if pool query fails
      console.log('Pool query failed, using fallback price');
      return 0.0283; // Current known price
    }

    const data = await response.json();
    
    // Parse pool reserves to calculate price
    // Pool typically returns assets with amounts
    if (data.data?.assets) {
      const assets = data.data.assets;
      let coreAmount = 0;
      let corezAmount = 0;

      for (const asset of assets) {
        if (asset.info?.native_token?.denom === 'ucore') {
          coreAmount = Number(asset.amount) / 1_000_000;
        } else {
          // COREZ token
          corezAmount = Number(asset.amount) / 1_000_000;
        }
      }

      if (corezAmount > 0 && coreAmount > 0) {
        return coreAmount / corezAmount;
      }
    }

    // Fallback price
    return 0.0283;
  } catch (error) {
    console.error('Failed to fetch COREZ price:', error);
    return 0.0283; // Fallback to known price
  }
}

export async function GET() {
  try {
    const [coreumPrice, corezPriceInCoreum] = await Promise.all([
      getCoreumPrice(),
      getCorezPriceInCoreum(),
    ]);

    const corezPriceInUsd = coreumPrice > 0 ? corezPriceInCoreum * coreumPrice : null;

    const priceData: PriceData = {
      corez: {
        priceInCoreum: corezPriceInCoreum,
        priceInUsd: corezPriceInUsd,
      },
      coreum: {
        priceInUsd: coreumPrice,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return NextResponse.json(
      { 
        corez: { priceInCoreum: 0.0283, priceInUsd: null },
        coreum: { priceInUsd: 0 },
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch live prices'
      },
      { status: 200 } // Return 200 with fallback data
    );
  }
}
