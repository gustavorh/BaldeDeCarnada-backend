import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  int,
  decimal,
  datetime,
  json,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Roles table
export const roles = mysqlTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  permissions: json('permissions').notNull(), // Store permissions as JSON array
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Users table (modified to include role)
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  roleId: int('role_id').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Attendance table
export const attendance = mysqlTable('attendance', {
  id: serial('id').primaryKey(),
  employeeId: int('employee_id').notNull(),
  checkInTime: datetime('check_in_time').notNull(),
  checkOutTime: datetime('check_out_time'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Products table
export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Stock table (separate for tracking current quantities)
export const stock = mysqlTable('stock', {
  productId: int('product_id').primaryKey(),
  currentQuantity: int('current_quantity').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Orders table
export const orders = mysqlTable('orders', {
  id: serial('id').primaryKey(),
  products: json('products').notNull(), // Store ordered products as JSON array
  orderDate: timestamp('order_date').defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(users, {
    fields: [attendance.employeeId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  stock: one(stock, {
    fields: [products.id],
    references: [stock.productId],
  }),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  product: one(products, {
    fields: [stock.productId],
    references: [products.id],
  }),
}));
