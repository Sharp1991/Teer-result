import { NextResponse } from 'next/server';

interface TeerResult {
  date: string;
  firstRound: string;
  secondRound: string;
  time?: string;
  location?: string;
}

export async function GET() {
  try {
    // Use your existing scraping API
    const scrapeResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/scrape`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!scrapeResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch results from scraping service' },
        { status: 500 }
      );
    }

    const scrapedData = await scrapeResponse.json();
    
    if (!scrapedData.date || !scrapedData.first || !scrapedData.second) {
      return NextResponse.json(
        { error: 'Incomplete data received from source' },
        { status: 500 }
      );
    }

    const result: TeerResult = {
      date: scrapedData.date,
      firstRound: scrapedData.first,
      secondRound: scrapedData.second,
      location: scrapedData.location || 'SHILLONG',
      time: '4:30 PM' // Default time for Teer
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
