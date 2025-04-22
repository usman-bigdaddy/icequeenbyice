import {
  varchar,
  uuid,
  text,
  pgTable,
  pgEnum,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// Role Enum for Users
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN", "SUPER_ADMIN"]);

// Order Status Enum
export const ORDER_STATUS_ENUM = pgEnum("order_status", [
  "PENDING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED", // Added cancelled status
]);

// Payment Status Enum with UPPERCASE values
export const PAYMENT_STATUS_ENUM = pgEnum("payment_status", [
  "SUCCESS",
  "FAILED",
  "PENDING",
]);
// Product Size Enum
export const SIZE_ENUM = pgEnum("size", [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "FREE_SIZE",
]);

// Users Table (For Authentication)
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").default(null), // Changed to `text` for better compatibility
  role: ROLE_ENUM("role").default("USER").notNull(),
  image: text("image"),
  lastActivityDate: timestamp("last_activity_date", {
    withTimezone: true,
  }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(), // Added updatedAt
});

// Accounts Table (For Social Login) - Left unchanged
export const accounts = pgTable("accounts", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 255 }).notNull(), // Google, GitHub, etc.
  providerAccountId: text("provider_account_id").notNull().unique(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Products Table (With Free Size Handling)
export const products = pgTable("products", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fabricType: varchar("fabric_type", { length: 100 }).notNull(),
  size: SIZE_ENUM("size").notNull(),
  width: integer("width").notNull(),
  length: integer("length").default(null),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(0),
  images: text("images").array().notNull().default([]),
  featured: boolean("featured").default(false),
  visibility: boolean("visibility").default(true),
  bestSeller: boolean("best_seller").default(false),
  trending: boolean("trending").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Delivery Fees Table
export const deliveryFees = pgTable("delivery_fee", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  location: varchar("location", { length: 255 }).notNull().unique(),
  fee: integer("fee").notNull(), // Changed column name to `fee` for consistency
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Cart Table
export const cart = pgTable("cart", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id") // Removed .notNull() to make nullable
    .references(() => users.id, { onDelete: "cascade" }),
  guestId: text("guest_id"),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
// Shipping Addresses Table
// export const shippingAddresses = pgTable("shipping_addresses", {
//   id: uuid("id").notNull().primaryKey().defaultRandom(),
//   userId: uuid("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   receiverName: varchar("receiver_name", { length: 255 }).notNull(),
//   receiverNumber: varchar("receiver_number", { length: 20 }).notNull(),
//   fullAddress: text("full_address").notNull(),
//   deliveryFeeId: uuid("delivery_fee_id")
//     .notNull()
//     .references(() => deliveryFees.id, { onDelete: "restrict" }),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
// });

// Orders Table
export const orders = pgTable("orders", {
  id: text("id").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverName: varchar("receiver_name", { length: 255 }).notNull(),
  receiverNumber: varchar("receiver_number", { length: 20 }).notNull(),
  fullAddress: text("full_address").notNull(),
  fee: text("fee"),
  note: text("note"),
  totalAmount: integer("total_amount").notNull(),
  status: ORDER_STATUS_ENUM("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(), // Added updatedAt
});

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Payment Transactions Table
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  reference: varchar("reference", { length: 255 }).notNull().unique(),
  amount: integer("amount").notNull(),
  status: PAYMENT_STATUS_ENUM("status").default("PENDING").notNull(), // Use the enum here
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
