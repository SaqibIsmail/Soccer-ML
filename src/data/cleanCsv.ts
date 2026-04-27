import fs from "node:fs";
import { parse } from "csv-parse";
import { headers, type MatchRow, type RawMatchRow } from "../types/match.js";

const normalizeTournamentName = (tournament: string): string => {
  const normalizedTournamentMap: Record<string, string> = {
    "Copa América": "Copa America",
    "Copa América qualifier": "Copa America qualifier",
    "European Nations League": "UEFA Nations League",
    "European Nations League A": "UEFA Nations League",
    "European Nations League B": "UEFA Nations League",
    "European Nations League C": "UEFA Nations League",
    "European Nations League D": "UEFA Nations League",
    "European Nations League A/B": "UEFA Nations League",
    "European Nations League B/C": "UEFA Nations League",
    "CONCACAF Nations League": "CONCACAF Nations League",
    "CONCACAF Nations League A": "CONCACAF Nations League",
    "CONCACAF Nations League B": "CONCACAF Nations League",
    "CONCACAF Nations League C": "CONCACAF Nations League",
    "CONCACAF Nations League q": "CONCACAF Nations League qualifier",
    "Asian Cup & Asian Chlg Cup q": "Asian Cup qualification",
    "Asian Cup q & Asian Chlg Cup": "Asian Cup qualification",
    "Asian Cup qualifier": "Asian Cup qualification",
    "Oceania Nations Cup qualifier": "Oceania Nations Cup qualification",
  };

  return normalizedTournamentMap[tournament] ?? tournament;
};

const normalizeRow = (row: RawMatchRow): MatchRow => ({
  date: new Date(row.date),
  homeTeam: row.home_team,
  awayTeam: row.away_team,
  homeScore: Number(row.home_score),
  awayScore: Number(row.away_score),
  tournament: normalizeTournamentName(row.tournament),
  country: row.country,
  neutral: row.neutral === "true",
});

const processCsv = async (inputFilePath: string): Promise<MatchRow[]> => {
  const rows: MatchRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(inputFilePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row: RawMatchRow) => {
        rows.push(normalizeRow(row));
      })
      .on("end", resolve)
      .on("error", reject);
  });

  return rows;
};

const filterMatches = (matches: MatchRow[], filterFrom: Date, filterTo: Date): MatchRow[] => {
  const cleanedMatches: MatchRow[] = matches.filter((match) => match.date >= filterFrom && match.date <= filterTo)
  return cleanedMatches;
}

const convertDataToString = (matches: MatchRow[]): RawMatchRow[] => {
  const rawMatches: RawMatchRow[] = matches.map((match) => ({
    date: match.date.toISOString().split("T")[0] ?? 'Not found',
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    home_score: match.homeScore.toString(),
    away_score: match.awayScore.toString(),
    tournament: match.tournament,
    country: match.country,
    neutral: match.neutral.toString()
  }));

  return rawMatches;
}

const escapeCsvValue = (value: string): string => {

  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value;
}

const writeStringRowsToCsv = async (rawMatches: RawMatchRow[], outputFilePath: string): Promise<void> => {
  const headerLine = headers.join(",");

  const dataLines = rawMatches.map((row) => {
    return headers.map((header) => {
      const value = row[header];
      const cleanedValue = escapeCsvValue(value);
      return cleanedValue;
    }).join(",");
  });

  const csvRows = [headerLine, ...dataLines].join("\n");
  await fs.promises.writeFile(outputFilePath, csvRows, "utf-8");
}

export const cleanData = async (inputFilePath: string, trainingOutputFilePath: string, testingOutputFilePath: string): Promise<boolean> => {
  const preProcessedMatchRows: MatchRow[] = await processCsv(inputFilePath);
  if (preProcessedMatchRows.length === 0) {
    throw new Error('No rows to read');
  }

  const trainingSet: MatchRow[] = filterMatches(preProcessedMatchRows, new Date('2006-01-01'), new Date('2019-01-01'));
  const testingSet: MatchRow[] = filterMatches(preProcessedMatchRows, new Date('2020-01-01'), new Date('2026-01-01'));

  const stringtrainingSet: RawMatchRow[] = convertDataToString(trainingSet);
  const stringtestingSet: RawMatchRow[] = convertDataToString(testingSet);

  try {
    await Promise.all([
      writeStringRowsToCsv(stringtrainingSet, trainingOutputFilePath),
      writeStringRowsToCsv(stringtestingSet, testingOutputFilePath),
    ]);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
