import { cleanData } from "./cleanCsv.js";
import * as path from "node:path";
import { confirmDataArrayLength, encodeDataset, rowsToModalDataset as rowsToModelDataset } from "./encodeCsv.js";


export const transformCsvToDataset = async () => {

    const inputFilePath = path.resolve("data/raw/all_matches.csv");
    const trainingOutputFilePath = path.resolve("data/processed/training_matches.csv");
    const testingOutputFilePath = path.resolve("data/processed/testing_matches.csv")
    const validationOutputFilePath = path.resolve("data/processed/validation_matches.csv")


    const success: boolean = await cleanData(inputFilePath, trainingOutputFilePath, testingOutputFilePath, validationOutputFilePath);
    console.log(`Cleaning file status : ${success}`);

    const trainRowsEncoded = await encodeDataset(trainingOutputFilePath);
    const validateRowsEncoded = await encodeDataset(validationOutputFilePath);
    const testingRowsEncoded = await encodeDataset(testingOutputFilePath);


    console.log(trainRowsEncoded);

    const trainDataset = rowsToModelDataset(trainRowsEncoded);
    const validateDataset = rowsToModelDataset(validateRowsEncoded);
    const testDataset = rowsToModelDataset(testingRowsEncoded);

    const a = confirmDataArrayLength(trainDataset);
    const b = confirmDataArrayLength(validateDataset);
    const c = confirmDataArrayLength(testDataset);

    if (a > 0 && b > 0 && c > 0) {
        console.log('Array length are equal');
    }

    return { trainDataset, validateDataset, testDataset };
}

























