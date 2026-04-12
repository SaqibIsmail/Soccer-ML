export interface RawMatchRow {
  date: string;
  home_team: string;
  away_team: string;
  home_score: string;
  away_score: string;
  tournament: string;
  country: string;
  neutral: string;
}

export interface MatchRow {
  date: Date;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  tournament: string;
  country: string;
  neutral: boolean;
}

export const headers: (keyof RawMatchRow)[] = [
  "date",
  "home_team",
  "away_team",
  "home_score",
  "away_score",
  "tournament",
  "country",
  "neutral",
];

