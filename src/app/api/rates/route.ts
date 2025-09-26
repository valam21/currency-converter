// src/app/api/rates/route.ts
import { NextRequest, NextResponse } from 'next/server';

// NOUVELLE INTERFACE : Définit la structure des données de taux
interface RateResponseData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

// Mettez à jour l'interface RateCache (anciennement ligne 4)
interface RateCache {
  [key: string]: {
    data: RateResponseData; // Remplacé 'any' par 'RateResponseData'
    timestamp: number;
  };
}

const rateCache: RateCache = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const API_ENDPOINTS = [
  'https://api.exchangerate-api.com/v4/latest',
  'https://api.fixer.io/latest',
  'https://api.currencyapi.com/v3/latest',
];

async function fetchFromAPI(base: string): Promise<RateResponseData> { // Remplacé 'any' par 'RateResponseData'
  const errors: string[] = [];

  // Try primary API (ExchangeRate-API - free tier)
  try {
    const response = await fetch(`${API_ENDPOINTS[0]}/${base}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        base: data.base,
        rates: data.rates,
        timestamp: Date.now(),
      };
    }
    errors.push(`Primary API failed: ${response.status}`);
  } catch (error) {
    errors.push(`Primary API error: ${error}`);
  }

  // Fallback: return mock data for development
  console.warn('Using mock exchange rates - implement real API keys for production');
  
  // Mock rates for development (these should be replaced with real API calls)
  const mockRates: Record<string, number> = {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 110.0,
    'AUD': 1.35,
    'CAD': 1.25,
    'CHF': 0.92,
    'CNY': 6.45,
    'SEK': 8.75,
    'NZD': 1.42,
    'MXN': 20.5,
    'SGD': 1.35,
    'HKD': 7.8,
    'NOK': 8.9,
    'KRW': 1180,
    'INR': 74.5,
    'BRL': 5.2,
    'ZAR': 14.8,
  };

  // Convert to requested base
  if (base !== 'USD') {
    const baseRate = mockRates[base];
    if (!baseRate) {
      throw new Error(`Unsupported base currency: ${base}`);
    }

    const convertedRates: Record<string, number> = {};
    Object.entries(mockRates).forEach(([currency, rate]) => {
      convertedRates[currency] = rate / baseRate;
    });

    return {
      base,
      rates: convertedRates,
      timestamp: Date.now(),
    };
  }

  return {
    base: 'USD',
    rates: mockRates,
    timestamp: Date.now(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || 'USD';
    const to = searchParams.get('to');

    const cacheKey = `rates_${from}`;

    // Check cache
    if (rateCache[cacheKey] && (Date.now() - rateCache[cacheKey].timestamp) < CACHE_DURATION) {
      const cachedData = rateCache[cacheKey].data;
      
      if (to) {
        // Return specific rate
        const rate = cachedData.rates[to];
        if (!rate) {
          return NextResponse.json(
            {
              success: false,
              error: `Rate not available for ${to}`,
              timestamp: Date.now(),
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            from,
            to,
            rate,
            lastUpdated: new Date(cachedData.timestamp).toISOString(),
          },
          timestamp: Date.now(),
        });
      }

      return NextResponse.json({
        success: true,
        data: cachedData,
        timestamp: Date.now(),
      });
    }

    // Fetch fresh data
    const data = await fetchFromAPI(from);

    // Update cache
    rateCache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };

    if (to) {
      const rate = data.rates[to];
      if (!rate) {
        return NextResponse.json(
          {
            success: false,
            error: `Rate not available for ${to}`,
            timestamp: Date.now(),
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          from,
          to,
          rate,
          lastUpdated: new Date(data.timestamp).toISOString(),
        },
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exchange rates',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}


