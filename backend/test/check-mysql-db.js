const mysql = require('mysql2/promise');

async function checkMySQLDatabase() {
  console.log('🔍 Checking CVKing MySQL Database...\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'TUANPHONG',
    password: process.env.DB_PASSWORD || '123321',
    database: process.env.DB_NAME || 'cvking_db',
    connectTimeout: 5000,
  };

  console.log('📍 Connection Config:');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);
  console.log('');

  let connection;

  try {
    console.log('⏳ Attempting to connect...');
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL database!\n');

    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');

    console.log('📋 TABLES IN DATABASE:');
    console.log('='.repeat(50));

    const tableNames = tables.map((row) => Object.values(row)[0]);
    tableNames.forEach((tableName, index) => {
      console.log(`${index + 1}. ${tableName}`);
    });

    console.log(`\n📊 Total tables: ${tableNames.length}\n`);

    // Check data in key tables
    const keyTables = ['users', 'roles', 'user_roles'];

    for (const tableName of keyTables) {
      try {
        console.log(`📄 CHECKING TABLE: ${tableName.toUpperCase()}`);
        console.log('-'.repeat(40));

        const [rows] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${tableName}`,
        );

        const count = rows[0].count;
        console.log(`📊 Records in ${tableName}: ${count}`);

        if (count > 0 && count <= 5) {
          const [sampleRows] = await connection.execute(
            `SELECT * FROM ${tableName} LIMIT 3`,
          );
          console.log('📋 Sample data:');
          sampleRows.forEach((row, idx) => {
            console.log(`  ${idx + 1}. ${JSON.stringify(row, null, 2)}`);
          });
        }

        console.log('');
      } catch (tableError) {
        console.log(
          `❌ Error checking table ${tableName}:`,
          tableError.message,
        );
        console.log('');
      }
    }

    // Check our new entities
    const newEntities = [
      'job_seeker_profiles',
      'job_seeker_education',
      'job_seeker_experience',
      'message_threads',
      'thread_participants',
      'messages',
      'blog_tags',
      'blog_post_tags',
      'application_events',
    ];

    console.log('🆕 CHECKING NEW ENTITIES:');
    console.log('='.repeat(50));

    let newEntitiesFound = 0;
    for (const entity of newEntities) {
      try {
        const [rows] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${entity}`,
        );
        const count = rows[0].count;
        console.log(`✅ ${entity}: ${count} records`);
        newEntitiesFound++;
      } catch (entityError) {
        console.log(`❌ ${entity}: Table not found or error`);
      }
    }

    console.log(
      `\n📈 New entities found: ${newEntitiesFound}/${newEntities.length}`,
    );
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check if database "cvking_db" exists');
    console.log('3. Verify username/password in .env file');
    console.log('4. Check MySQL user permissions');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }

  console.log('\n🎉 Database check completed!');
}

checkMySQLDatabase().catch(console.error);
