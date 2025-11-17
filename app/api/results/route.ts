// app/api/results/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching results from scrape service...');

    const scrapeResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/scrape`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    console.log('Scrape response status:', scrapeResponse.status);

    if (!scrapeResponse.ok) {
      return NextResponse.json(
        { error: 'Scraping service unavailable', results: [] },
        { status: 503 }
      );
    }

    const scrapedData = await scrapeResponse.json();
    console.log('Scraped data:', scrapedData);

    // Direct access to the flat object properties
    const first = scrapedData.first;
    const second = scrapedData.second;

    if (!first || !second) {
      return NextResponse.json(
        { error: 'Could not extract result data from source', results: [] },
        { status: 500 }
      );
    }

    const result = {
      date: scrapedData.date || new Date().toLocaleDateString('en-IN'),
      firstRound: first,
      secondRound: second,
      location: scrapedData.location || 'SHILLONG',
      time: '4:30 PM',
      source: 'teertoday.com',
    };

    return NextResponse.json({
      success: true,
      results: [result],
      lastUpdated: new Date().toISOString(),
      source: 'teertoday.com',
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to scraping service', results: [] },
      { status: 500 }
    );
  }
}
