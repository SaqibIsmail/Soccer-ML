import { cleanData } from "./data/cleanCsv.js";
import * as path from "node:path";

const inputFilePath = path.resolve("data/raw/all_matches.csv");
const trainingOutputFilePath = path.resolve("data/processed/training_matches.csv");
const testingOutputFilePath = path.resolve("data/processed/testing_matches.csv")
const validationOutputFilePath = path.resolve("data/processed/validation_matches.csv")


const success: boolean = await cleanData(inputFilePath, trainingOutputFilePath, testingOutputFilePath, validationOutputFilePath);
console.log(`Cleaning file status : ${success}`);






