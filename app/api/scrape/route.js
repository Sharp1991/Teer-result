// app/api/scrape/route.js
import cheerio from "cheerio";

export async function GET() {
  try {
    const target = "https://teertoday.com/";
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

    // Strategy 1: Look for the exact format "F/R(3:30PM) S/R(4:30PM)" followed by numbers
    const text = $('body').text();
    
    // Look for the pattern: F/R(3:30PM) S/R(4:30PM) followed by two numbers
    const teerPattern = /F\/R\s*\(\d{1,2}:\d{2}\s*[AP]M\)\s*S\/R\s*\(\d{1,2}:\d{2}\s*[AP]M\)\s*(\d{1,2})\s*(\d{1,2})/i;
    const patternMatch = text.match(teerPattern);
    
    if (patternMatch) {
      first = patternMatch[1];
      second = patternMatch[2];
      console.log(`Found teer numbers using pattern: ${first}, ${second}`);
    }

    // Strategy 2: Look for date in DD-MM-YYYY format near the results
    if (!date) {
      const dateMatch = text.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
      date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-IN').split('/').join('-');
    }

    // Strategy 3: If pattern matching fails, look for two numbers near "F/R" and "S/R"
    if (!first || !second) {
      const frIndex = text.indexOf('F/R');
      const srIndex = text.indexOf('S/R');
      
      if (frIndex !== -1 && srIndex !== -1) {
        // Look for numbers after F/R and S/R
        const afterFR = text.substring(frIndex, frIndex + 100);
        const afterSR = text.substring(srIndex, srIndex + 100);
        
        const frNumberMatch = afterFR.match(/(\d{1,2})/);
        const srNumberMatch = afterSR.match(/(\d{1,2})/);
        
        if (frNumberMatch && srNumberMatch) {
          first = frNumberMatch[1];
          second = srNumberMatch[1];
          console.log(`Found numbers near F/R S/R: ${first}, ${second}`);
        }
      }
    }

    // Strategy 4: Look for table structure that might contain the results
    if (!first || !second) {
      $('table').each((i, table) => {
        const tableText = $(table).text();
        if (tableText.includes('F/R') && tableText.includes('S/R')) {
          const numbers = tableText.match(/(\d{1,2})\D+(\d{1,2})/);
          if (numbers) {
            first = numbers[1];
            second = numbers[2];
            console.log(`Found numbers in table: ${first}, ${second}`);
            return false; // break the loop
          }
        }
      });
    }

    const payload = { 
      date, 
      location, 
      first: first || null,
      second: second || null,
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
