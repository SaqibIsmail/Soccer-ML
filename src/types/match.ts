export type RawMatchRow = {
  date: string;
  home_team: string;
  away_team: string;
  home_score: string;
  away_score: string;
  tournament: string;
  country: string;
  neutral: string;
}

export type MatchRow = {
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
export type MatchRowWithGoals = MatchRow & {
  home_form_last5: number;
  home_avg_goals_scored: number;
  home_avg_goals_conceded: number;
  away_form_last5: number;
  away_avg_goals_scored: number;
  away_avg_goals_conceded: number;
  diff_form_last5: number;
  diff_avg_goals_scored: number;
  diff_avg_goals_conceded: number;
};

export type GameOutcomeInfo = {
  rowIndex: number,
  goalFor: number,
  goalAgainst: number,
  outcome: string,
};

export const ELO_K_MAP = {
  world_cup: 60,
  world_cup_qualifier: 50,
  continental_championship: 45,
  continental_qualifier: 35,
  nations_league: 30,
  regional_championship: 25,
  regional_qualifier: 20,
  friendly: 15,
  minor_other: 10,
};

