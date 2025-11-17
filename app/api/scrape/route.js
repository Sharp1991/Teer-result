// app/api/scrape/route.js
import cheerio from "cheerio";

export async function GET() {
  try {
    const target = "https://teertooday.com/"; // CORRECTED URL
    console.log(`Scraping: ${target}`);
    
    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ 
        error: `Failed to fetch target site: ${res.status}`,
        first: null,
        second: null 
      }), { 
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Look for the exact pattern you mentioned
    let first = null, second = null, date = null, location = "SHILLONG";

    // Get all text content
    const text = $('body').text();
    console.log('Page text sample:', text.substring(0, 500)); // Log first 500 chars to see structure

    // Strategy 1: Look for the exact format with F/R and S/R
    const teerPattern = /F\/R\s*\(.*?\)\s*S\/R\s*\(.*?\)\s*(\d{1,2})\s*(\d{1,2})/i;
    const patternMatch = text.match(teerPattern);
    
    if (patternMatch) {
      first = patternMatch[1];
      second = patternMatch[2];
      console.log(`✅ Found teer numbers using F/R S/R pattern: ${first}, ${second}`);
    }

    // Strategy 2: Look for date in DD-MM-YYYY format
    if (!date) {
      const dateMatch = text.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
      date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-IN').split('/').join('-');
      console.log(`Date found: ${date}`);
    }

    // Strategy 3: Look for SHILLONG text to confirm we're in the right section
    const shillongMatch = text.match(/SHILLONG/i);
    if (shillongMatch) {
      location = "SHILLONG";
      console.log(`Location confirmed: ${location}`);
    }

    // Strategy 4: If pattern matching fails, try to find any two numbers that look like teer results
    if (!first || !second) {
      // Look for two 2-digit numbers close to each other
      const numberPair = text.match(/(\b\d{2}\b)\s+(\b\d{2}\b)/);
      if (numberPair) {
        first = numberPair[1];
        second = numberPair[2];
        console.log(`🔍 Found number pair: ${first}, ${second}`);
      }
    }

    // Strategy 5: Check specific HTML elements that might contain results
    if (!first || !second) {
      // Look in tables
      $('table').each((i, table) => {
        const tableText = $(table).text();
        if (tableText.includes('F/R') || tableText.includes('S/R') || tableText.includes('SHILLONG')) {
          const numbers = tableText.match(/(\d{2})\D+(\d{2})/);
          if (numbers) {
            first = numbers[1];
            second = numbers[2];
            console.log(`📊 Found numbers in table: ${first}, ${second}`);
            return false; // break the loop
          }
        }
      });
    }

    const payload = { 
      date, 
      location, 
      first: first,
      second: second,
      source: target,
      success: !!(first && second)
    };

    console.log('Final payload:', payload);

    return new Response(JSON.stringify(payload), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      first: null,
      second: null
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
