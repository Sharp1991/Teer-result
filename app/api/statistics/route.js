// FIRST ROUND ONLY STATISTICS
function calculateFirstRoundStatistics(results) {
  const last60Rounds = results.slice(0, 60);
  const last365Rounds = results.slice(0, 365);

  const firstRoundNumbers = results.map(r => r.first_round);
  const last60FirstRound = last60Rounds.map(r => r.first_round);
  const last365FirstRound = last365Rounds.map(r => r.first_round);

  return {
    hotNumbers: calculateFrequency(last60FirstRound, 10),
    dueNumbers: calculateDueNumbers(firstRoundNumbers, results, 'first_round'),
    frequentNumbers: calculateFrequentNumbers(firstRoundNumbers, results, 'first_round'),
    nonFrequentNumbers: calculateNonFrequentNumbers(firstRoundNumbers, results, 'first_round'),
    yearlyHot: calculateFrequency(last365FirstRound, 10),
    yearlyCold: calculateColdNumbers(last365FirstRound, 10),
    allTimeHot: calculateFrequency(firstRoundNumbers, 10),
    allTimeCold: calculateColdNumbers(firstRoundNumbers, 10)
  };
}

// SECOND ROUND ONLY STATISTICS
function calculateSecondRoundStatistics(results) {
  const last60Rounds = results.slice(0, 60);
  const last365Rounds = results.slice(0, 365);

  const secondRoundNumbers = results.map(r => r.second_round);
  const last60SecondRound = last60Rounds.map(r => r.second_round);
  const last365SecondRound = last365Rounds.map(r => r.second_round);

  return {
    hotNumbers: calculateFrequency(last60SecondRound, 10),
    dueNumbers: calculateDueNumbers(secondRoundNumbers, results, 'second_round'),
    frequentNumbers: calculateFrequentNumbers(secondRoundNumbers, results, 'second_round'),
    nonFrequentNumbers: calculateNonFrequentNumbers(secondRoundNumbers, results, 'second_round'),
    yearlyHot: calculateFrequency(last365SecondRound, 10),
    yearlyCold: calculateColdNumbers(last365SecondRound, 10),
    allTimeHot: calculateFrequency(secondRoundNumbers, 10),
    allTimeCold: calculateColdNumbers(secondRoundNumbers, 10)
  };
}

// 1. HOT NUMBERS
function calculateFrequency(roundNumbers, limit = 10) {
  const frequency = {};
  roundNumbers.forEach(number => {
    frequency[number] = (frequency[number] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([number, count]) => ({
      number: parseInt(number),
      count
    }));
}

// 2. DUE NUMBERS — Longest since last appearance
function calculateDueNumbers(roundNumbers, allResults, roundType) {
  const lastAppearance = {};
  const today = new Date();

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
      : 999;

    dueNumbers.push({ number: num, days: daysSince });
  }

  return dueNumbers
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

// 3. FREQUENT NUMBERS — Shortest average gap
function calculateFrequentNumbers(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(roundNumbers, allResults, roundType);

  return gaps
    .filter(gap => gap.days > 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 10);
}

// 4. NON-FREQUENT NUMBERS — Longest average gap
function calculateNonFrequentNumbers(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(roundNumbers, allResults, roundType);

  return gaps
    .filter(gap => gap.days > 0)
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

// 6. YEARLY COLD & ALL TIME COLD
function calculateColdNumbers(roundNumbers, limit = 10) {
  const frequency = {};
  roundNumbers.forEach(number => {
    frequency[number] = (frequency[number] || 0) + 1;
  });

  const allNumbers = [];
  for (let num = 0; num <= 99; num++) {
    allNumbers.push({ number: num, count: frequency[num] || 0 });
  }

  return allNumbers
    .sort((a, b) => a.count - b.count)
    .slice(0, limit);
}

// GAP HELPER
function calculateAllGaps(roundNumbers, allResults, roundType) {
  const appearances = {};
  const sorted = [...allResults].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(result => {
    const number = result[roundType];
    const date = new Date(result.date);

    if (!appearances[number]) appearances[number] = [];
    appearances[number].push(date);
  });

  const gaps = [];

  for (let num = 0; num <= 99; num++) {
    if (appearances[num] && appearances[num].length > 1) {
      const gapDays = [];

      for (let i = 1; i < appearances[num].length; i++) {
        const gap =
          Math.floor((appearances[num][i] - appearances[num][i - 1]) / (1000 * 60 * 60 * 24));
        gapDays.push(gap);
      }

      const avgGap = gapDays.reduce((a, b) => a + b, 0) / gapDays.length;
      gaps.push({ number: num, days: Math.round(avgGap) });
    } else {
      gaps.push({ number: num, days: 999 });
    }
  }

  return gaps;
}
