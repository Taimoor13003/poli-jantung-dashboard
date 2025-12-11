import { BigQuery } from "@google-cloud/bigquery";

// BigQuery akan otomatis memakai credential dari gcloud (ADC)
const bigquery = new BigQuery();

async function test() {
  const query = `
    SELECT 1 AS test_value
  `;

  const [rows] = await bigquery.query(query);

  console.log("BigQuery connected! Result:");
  console.log(rows);
}

test().catch(err => {
  console.error("ERROR:", err);
});
