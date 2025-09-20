// src/app/api/history/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Interface pour le cache des taux historiques
interface RateCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

const historyCache: RateCache = {};
const HISTORY_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function generateMockHistoricalData(from: string, to: string, days: number = 7) {
  // This is mock data - replace with real API calls in production
  const data = [];
  
  // Base rates for common pairs
  let baseRate = 1.0;
  if (from === 'USD' && to === 'EUR') baseRate = 0.85;
  else if (from === 'EUR' && to === 'USD') baseRate = 1.18;
  else if (from === 'USD' && to === 'GBP') baseRate = 0.73;
  else if (from === 'GBP' && to === 'USD') baseRate = 1.37;
  else if (from === 'USD' && to === 'JPY') baseRate = 110.0;
  else if (from === 'JPY' && to === 'USD') baseRate = 0.009;
  else {
    // Generate a reasonable rate for other pairs
    baseRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
  }
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation (±5%)
    const variation = (Math.random() - 0.5) * 0.1;
    const rate = baseRate + (baseRate * variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: Math.round(rate * 10000) / 10000,
    });
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || 'USD';
    const to = searchParams.get('to') || 'EUR';
    const days = parseInt(searchParams.get('days') || '7');

    // Validation des paramètres
    if (days > 30) {
      return NextResponse.json(
        {
          success: false,
          error: 'Historical data limited to 30 days',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    if (days < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Days parameter must be at least 1',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both from and to currencies are required',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json(
        {
          success: false,
          error: 'From and to currencies cannot be the same',
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    const cacheKey = `history_${from}_${to}_${days}`;

    // Check cache
    if (historyCache[cacheKey] && (Date.now() - historyCache[cacheKey].timestamp) < HISTORY_CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: historyCache[cacheKey].data,
        timestamp: Date.now(),
      });
    }

    // Generate mock historical data
    // In production, replace this with real API calls
    const historicalRates = await generateMockHistoricalData(from, to, days);

    const responseData = {
      from,
      to,
      rates: historicalRates,
      period: `${days} days`,
    };

    // Update cache
    historyCache[cacheKey] = {
      data: responseData,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch historical data',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}