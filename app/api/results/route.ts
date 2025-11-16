import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const scrapeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/scrape`, {
      next: { revalidate: 300 }
    });
    
    if (!scrapeResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results from scraping service' },
        { status: 500 }
      );
    }

    const scrapedData = await scrapeResponse.json();
    
    if (!scrapeResponse.ok) {
      return NextResponse.json(
        { error: 'Scraping service returned an error' },
        { status: 500 }
      );
    }

    if (!scrapedData.date || !scrapedData.first || !scrapedData.second) {
      return NextResponse.json(
        { error: 'Incomplete data received from source' },
        { status: 500 }
      );
    }

    const result = {
      date: scrapedData.date,
      firstRound: scrapedData.first,
      secondRound: scrapedData.second,
      location: scrapedData.location || 'SHILLONG',
      time: '4:30 PM'
    };

    return NextResponse.json({ 
      results: [result],
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to data source' },
      { status: 500 }
    );
  }
}
