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


