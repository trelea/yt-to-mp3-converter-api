import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';
import { UserEntity } from './entities/users';

/**
 * @description This is the configuration for the database.
 */
config();

/**
 * @description This is the options for the data source.
 */
export const dataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: true,
  entities: [UserEntity],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  subscribers: [],
} as DataSourceOptions;

/**
 * @description This is the data source for the database.
 */
export const dataSource = new DataSource(dataSourceOptions);
