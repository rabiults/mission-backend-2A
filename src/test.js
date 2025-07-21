// src/test-database.js
import { testConnection, query, closePool } from './database/database.js';

async function test() {
    console.log('🔄 Testing database...');
    
    const isConnected = await testConnection();
    if (isConnected) {
        const tables = await query('SHOW TABLES');
        console.log('📋 Tables:', tables);
    }
    
    await closePool();
}

test();