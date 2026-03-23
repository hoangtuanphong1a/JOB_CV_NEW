const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'cvking_db.sqlite');

console.log('🔍 Checking CVKing Database...\n');

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database at:', dbPath);
});

// Get all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('❌ Error getting tables:', err.message);
    return;
  }

  console.log('\n📋 TABLES IN DATABASE:');
  console.log('='.repeat(50));

  tables.forEach((table, index) => {
    console.log(`${index + 1}. ${table.name}`);
  });

  console.log(`\n📊 Total tables: ${tables.length}`);

  // Show data from key tables
  const keyTables = ['users', 'roles', 'user_roles'];

  keyTables.forEach((tableName, index) => {
    setTimeout(() => {
      console.log(`\n📄 DATA IN TABLE: ${tableName.toUpperCase()}`);
      console.log('-'.repeat(40));

      db.all(`SELECT * FROM ${tableName} LIMIT 5`, [], (err, rows) => {
        if (err) {
          console.log(`❌ Error querying ${tableName}:`, err.message);
          return;
        }

        if (rows.length === 0) {
          console.log(`📭 No data in ${tableName} table`);
        } else {
          console.log(`📊 Found ${rows.length} records:`);
          rows.forEach((row, idx) => {
            console.log(`  ${idx + 1}. ${JSON.stringify(row, null, 2)}`);
          });
        }

        // Close database after last table
        if (index === keyTables.length - 1) {
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message);
            } else {
              console.log('\n✅ Database connection closed');
              console.log('\n🎉 Database check completed!');
            }
          });
        }
      });
    }, index * 100); // Delay to ensure sequential execution
  });
});
