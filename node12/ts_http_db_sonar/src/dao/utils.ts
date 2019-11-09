import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';

/**
 * Gets the default database connection.
 *
 * Creates it if it it hasn't been yet.
 *
 * Since database code breaks all the time,
 * (yay external dependencies), we tell people
 * in the return type that you might get a null
 * from this method.
 */
export const getDbConnection = async (): Promise<Connection | null> => {
  let conn: Connection | null = null;
  try {
    conn = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'ts_http_db_sonar_user',
      password: 'ts_http_db_sonar_pass', // nosonar
      database: 'ts_http_db_sonar',
      entities: ['src/entity/**/*.ts'],

      // set me true if you hate typeorm migrations (not safe for prod).
      synchronize: false,
    });
  } catch (error) {
    console.error('Problem getting database connection.', error);
    conn = null;
  }
  return conn || null;
};

export const safeClose = async (connection: Connection | null) => {
  if (connection && connection.isConnected) {
    await connection.close();
  }
};
