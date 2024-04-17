import { DataSource, DataSourceOptions } from 'typeorm';
import * as typeOrmConfig from '@/database/typeorm/typeorm.config-migrations';

export const dataSource: DataSource = new DataSource(typeOrmConfig as DataSourceOptions);
