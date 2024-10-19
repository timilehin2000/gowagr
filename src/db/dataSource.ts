import { DataSource, DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['**/*.entity{.js, .ts}'],
  migrations: ['./dist/db/migrations/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err: any) => {
    console.error('Error during Data Source initialization:', err);
  });
