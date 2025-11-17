// app/api/results/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching REAL teer results...');
    
    // Try multiple known teer result websites
    const sources = [
      {
        url: 'https://teertoday.com',
        name: 'teertoday'
      },
      {
        url: 'https://teerresults.com', 
        name: 'teerresults'
      },
      {
        url: 'https://shillongteer.com',
        name: 'shillongteer'
      },
      {
        url: 'https://teercounter.com',
        name: 'teercounter'
      }
    ];

    let finalResult = null;

    // Try each source until we get real data
    for (const source of sources) {
      try {
        console.log(`Trying source: ${source.url}`);
        
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(8000),
        });

        if (response.ok) {
          const html = await response.text();
          const result = parseTeerResults(html, source.name);
          
          // Validate we got real number data
          if (result && isValidResult(result.first) && isValidResult(result.second)) {
            console.log(`Successfully got real data from ${source.name}`);
            finalResult = {
              ...result,
              source: source.name,
              fetchedAt: new Date().toISOString()
            };
            break;
          }
        }
      } catch (sourceError) {
        console.log(`Source ${source.name} failed:`, sourceError.message);
        continue; // Try next source
      }
    }

    if (!finalResult) {
      return NextResponse.json(
        { 
          error: 'All data sources are currently unavailable. Please try again later.',
          results: [] 
        },
        { status: 503 }
      );
    }

    const formattedResult = {
      date: finalResult.date,
      firstRound: finalResult.first,
      secondRound: finalResult.second,
      location: finalResult.location,
      time: finalResult.time || '4:30 PM',
      source: finalResult.source
    };

    return NextResponse.json({ 
      success: true,
      results: [formattedResult],
      lastUpdated: finalResult.fetchedAt,
      source: finalResult.source
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to teer result services. Please check your internet connection and try again.',
        results: [] 
      },
      { status: 500 }
    );
  }
}

// Validate if we got real teer numbers
function isValidResult(num: string): boolean {
  if (!num) return false;
  // Teer numbers are typically between 00-99
  const numVal = parseInt(num);
  return !isNaN(numVal) && numVal >= 0 && numVal <= 99;
}

// Advanced parsing for different teer websites
function parseTeerResults(html: string, source: string): { date: string; first: string; second: string; location: string; time?: string } | null {
  try {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let first = '';
    let second = '';

    // Different parsing strategies for different websites
    switch (source) {
      case 'teertoday':
        // Parse teertoday.com structure
        first = extractNumber(html, /first round[^0-9]*([0-9]{2})/i) || 
                extractNumber(html, /fr[^0-9]*([0-9]{2})/i);
        second = extractNumber(html, /second round[^0-9]*([0-9]{2})/i) || 
                 extractNumber(html, /sr[^0-9]*([0-9]{2})/i);
        break;

      case 'teerresults':
        // Parse teerresults.com structure  
        first = extractNumber(html, /first[^0-9]*([0-9]{2})/i) ||
                extractNumber(html, /f\.?r[^0-9]*([0-9]{2})/i);
        second = extractNumber(html, /second[^0-9]*([0-9]{2})/i) ||
                 extractNumber(html, /s\.?r[^0-9]*([0-9]{2})/i);
        break;

      case 'shillongteer':
        // Parse shillongteer.com structure
        first = extractNumber(html, /1st[^0-9]*([0-9]{2})/i) ||
                extractNumber(html, /round 1[^0-9]*([0-9]{2})/i);
        second = extractNumber(html, /2nd[^0-9]*([0-9]{2})/i) ||
                 extractNumber(html, /round 2[^0-9]*([0-9]{2})/i);
        break;

      default:
        // Generic parsing for any teer site
        first = extractNumber(html, /([0-9]{2})[^0-9]*first/i) ||
                extractNumber(html, /first[^0-9]*([0-9]{2})/i);
        second = extractNumber(html, /([0-9]{2})[^0-9]*second/i) ||
                 extractNumber(html, /second[^0-9]*([0-9]{2})/i);
    }

    // If we found valid numbers, return them
    if (isValidResult(first) && isValidResult(second)) {
      return {
        date: dateStr,
        first,
        second,
        location: 'SHILLONG',
        time: '4:30 PM'
      };
    }

    return null;

  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

// Helper function to extract numbers from HTML
function extractNumber(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  return match ? match[1] : '';
}
