// FIRST ROUND ONLY STATISTICS
function calculateFirstRoundStatistics(results) {
  const last60Days = results.slice(0, 60); // Last 60 results
  const last30Days = results.slice(0, 30); // Last 30 results for trends
  const previous30Days = results.slice(30, 60); // Previous 30 days for trends
  
  const firstRoundNumbers = results.map(r => r.first_round);
  const last60FirstRound = last60Days.map(r => r.first_round);
  const last30FirstRound = last30Days.map(r => r.first_round);
  const previous30FirstRound = previous30Days.map(r => r.first_round);

  return {
    hotNumbers: calculateHotNumbers(last60FirstRound),
    dueNumbers: calculateDueNumbers(firstRoundNumbers, results, 'first_round'),
    longestGaps: calculateLongestGaps(firstRoundNumbers, results, 'first_round'),
    shortestGaps: calculateShortestGaps(firstRoundNumbers, results, 'first_round'),
    highProbability: calculateHighProbability(firstRoundNumbers, results, 'first_round'),
    lowProbability: calculateLowProbability(firstRoundNumbers, results, 'first_round'),
    trendingUp: calculateTrendingUp(last30FirstRound, previous30FirstRound),
    trendingDown: calculateTrendingDown(last30FirstRound, previous30FirstRound)
  };
}

// SECOND ROUND ONLY STATISTICS  
function calculateSecondRoundStatistics(results) {
  const last60Days = results.slice(0, 60);
  const last30Days = results.slice(0, 30);
  const previous30Days = results.slice(30, 60);
  
  const secondRoundNumbers = results.map(r => r.second_round);
  const last60SecondRound = last60Days.map(r => r.second_round);
  const last30SecondRound = last30Days.map(r => r.second_round);
  const previous30SecondRound = previous30Days.map(r => r.second_round);

  return {
    hotNumbers: calculateHotNumbers(last60SecondRound),
    dueNumbers: calculateDueNumbers(secondRoundNumbers, results, 'second_round'),
    longestGaps: calculateLongestGaps(secondRoundNumbers, results, 'second_round'),
    shortestGaps: calculateShortestGaps(secondRoundNumbers, results, 'second_round'),
    highProbability: calculateHighProbability(secondRoundNumbers, results, 'second_round'),
    lowProbability: calculateLowProbability(secondRoundNumbers, results, 'second_round'),
    trendingUp: calculateTrendingUp(last30SecondRound, previous30SecondRound),
    trendingDown: calculateTrendingDown(last30SecondRound, previous30SecondRound)
  };
}

// 1. HOT NUMBERS: Most frequent in last 60 days
function calculateHotNumbers(roundNumbers) {
  const frequency = {};
  roundNumbers.forEach(number => {
    frequency[number] = (frequency[number] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([number, count]) => ({ 
      number: parseInt(number), 
      count 
    }));
}

// 2. DUE NUMBERS: Days since last appearance
function calculateDueNumbers(roundNumbers, allResults, roundType) {
  const lastAppearance = {};
  const today = new Date();
  
  // Find last appearance date for each number
  allResults.forEach((result) => {
    const number = result[roundType];
    const resultDate = new Date(result.date);
    
    if (!lastAppearance[number] || resultDate > lastAppearance[number]) {
      lastAppearance[number] = resultDate;
    }
  });
  
  const dueNumbers = [];
  for (let num = 0; num <= 99; num++) {
    const daysSince = lastAppearance[num] 
      ? Math.floor((today - lastAppearance[num]) / (1000 * 60 * 60 * 24))
      : 999; // Never appeared
    
    dueNumbers.push({ number: num, days: daysSince });
  }
  
  return dueNumbers
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

// 3. LONGEST GAPS: Average days between appearances
function calculateLongestGaps(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(roundNumbers, allResults, roundType);
  return gaps.sort((a, b) => b.avgGap - a.avgGap).slice(0, 10);
}

// 4. SHORTEST GAPS: Average days between appearances  
function calculateShortestGaps(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(roundNumbers, allResults, roundType);
  return gaps
    .filter(gap => gap.avgGap > 0) // Exclude numbers with only one appearance
    .sort((a, b) => a.avgGap - b.avgGap)
    .slice(0, 10);
}

// Helper for gap calculations
function calculateAllGaps(roundNumbers, allResults, roundType) {
  const appearances = {};
  const dateSortedResults = [...allResults].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Track all appearance dates for each number
  dateSortedResults.forEach((result) => {
    const number = result[roundType];
    const resultDate = new Date(result.date);
    
    if (!appearances[number]) appearances[number] = [];
    appearances[number].push(resultDate);
  });
  
  const gaps = [];
  for (let num = 0; num <= 99; num++) {
    if (appearances[num] && appearances[num].length > 1) {
      const gapDays = [];
      for (let i = 1; i < appearances[num].length; i++) {
        const gap = Math.floor((appearances[num][i] - appearances[num][i-1]) / (1000 * 60 * 60 * 24));
        gapDays.push(gap);
      }
      const avgGap = gapDays.reduce((a, b) => a + b, 0) / gapDays.length;
      gaps.push({ number: num, days: Math.round(avgGap) });
    } else if (appearances[num]) {
      // Only one appearance - use large gap
      gaps.push({ number: num, days: 999 });
    }
  }
  
  return gaps;
}

// 5. HIGH PROBABILITY: (frequency/total) * (days_since/avg_days_since)
function calculateHighProbability(roundNumbers, allResults, roundType) {
  const probabilities = calculateAllProbabilities(roundNumbers, allResults, roundType);
  return probabilities.sort((a, b) => b.probability - a.probability).slice(0, 10);
}

// 6. LOW PROBABILITY: Inverse of high probability
function calculateLowProbability(roundNumbers, allResults, roundType) {
  const probabilities = calculateAllProbabilities(roundNumbers, allResults, roundType);
  return probabilities.sort((a, b) => a.probability - b.probability).slice(0, 10);
}

// Helper for probability calculations
function calculateAllProbabilities(roundNumbers, allResults, roundType) {
  const frequency = {};
  const lastAppearance = {};
  const today = new Date();
  
  // Calculate frequency and last appearance
  roundNumbers.forEach(number => {
    frequency[number] = (frequency[number] || 0) + 1;
  });
  
  allResults.forEach((result) => {
    const number = result[roundType];
    const resultDate = new Date(result.date);
    if (!lastAppearance[number] || resultDate > lastAppearance[number]) {
      lastAppearance[number] = resultDate;
    }
  });
  
  // Calculate average days since for all numbers
  let totalDaysSince = 0;
  let count = 0;
  for (let num = 0; num <= 99; num++) {
    if (lastAppearance[num]) {
      totalDaysSince += Math.floor((today - lastAppearance[num]) / (1000 * 60 * 60 * 24));
      count++;
    }
  }
  const avgDaysSince = totalDaysSince / count;
  
  const probabilities = [];
  const totalRecords = roundNumbers.length;
  
  for (let num = 0; num <= 99; num++) {
    const freq = frequency[num] || 0;
    const daysSince = lastAppearance[num] 
      ? Math.floor((today - lastAppearance[num]) / (1000 * 60 * 60 * 24))
      : 999;
    
    // Probability formula: (frequency_score) * (time_factor)
    const frequencyScore = freq / totalRecords;
    const timeFactor = daysSince / Math.max(avgDaysSince, 1);
    const probability = Math.min(100, Math.round((frequencyScore * timeFactor * 1000)));
    
    probabilities.push({ number: num, probability });
  }
  
  return probabilities;
}

// 7. TRENDING UP: More frequent in recent 30 days vs previous 30 days
function calculateTrendingUp(currentPeriod, previousPeriod) {
  const trends = calculateAllTrends(currentPeriod, previousPeriod);
  return trends
    .filter(trend => trend.trend > 0) // Only positive trends
    .sort((a, b) => b.trend - a.trend)
    .slice(0, 10);
}

// 8. TRENDING DOWN: Less frequent in recent 30 days vs previous 30 days
function calculateTrendingDown(currentPeriod, previousPeriod) {
  const trends = calculateAllTrends(currentPeriod, previousPeriod);
  return trends
    .filter(trend => trend.trend < 0) // Only negative trends
    .sort((a, b) => a.trend - b.trend)
    .slice(0, 10);
}

// Helper for trend calculations
function calculateAllTrends(currentPeriod, previousPeriod) {
  const currentFreq = {};
  const previousFreq = {};
  
  currentPeriod.forEach(number => {
    currentFreq[number] = (currentFreq[number] || 0) + 1;
  });
  
  previousPeriod.forEach(number => {
    previousFreq[number] = (previousFreq[number] || 0) + 1;
  });
  
  const trends = [];
  for (let num = 0; num <= 99; num++) {
    const current = currentFreq[num] || 0;
    const previous = previousFreq[num] || 0;
    const trend = current - previous; // Positive = trending up
    
    trends.push({ number: num, trend });
  }
  
  return trends;
}
}
