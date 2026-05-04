import fs from "node:fs";
import { parse } from "csv-parse";
import { headers, type MatchRow, type RawMatchRow, type GameOutcomeInfo, type MatchRowWithGoals, ELO_K_MAP, type MatchRowWithGoalsAndElo, type RawMatchRowFinal, type RawMatchRowRename } from "../types/match.js";

const normalizeTournamentName = (tournament: string): string => {
  const worldCup = new Set<string>([
    "World Cup",
  ]);

  const worldCupQualifier = new Set<string>([
    "World Cup qualifier",
    "World Cup and African Cup qual",
    "World Cup and Asian Cup qual",
    "World Cup and CONCACAF Ch q",
    "World Cup q & British Ch",
    "World Cup q & Nordic Ch",
    "World Cup q and CONCACAF Ch",
    "W Cup and Oce Cup q and S Pac G",
    "WC and Oce Cup q",
    "WC q and Oce Cup",
    "NA Champ & WC qual",
  ]);

  const continentalChampionship = new Set<string>([
    "African Nations Cup",
    "Asian Cup",
    "CONCACAF Championship",
    "CCCF Championship",
    "Copa America",
    "Copa América",
    "European Championship",
    "North American Champ",
    "Oceania Nations Cup",
    "Panamerican Championship",
    "South American Champ",
    "Confederations Cup",
  ]);

  const continentalQualifier = new Set<string>([
    "African Nations Cup qualifier",
    "Asian Cup qualifier",
    "Asian Cup & Asian Chlg Cup q",
    "Asian Cup q & Asian Chlg Cup",
    "CONCACAF Champ qual",
    "Copa America qualifier",
    "Copa América qualifier",
    "European Championship qual",
    "Oceania Nations Cup qualifier",
    "South American Champ qual",
    "Afr Games q & C Afr Cup",
    "Afr Games q & W Afr Cup",
  ]);

  const nationsLeague = new Set<string>([
    "European Nations League",
    "European Nations League A",
    "European Nations League B",
    "European Nations League C",
    "European Nations League D",
    "European Nations League A/B",
    "European Nations League B/C",
    "European Nations League C/D",
    "CONCACAF Nations League",
    "CONCACAF Nations League A",
    "CONCACAF Nations League B",
    "CONCACAF Nations League C",
    "CONCACAF Nations League q",
  ]);

  const regionalChampionship = new Set<string>([
    "AFC-OFC Challenge Cup",
    "African Games",
    "Afro-Asian Cup",
    "Afro-Asian Games",
    "Amilcar Cabral Cup",
    "Arab Cup",
    "Asian Challenge Cup",
    "Asian Games",
    "Asian Solidarity Cup",
    "Balkan Cup",
    "Baltic Cup",
    "Baltic Tournament",
    "Bangabandhu Gold Cup",
    "Bolivarian Games",
    "British Championship",
    "CECAFA Cup",
    "CEDEAO Cup",
    "CEMAC Cup",
    "CFU Championship",
    "COMESA Cup",
    "CONCACAF Cup",
    "CONCACAF Series",
    "COSAFA Cup",
    "Caribbean Championship",
    "Caribbean Cup",
    "Central African Games",
    "Central American Cup",
    "Central American Games",
    "Central Asian Nations Cup",
    "East Asian Championship",
    "East Asian Games",
    "Gulf Cup",
    "Indian Ocean Cup",
    "Indian Ocean Games",
    "Indian Ocean Tournament",
    "Islamic Games",
    "Island Games",
    "King's Cup",
    "Korea Cup",
    "Leeward Islands Champ",
    "Mediterranean Cup",
    "Mediterranean Games",
    "Melanesian Cup",
    "Micronesian Cup",
    "Micronesian Games",
    "N Am Ch & UNCAF Cup q",
    "N Am Ch q & UNCAF Cup",
    "Nehru Gold Cup",
    "Olympic Games",
    "Pacific Cup",
    "Pacific Games",
    "Pacific Mini Games",
    "Pan Arab Games",
    "Pan Arab Games & Arab Cup",
    "Panamerican Games",
    "SE Asian Peninsula Games",
    "South Asian Championship",
    "South Asian Games",
    "South Asian Super Cup",
    "South Pacific Games",
    "South Pacific Mini Games",
    "Southeast Asian Champ",
    "Southeast Asian Games",
    "Trans-Caucasian Champ",
    "UNCAF Nations Cup",
    "West African Cup",
    "West African Nations Cup",
    "West Asian Championship",
    "West Asian Games",
    "Windward Islands Champ",
    "Zone V Tournament",
  ]);

  const regionalQualifier = new Set<string>([
    "African Games qualifier",
    "Arab Cup qualifier",
    "Caribbean Championship qual",
    "Caribbean Cup qualifier",
    "CEDEAO Cup qualifier",
    "CFU Championship qualifier",
    "CONCACAF Ch & Car Ch q",
    "CONCACAF Ch & Car Cup q",
    "CONCACAF Ch q & C Am Cup",
    "CONCACAF Ch q & Car Ch",
    "CONCACAF Ch q & Car Ch PO",
    "CONCACAF Ch q & Car Cup",
    "East Asian Championship qual",
    "Euro Ch q & British Ch",
    "Euro Ch q & Nordic Ch",
    "Oce Cup q & Melanesian Cup",
    "Oce Cup q & Polynesian Cup",
    "Oly qual & Nrd Ch",
    "Olympic Games qualifier",
    "Pan American Games qualifier",
    "Southeast Asian Champ qual",
  ]);

  const friendly = new Set<string>([
    "Friendly",
    "Friendly tournament",
    "FIFA Series",
  ]);

  if (worldCup.has(tournament)) return "world_cup";
  if (worldCupQualifier.has(tournament)) return "world_cup_qualifier";
  if (continentalChampionship.has(tournament)) return "continental_championship";
  if (continentalQualifier.has(tournament)) return "continental_qualifier";
  if (nationsLeague.has(tournament)) return "nations_league";
  if (regionalChampionship.has(tournament)) return "regional_championship";
  if (regionalQualifier.has(tournament)) return "regional_qualifier";
  if (friendly.has(tournament)) return "friendly";

  return "minor_other";
};


const normalizeRow = (row: RawMatchRow): MatchRow => ({
  date: new Date(row.date),
  homeTeam: row.home_team,
  awayTeam: row.away_team,
  homeScore: Number(row.home_score),
  awayScore: Number(row.away_score),
  tournament: normalizeTournamentName(row.tournament),
  country: row.country,
  neutral: row.neutral.toLowerCase() === "true",
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

const filterMatches = (matches: MatchRowWithGoalsAndElo[], filterFrom: Date, filterTo: Date): MatchRowWithGoalsAndElo[] => {
  const cleanedMatches: MatchRowWithGoalsAndElo[] = matches.filter((match) => match.date >= filterFrom && match.date <= filterTo)
  return cleanedMatches;
}

const toFixedString = (value: number): string => value.toFixed(3);

const convertDataToString = (matches: MatchRowWithGoalsAndElo[]): RawMatchRowRename[] => {
  const rawMatches = matches.map((match) => ({
    date: match.date.toISOString().split("T")[0] ?? "Not found",
    teamA: match.homeTeam,
    teamB: match.awayTeam,
    match_type: match.tournament,
    venue_type: match.neutral.toString(),
    teamA_form_last5: toFixedString(match.home_form_last5),
    teamB_form_last5: toFixedString(match.away_form_last5),
    teamA_avg_goals_scored: toFixedString(match.home_avg_goals_scored),
    teamA_avg_goals_conceded: toFixedString(match.home_avg_goals_conceded),
    teamB_avg_goals_scored: toFixedString(match.away_avg_goals_scored),
    teamB_avg_goals_conceded: toFixedString(match.away_avg_goals_conceded),
    teamA_elo: toFixedString(match.home_team_elo),
    teamB_elo: toFixedString(match.away_team_elo),
    diff_elo: toFixedString(match.diff_elo),
    diff_form_last5: toFixedString(match.diff_form_last5),
    diff_avg_goals_scored: toFixedString(match.diff_avg_goals_scored),
    diff_avg_goals_conceded: toFixedString(match.diff_avg_goals_conceded),
    result: match.homeScore > match.awayScore ? "teamA_win" : match.homeScore < match.awayScore ? "teamB_win" : "draw",
  }));

  return rawMatches;
};


const escapeCsvValue = (value: string): string => {

  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value;
}

const writeStringRowsToCsv = async (rawMatches: RawMatchRowRename[], outputFilePath: string): Promise<void> => {
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

const calulateGameHistory = (rowsSortedByDate: MatchRow[]): Map<string, GameOutcomeInfo[]> => {

  const teamToRowIndex = new Map<string, GameOutcomeInfo[]>();

  for (let i = 0; i < rowsSortedByDate.length; i++) {
    const currMatch = rowsSortedByDate[i];

    if (currMatch) {
      const currTeamA = currMatch.homeTeam;
      const currTeamB = currMatch.awayTeam;

      const currTeamAGameOutcome = teamToRowIndex.get(currTeamA) ?? [];
      const currTeamBGameOutcome = teamToRowIndex.get(currTeamB) ?? [];
      let outcomeA;
      let outcomeB;

      if (currMatch.homeScore > currMatch.awayScore) {
        outcomeA = 'win';
        outcomeB = 'lose'
      } else if (currMatch.homeScore < currMatch.awayScore) {
        outcomeA = 'lose';
        outcomeB = 'win'
      } else {
        outcomeA = outcomeB = 'draw'
      }

      const newTeamAGameOutcome = { rowIndex: i, goalFor: currMatch.homeScore, goalAgainst: currMatch.awayScore, outcome: outcomeA };
      const newTeamBGameOutcome = { rowIndex: i, goalFor: currMatch.awayScore, goalAgainst: currMatch.homeScore, outcome: outcomeB };

      teamToRowIndex.set(currTeamA, [...currTeamAGameOutcome, newTeamAGameOutcome]);
      teamToRowIndex.set(currTeamB, [...currTeamBGameOutcome, newTeamBGameOutcome]);
    }
  }

  return teamToRowIndex;
}


const calculateDifferences = (teamHistory: Map<string, GameOutcomeInfo[]>, matches: MatchRow[]): MatchRowWithGoals[] => {

  const rowsWithGoals: MatchRowWithGoals[] = [];
  for (let i = 0; i < matches.length; i++) {
    const row = matches[i];

    if (row !== undefined) {
      const homeTeamHistory = teamHistory.get(row.homeTeam);
      const awayTeamHistory = teamHistory.get(row.awayTeam);


      let homeTeamPerformanceSlice: GameOutcomeInfo[];
      let awayTeamPerformanceSlice: GameOutcomeInfo[];


      if (homeTeamHistory && awayTeamHistory) {

        const homeIndex = homeTeamHistory.findIndex((history) => history.rowIndex === i);
        const awayIndex = awayTeamHistory.findIndex((history) => history.rowIndex === i);

        if (homeIndex >= 5 && awayIndex >= 5) {
          homeTeamPerformanceSlice = homeTeamHistory.slice(homeIndex - 5, homeIndex)
          awayTeamPerformanceSlice = awayTeamHistory.slice(awayIndex - 5, awayIndex)

          if (homeTeamPerformanceSlice && awayTeamPerformanceSlice) {
            rowsWithGoals.push(computePerformanceForRow(row, homeTeamPerformanceSlice, awayTeamPerformanceSlice));
          }
        } else {

          continue;
        }
      }
    }

  }
  return rowsWithGoals;
}

const formScore = (outcome: string): number => {
  if (outcome === "win") return 1;
  if (outcome === "draw") return 0.5;
  return 0;
};

const computePerformanceForRow = (row: MatchRow, homeTeamPerformanceSlice: GameOutcomeInfo[], awayTeamPerformanceSlice: GameOutcomeInfo[]): MatchRowWithGoals => {



  let totalGoalsScoredHome = 0;
  let totalGoalsConceededHome = 0;
  let totalFormHome = 0;

  let totalGoalsScoredAway = 0;
  let totalGoalsConceededAway = 0;
  let totalFormAway = 0;

  homeTeamPerformanceSlice.forEach((history) => {
    totalGoalsScoredHome += history.goalFor;
    totalGoalsConceededHome += history.goalAgainst;
    totalFormHome += formScore(history.outcome);
  })

  awayTeamPerformanceSlice.forEach((history) => {
    totalGoalsScoredAway += history.goalFor;
    totalGoalsConceededAway += history.goalAgainst;
    totalFormAway += formScore(history.outcome);
  })

  const avgGoalsScoredHome = totalGoalsScoredHome / 5;
  const avgGoalsConceededHome = totalGoalsConceededHome / 5;

  const avgGoalsScoredAway = totalGoalsScoredAway / 5;
  const avgGoalsConceededAway = totalGoalsConceededAway / 5;

  const rowWithGoals: MatchRowWithGoals = {
    ...row,
    home_form_last5: totalFormHome,
    home_avg_goals_scored: avgGoalsScoredHome,
    home_avg_goals_conceded: avgGoalsConceededHome,
    away_form_last5: totalFormAway,
    away_avg_goals_scored: avgGoalsScoredAway,
    away_avg_goals_conceded: avgGoalsConceededAway,
    diff_form_last5: totalFormHome - totalFormAway,
    diff_avg_goals_scored: avgGoalsScoredHome - avgGoalsScoredAway,
    diff_avg_goals_conceded: avgGoalsConceededHome - avgGoalsConceededAway,
  }

  return rowWithGoals;
}

const calculateElo = (rowsWithGoals: MatchRowWithGoals[]) => {

  const updatedEloMap: Record<string, number> = {};
  const rowWithGoalsAndElo: MatchRowWithGoalsAndElo[] = [];

  rowsWithGoals.forEach((row) => {

    const oldEloHome = updatedEloMap[row.homeTeam] ?? 1500;
    const oldEloAway = updatedEloMap[row.awayTeam] ?? 1500;

    const expectedResultHome = 1 / (1 + Math.pow(10, ((oldEloAway - oldEloHome) / 400)));
    const expectedResultAway = 1 - expectedResultHome;
    const kValue = ELO_K_MAP[row.tournament];

    let outcomeHome;
    let outcomeAway;

    if (row.homeScore > row.awayScore) {
      outcomeHome = 'win';
      outcomeAway = 'lose'
    } else if (row.homeScore < row.awayScore) {
      outcomeHome = 'lose';
      outcomeAway = 'win'
    } else {
      outcomeHome = outcomeAway = 'draw'
    }

    const actualResultHome = formScore(outcomeHome);
    const actualResultAway = formScore(outcomeAway);

    if (kValue) {
      const newEloHome = oldEloHome + kValue * (actualResultHome - expectedResultHome);
      const newEloAway = oldEloAway + kValue * (actualResultAway - expectedResultAway);

      updatedEloMap[row.homeTeam] = newEloHome;
      updatedEloMap[row.awayTeam] = newEloAway;

      const newRow: MatchRowWithGoalsAndElo = {
        ...row,
        home_team_elo: newEloHome,
        away_team_elo: newEloAway,
        diff_elo: newEloHome - newEloAway,
      };

      rowWithGoalsAndElo.push(newRow);
    } else {
      console.log('Kvalue not found in map');
    }
  });

  return rowWithGoalsAndElo;
}

export const cleanData = async (inputFilePath: string, trainingOutputFilePath: string, testingOutputFilePath: string, validationOutputFilePath: string): Promise<boolean> => {
  const preProcessedMatchRows: MatchRow[] = await processCsv(inputFilePath);
  if (preProcessedMatchRows.length === 0) {
    throw new Error('No rows to read');
  }

  const teamGameHistory = calulateGameHistory(preProcessedMatchRows);
  const teamRowsWithDifferences = calculateDifferences(teamGameHistory, preProcessedMatchRows);

  const teamRowsWithGoalsAndElo: MatchRowWithGoalsAndElo[] = calculateElo(teamRowsWithDifferences);

  const trainingSet: MatchRowWithGoalsAndElo[] = filterMatches(teamRowsWithGoalsAndElo, new Date('2006-01-01'), new Date('2016-12-31'));
  const validationSet: MatchRowWithGoalsAndElo[] = filterMatches(teamRowsWithGoalsAndElo, new Date('2017-01-01'), new Date('2019-12-31'));
  const testingSet: MatchRowWithGoalsAndElo[] = filterMatches(teamRowsWithGoalsAndElo, new Date('2020-01-01'), new Date('2026-01-01'));

  const stringtrainingSet: RawMatchRowRename[] = convertDataToString(trainingSet);
  const stringValidationSet: RawMatchRowRename[] = convertDataToString(validationSet);
  const stringtestingSet: RawMatchRowRename[] = convertDataToString(testingSet);

  try {
    await Promise.all([
      writeStringRowsToCsv(stringtrainingSet, trainingOutputFilePath),
      writeStringRowsToCsv(stringValidationSet, validationOutputFilePath),
      writeStringRowsToCsv(stringtestingSet, testingOutputFilePath),
    ]);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
