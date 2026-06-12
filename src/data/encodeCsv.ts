import { parse } from "csv-parse";
import { type RawMatchRowRename, type MatchType, MATCH_TYPE_ENCODING, type Result, ResultValues, type ProcessedMatchRow, toMatchType } from "../types/match.js";
import { type EncodedMatchRow, type ModelDataset } from "../types/encode.js";
import fs from "node:fs";

export const encodeDataset = async (inputFilePath: string): Promise<EncodedMatchRow[]> => {

    const rows: ProcessedMatchRow[] = await readProcessedCsv(inputFilePath);
    const encodedRows: EncodedMatchRow[] = encodeRows(rows);
    return encodedRows;

}

const readProcessedCsv = async (inputFilePath: string): Promise<ProcessedMatchRow[]> => {
    const rows: ProcessedMatchRow[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(parse({ columns: true, trim: true }))
            .on("data", (row: RawMatchRowRename) => {
                rows.push(normalizeProcessedRow(row));
            })
            .on("end", resolve)
            .on("error", reject);
    });


    return rows;
};

const normalizeProcessedRow = (row: RawMatchRowRename): ProcessedMatchRow => (
    {
        date: new Date(row.date),
        teamA: row.teamA,
        teamB: row.teamB,
        match_type: toMatchType(row.match_type),
        ...normalizeVenueType(row.venue_type),
        teamA_form_last5: Number(row.teamA_form_last5),
        teamB_form_last5: Number(row.teamB_form_last5),
        teamA_avg_goals_scored: Number(row.teamA_avg_goals_scored),
        teamA_avg_goals_conceded: Number(row.teamA_avg_goals_conceded),
        teamB_avg_goals_scored: Number(row.teamB_avg_goals_scored),
        teamB_avg_goals_conceded: Number(row.teamB_avg_goals_conceded),
        teamA_elo: Number(row.teamA_elo),
        teamB_elo: Number(row.teamB_elo),
        diff_elo: Number(row.diff_elo),
        diff_form_last5: Number(row.diff_form_last5),
        diff_avg_goals_scored: Number(row.diff_avg_goals_scored),
        diff_avg_goals_conceded: Number(row.diff_avg_goals_conceded),
        result: row.result,
    });

const encodeMatchType = (matchType: MatchType) =>
    MATCH_TYPE_ENCODING[matchType];

const normalizeVenueType = (venueType: string): Pick<ProcessedMatchRow, "is_home" | "is_neutral"> => {
    if (venueType === "false") return { is_home: 1, is_neutral: 0 };
    if (venueType === "true") return { is_home: 0, is_neutral: 1 };

    throw new Error(`Unknown venue_type: ${venueType}`);
};

const encodeVenueType = (row: Pick<ProcessedMatchRow, "is_home" | "is_neutral">) => {
    return {
        is_home: row.is_home ? 1 : 0,
        is_neutral: row.is_neutral ? 1 : 0,
    };
};

const encodeResult = (matchResult: string): Result => {
    if (matchResult === "teamA_win") return 0;
    if (matchResult === "draw") return 1;
    if (matchResult === "teamB_win") return 2;

    throw new Error(`Unknown result: ${matchResult}`);
};

const encodeRows = (rows: ProcessedMatchRow[]): EncodedMatchRow[] => {

    return rows.map((row) => {
        const venueEncoding = encodeVenueType(row);

        return {
            date: row.date,
            teamA: row.teamA,
            teamB: row.teamB,
            match_type: encodeMatchType(row.match_type),
            is_home: venueEncoding.is_home,
            is_neutral: venueEncoding.is_neutral,
            teamA_form_last5: row.teamA_form_last5,
            teamB_form_last5: row.teamB_form_last5,
            teamA_avg_goals_scored: row.teamA_avg_goals_scored,
            teamA_avg_goals_conceded: row.teamA_avg_goals_conceded,
            teamB_avg_goals_scored: row.teamB_avg_goals_scored,
            teamB_avg_goals_conceded: row.teamB_avg_goals_conceded,
            teamA_elo: row.teamA_elo,
            teamB_elo: row.teamB_elo,
            diff_elo: row.diff_elo,
            diff_form_last5: row.diff_form_last5,
            diff_avg_goals_scored: row.diff_avg_goals_scored,
            diff_avg_goals_conceded: row.diff_avg_goals_conceded,
            result: encodeResult(row.result),
        };
    })

};


export const rowsToModalDataset = (encodedRows: EncodedMatchRow[]): ModelDataset => ({
  X: encodedRows.map((row) => [
    ...row.match_type,
    row.is_home,
    row.is_neutral,
    row.teamA_form_last5,
    row.teamB_form_last5,
    row.teamA_avg_goals_scored,
    row.teamA_avg_goals_conceded,
    row.teamB_avg_goals_scored,
    row.teamB_avg_goals_conceded,
    row.teamA_elo,
    row.teamB_elo,
    row.diff_elo,
    row.diff_form_last5,
    row.diff_avg_goals_scored,
    row.diff_avg_goals_conceded,
  ]),
  y: encodedRows.map((row) => row.result),
  metadata: encodedRows.map((row) => ({
    date: row.date,
    teamA: row.teamA,
    teamB: row.teamB,
  })),
});


export const confirmDataArrayLength = (dataset : ModelDataset) => {
    const oneLen = dataset.X.length;
   if (dataset.y.length === oneLen){
    return oneLen; 
   }
   
   return -1;
}









