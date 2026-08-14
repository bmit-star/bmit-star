import { relations } from 'drizzle-orm';
import { integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  templateId: text('template_id'),
  templateTitle: text('template_title'),
  status: text('status').notNull().default('New'),
  uniqueSlug: text('unique_slug').notNull().unique(),
  invitationData: json('invitation_data').notNull(),
  viewsCount: integer('views_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rsvps = pgTable('rsvps', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  guestName: text('guest_name').notNull(),
  phone: text('phone'),
  attendance: text('attendance').notNull(),
  guestCount: integer('guest_count').default(1),
  mealPreference: text('meal_preference'),
  note: text('note'),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const wishes = pgTable('wishes', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  guestName: text('guest_name').notNull(),
  message: text('message').notNull(),
  photoUrl: text('photo_url'),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const usersRelations = relations(users, () => ({}));

export const ordersRelations = relations(orders, ({ many }) => ({
  rsvps: many(rsvps),
  wishes: many(wishes),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  order: one(orders, {
    fields: [rsvps.orderId],
    references: [orders.id],
  }),
}));

export const wishesRelations = relations(wishes, ({ one }) => ({
  order: one(orders, {
    fields: [wishes.orderId],
    references: [orders.id],
  }),
}));
