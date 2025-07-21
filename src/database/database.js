import mysql from 'mysql2';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'video_belajar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const promisePool = pool.promise();

export const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

export const query = async (sql, params = []) => {
    try {
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const queryOne = async (sql, params = []) => {
    try {
        const [rows] = await promisePool.execute(sql, params);
        return rows[0] || null;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const transaction = async (callback) => {
    const connection = await promisePool.getConnection();
    await connection.beginTransaction();
    
    try {
        const result = await callback(connection);
        await connection.commit();
        connection.release();
        return result;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};


export const closePool = () => {
    return new Promise((resolve) => {
        pool.end(() => {
            console.log('Database pool closed');
            resolve();
        });
    });
};

export { pool, promisePool };

export default {
    testConnection,
    query,
    queryOne,
    transaction,
    closePool,
    pool,
    promisePool
};