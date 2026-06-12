import type { Result } from "./match.js";

export type EncodedMatchRow = {
  date: Date;
  teamA: string;
  teamB: string;
  match_type: number[];
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
  result: Result;
};

export type ModelDataset = {
  X: number[][];
  y: number[];
  metadata: {
    date: Date;
    teamA: string;
    teamB: string;
  }[];
};

