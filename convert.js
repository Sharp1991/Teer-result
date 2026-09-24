const fs = require("fs");

const inputFile = "Teer.txt";
const outputFile = "results.json";

const lines = fs.readFileSync(inputFile, "utf-8").split(/\r?\n/);

const results = [];
const issues = [];
const seenDates = new Map();

function isValidDate(dateRaw) {
  const match = dateRaw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return false;

  const [, dd, mm, yyyy] = match;

  const date = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);

  return (
    date.getUTCFullYear() === Number(yyyy) &&
    date.getUTCMonth() + 1 === Number(mm) &&
    date.getUTCDate() === Number(dd)
  );
}

function formatValue(value) {
  if (!value || value.toLowerCase() === "xx") {
    return null;
  }

  // Keep Teer numbers as strings.
  // This preserves values such as "07".
  return value;
}

for (let i = 0; i < lines.length; i++) {
  const originalLine = lines[i];
  const line = originalLine.trim();

  // Skip empty lines and headers
  if (
    !line ||
    line.startsWith("Date") ||
    line === "RESULTS"
  ) {
    continue;
  }

  const parts = line.split(/\s+/);

  if (parts.length < 3) {
    issues.push({
      line: i + 1,
      reason: "Not enough columns",
      content: originalLine
    });
    continue;
  }

  const [dateRaw, frRaw, srRaw] = parts;

  // Validate date
  if (!isValidDate(dateRaw)) {
    issues.push({
      line: i + 1,
      reason: "Invalid date",
      content: originalLine
    });
    continue;
  }

  const [dd, mm, yyyy] = dateRaw.split("-");
  const date = `${yyyy}-${mm}-${dd}`;

  const fr = formatValue(frRaw);
  const sr = formatValue(srRaw);

  if (fr === null || sr === null) {
    issues.push({
      line: i + 1,
      reason: "Missing result",
      date,
      content: originalLine
    });
  }

  const record = {
    date,
    fr,
    sr
  };

  // Detect duplicate dates
  if (seenDates.has(date)) {
    const existing = seenDates.get(date);

    if (
      existing.fr === record.fr &&
      existing.sr === record.sr
    ) {
      issues.push({
        line: i + 1,
        reason: "Exact duplicate",
        date,
        content: originalLine
      });
      continue;
    }

    // Same date but different result
    issues.push({
      line: i + 1,
      reason: "CONFLICTING duplicate date",
      date,
      existing,
      newRecord: record,
      content: originalLine
    });

    continue;
  }

  seenDates.set(date, record);
  results.push(record);
}

// Sort oldest → newest
results.sort((a, b) => a.date.localeCompare(b.date));

// Write JSON
fs.writeFileSync(
  outputFile,
  JSON.stringify(results, null, 2),
  "utf-8"
);

// Summary
console.log("\n=================================");
console.log("Teer TXT → JSON Conversion");
console.log("=================================\n");

console.log(`Input lines:      ${lines.length}`);
console.log(`Valid records:    ${results.length}`);
console.log(`Issues found:     ${issues.length}`);
console.log(`Output file:      ${outputFile}`);

if (issues.length > 0) {
  console.log("\n⚠️ Issues requiring review:\n");

  for (const issue of issues) {
    console.log(issue);
  }
} else {
  console.log("\n✅ No issues found.");
}

console.log("\n✅ Conversion complete.");
