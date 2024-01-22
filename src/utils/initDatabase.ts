import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

const createTableUsersIfNotExist = async (client: Client) => {
  try {

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableSql);
    console.log('Table "users" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};


const createTableOrdersIfNotExist = async (client: Client) => {
  try {

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS "orders" (
        id SERIAL PRIMARY KEY,
        mini INT NOT NULL,
        userid INT NOT NULL,
        price INT NOT NULL,
        package VARCHAR(255),
        discount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        serialnumbers JSON[],
        invoice JSON,
        createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableSql);
    console.log('Table "orders" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export async function createTableIfNotExists() {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  
  try {

    await createTableUsersIfNotExist(client);
    await createTableOrdersIfNotExist(client);
  } catch (error) {
    console.error('Error in table creation:', error);
  } finally {
    await client.end();
  }
}
