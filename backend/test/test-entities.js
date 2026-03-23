const mysql = require('mysql2/promise');

// Test script để validate entities và relationships
async function testDatabaseSchema() {
  let connection;

  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'hoangtuanphong',
      password: process.env.DB_PASSWORD || '123321',
      database: process.env.DB_NAME || 'cvking_db',
    });

    console.log('✅ Connected to database successfully');

    // Test các bảng mới
    const tables = [
      'job_seeker_profiles',
      'job_seeker_education',
      'job_seeker_experience',
      'message_threads',
      'thread_participants',
      'messages',
      'blog_tags',
      'blog_post_tags',
      'application_events'
    ];

    console.log('\n📋 Checking new tables:');
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`✅ Table '${table}' exists`);
        } else {
          console.log(`❌ Table '${table}' NOT found`);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${table}': ${error.message}`);
      }
    }

    // Test relationships
    console.log('\n🔗 Checking relationships:');

    // Test JobSeekerProfile -> User relationship
    try {
      const [rows] = await connection.execute(`
        SELECT COUNT(*) as count
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'job_seeker_profiles'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users'
      `);

      if (rows[0].count > 0) {
        console.log('✅ JobSeekerProfile -> User relationship exists');
      } else {
        console.log('❌ JobSeekerProfile -> User relationship NOT found');
      }
    } catch (error) {
      console.log(`❌ Error checking JobSeekerProfile relationship: ${error.message}`);
    }

    // Test CV -> JobSeekerProfile relationship
    try {
      const [rows] = await connection.execute(`
        SELECT COUNT(*) as count
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'cvs'
        AND COLUMN_NAME = 'job_seeker_profile_id'
        AND REFERENCED_TABLE_NAME = 'job_seeker_profiles'
      `);

      if (rows[0].count > 0) {
        console.log('✅ CV -> JobSeekerProfile relationship exists');
      } else {
        console.log('❌ CV -> JobSeekerProfile relationship NOT found');
      }
    } catch (error) {
      console.log(`❌ Error checking CV relationship: ${error.message}`);
    }

    // Test Application -> JobSeekerProfile relationship
    try {
      const [rows] = await connection.execute(`
        SELECT COUNT(*) as count
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'applications'
        AND COLUMN_NAME = 'job_seeker_profile_id'
        AND REFERENCED_TABLE_NAME = 'job_seeker_profiles'
      `);

      if (rows[0].count > 0) {
        console.log('✅ Application -> JobSeekerProfile relationship exists');
      } else {
        console.log('❌ Application -> JobSeekerProfile relationship NOT found');
      }
    } catch (error) {
      console.log(`❌ Error checking Application relationship: ${error.message}`);
    }

    // Test User social login fields
    console.log('\n👤 Checking User entity enhancements:');
    try {
      const [rows] = await connection.execute(`
        SELECT COLUMN_NAME
        FROM information_schema.COLUMNS
        WHERE TABLE_NAME = 'users'
        AND COLUMN_NAME IN ('google_id', 'linked_in_id', 'avatar_url', 'preferred_locale')
      `);

      const foundColumns = rows.map(row => row.COLUMN_NAME);
      const expectedColumns = ['google_id', 'linked_in_id', 'avatar_url', 'preferred_locale'];

      expectedColumns.forEach(col => {
        if (foundColumns.includes(col)) {
          console.log(`✅ User.${col} column exists`);
        } else {
          console.log(`❌ User.${col} column NOT found`);
        }
      });
    } catch (error) {
      console.log(`❌ Error checking User columns: ${error.message}`);
    }

    // Test indexes
    console.log('\n🔍 Checking important indexes:');
    const importantIndexes = [
      { table: 'job_seeker_profiles', column: 'user_id' },
      { table: 'cvs', column: 'job_seeker_profile_id' },
      { table: 'applications', column: 'job_seeker_profile_id' },
      { table: 'messages', column: 'thread_id' },
      { table: 'thread_participants', column: 'thread_id' },
      { table: 'thread_participants', column: 'user_id' },
    ];

    for (const index of importantIndexes) {
      try {
        const [rows] = await connection.execute(`
          SELECT COUNT(*) as count
          FROM information_schema.STATISTICS
          WHERE TABLE_NAME = '${index.table}'
          AND COLUMN_NAME = '${index.column}'
          AND INDEX_NAME != 'PRIMARY'
        `);

        if (rows[0].count > 0) {
          console.log(`✅ Index on ${index.table}.${index.column} exists`);
        } else {
          console.log(`⚠️  Index on ${index.table}.${index.column} NOT found (may be auto-created)`);
        }
      } catch (error) {
        console.log(`❌ Error checking index ${index.table}.${index.column}: ${error.message}`);
      }
    }

    console.log('\n🎉 Database schema validation completed!');

  } catch (error) {
    console.error('❌ Database connection or query error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Chạy test
testDatabaseSchema().catch(console.error);
