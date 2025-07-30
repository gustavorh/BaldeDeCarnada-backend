import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db;

  async onModuleInit() {
    const connection = createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'nestjs_app',
    });

    this.db = drizzle(connection, { schema, mode: 'default' });
  }
}
