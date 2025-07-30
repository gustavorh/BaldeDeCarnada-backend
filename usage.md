#Usage

1. Start everything: docker-compose up -d
2. Generate new migrations: npm run db:generate (after schema changes)
3. Run migrations: npm run db:migrate
4. View database in browser: npm run db:studio

> Your NestJS app will be available at http://localhost:3000 and MySQL at localhost:3306. The database service is globally available and can be injected into any service to perform database operations with Drizzle ORM.
