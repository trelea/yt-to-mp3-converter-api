import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class DbModule extends TypeOrmModule {}
