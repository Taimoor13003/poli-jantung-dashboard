import bigquery from '../../../../lib/bigquery';

export async function GET(request) {
  try {
    // Ambil query params (opsional: filter, tanggal, dsb)
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Query default
    let query = `
      SELECT *
      FROM \`data-rs-pku-2023-2025.poli_jantung.LeftJoin_Enhanced\`
      LIMIT 500
    `;

    // Kalau ada filter tanggal
    if (startDate && endDate) {
      query = `
        SELECT *
        FROM \`data-rs-pku-2023-2025.poli_jantung.LeftJoin_Enhanced\`
        WHERE DATE(tanggal) BETWEEN '${startDate}' AND '${endDate}'
      `;
    }

    const [rows] = await bigquery.query({ query });

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
