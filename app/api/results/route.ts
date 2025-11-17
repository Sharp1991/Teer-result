import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Scraping teer results from Previous-Results.php...');
    
    const targetUrl = 'https://teertooday.com/Previous-Results.php';
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Website returned ${response.status}`);
    }

    const html = await response.text();
    console.log('Successfully fetched HTML');

    // Extract data from the table
    const { today, history } = extractResultsFromTable(html);

    return NextResponse.json({
      success: true,
      today,
      history: history.slice(0, 7), // Only last 7 days
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch results. Please try again later.',
      today: null,
      history: []
    }, { status: 500 });
  }
}

function extractResultsFromTable(html: string) {
  const today = new Date();
  const todayDateStr = today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).replace(/\//g, '-');

  const results = [];
  
  // Regex to find table rows with the pattern: Date + F/R + S/R + City
  const rowPattern = /(\d{2}-\d{2}-\d{4})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>([^<]+)</gi;
  
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const [_, date, firstRound, secondRound, city] = match;
    
    results.push({
      date,
      firstRound,
      secondRound, 
      location: city.trim(),
      status: date === todayDateStr ? 'live' as const : 'cached' as const
    });
  }

  // Find today's result (first one in the list)
  const todayResult = results.find(r => r.date === todayDateStr) || results[0];

  // If no today result found, create one from the latest available
  if (!todayResult && results.length > 0) {
    const latest = results[0];
    return {
      today: {
        date: todayDateStr,
        firstRound: latest.firstRound,
        secondRound: latest.secondRound,
        location: latest.location,
        status: 'cached' as const
      },
      history: results
    };
  }

  return {
    today: todayResult || {
      date: todayDateStr,
      firstRound: '00',
      secondRound: '00',
      location: 'Shillong',
      status: 'cached' as const
    },
    history: results
  };
}
