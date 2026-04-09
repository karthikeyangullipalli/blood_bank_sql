const db = require('./config/db');
db.query('SHOW COLUMNS FROM donor_details', (err, results) => {
  if (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
  console.log(JSON.stringify(results, null, 2));
  db.end();
});