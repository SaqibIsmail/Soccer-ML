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

export const headers: (keyof RawMatchRowRename)[] = [
  "date",
  "teamA",
  "teamB",
  "match_type",
  "venue_type",
  "teamA_form_last5",
  "teamB_form_last5",
  "teamA_avg_goals_scored",
  "teamA_avg_goals_conceded",
  "teamB_avg_goals_scored",
  "teamB_avg_goals_conceded",
  "teamA_elo",
  "teamB_elo",
  "diff_elo",
  "diff_form_last5",
  "diff_avg_goals_scored",
  "diff_avg_goals_conceded",
  "result",
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

export const MATCH_TYPE_VALUES = [
  "world_cup",
  "world_cup_qualifier",
  "continental_championship",
  "continental_qualifier",
  "nations_league",
  "regional_championship",
  "regional_qualifier",
  "friendly",
  "minor_other",
] as const;

export type MatchType = typeof MATCH_TYPE_VALUES[number];

export const isMatchType = (value: string): value is MatchType => {
  return MATCH_TYPE_VALUES.includes(value as MatchType);
};

export const toMatchType = (value: string): MatchType => {
  if (!isMatchType(value)) {
    throw new Error(`Unknown match_type: ${value}`);
  }

  return value;
};

export const ELO_K_MAP: Record<string, number> = {
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

export type MatchRowWithGoalsAndElo = MatchRowWithGoals & {
  home_team_elo: number;
  away_team_elo: number;
  diff_elo: number;
}



export type RawMatchRowFinal = RawMatchRow & {

  home_form_last5: string;
  home_avg_goals_scored: string;
  home_avg_goals_conceded: string;
  away_form_last5: string;
  away_avg_goals_scored: string;
  away_avg_goals_conceded: string;
  diff_form_last5: string;
  diff_avg_goals_scored: string;
  diff_avg_goals_conceded: string;
  home_team_elo: string;
  away_team_elo: string;
  diff_elo: string;

}

export type RawMatchRowRename = {
  date: string;
  teamA: string;
  teamB: string;
  match_type: string;
  venue_type: string;
  teamA_form_last5: string;
  teamB_form_last5: string;
  teamA_avg_goals_scored: string;
  teamA_avg_goals_conceded: string;
  teamB_avg_goals_scored: string;
  teamB_avg_goals_conceded: string;
  teamA_elo: string;
  teamB_elo: string;
  diff_elo: string;
  diff_form_last5: string;
  diff_avg_goals_scored: string;
  diff_avg_goals_conceded: string;
  result: string;
};

export const ResultValues = {
  teamA_win: 0,
  draw: 1,
  teamB_win: 2,
} as const;

export type Result = typeof ResultValues[keyof typeof ResultValues];

export const MATCH_TYPE_ENCODING: Record<MatchType, number[]> = Object.fromEntries(
  MATCH_TYPE_VALUES.map((matchType, matchTypeIndex) => [
    matchType,
    MATCH_TYPE_VALUES.map((_, index) => index === matchTypeIndex ? 1 : 0),
  ])
) as Record<MatchType, number[]>;



export type ProcessedMatchRow = {
  date: Date;
  teamA: string;
  teamB: string;
  match_type: MatchType;
  is_home: number;
  is_neutral: number;
  teamA_form_last5: number;
  teamB_form_last5: number;
  teamA_avg_goals_scored: number;
  teamA_avg_goals_conceded: number;
  teamB_avg_goals_scored: number;
  teamB_avg_goals_conceded: number;
  teamA_elo: number;
  teamB_elo: number;
  diff_elo: number;
  diff_form_last5: number;
  diff_avg_goals_scored: number;
  diff_avg_goals_conceded: number;
  result: string;
};

export type EncodedMatchRow = {
  date: Date,
  teamA: string,
  teamB: string,
  match_type: number[],
  is_home: number,
  is_neutral: number,
  teamA_form_last5: number,
  teamB_form_last5: number;
  teamA_avg_goals_scored: number,
  teamA_avg_goals_conceded: number,
  teamB_avg_goals_scored: number,
  teamB_avg_goals_conceded: number,
  teamA_elo: number,
  teamB_elo: number,
  diff_elo: number,
  diff_form_last5: number,
  diff_avg_goals_scored: number,
  diff_avg_goals_conceded: number,
  result: Result,
} 
