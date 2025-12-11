import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';

const keyPath = path.join(process.cwd(), 'keys', 'bigquery-key.json');

const bigquery = new BigQuery({
  keyFilename: keyPath,
  projectId: 'data-rs-pku-2023-2025',
});

export default bigquery;
