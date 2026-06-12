
import {transformCsvToDataset} from '../data/dataTransform.ts';

import * as mlLibrary from 'ml-cart';

const { trainDataset, validateDataset, testDataset } = await transformCsvToDataset();

