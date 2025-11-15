import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  avatar: text("avatar"),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  doctorSpecialty: text("doctor_specialty").notNull(),
  doctorAvatar: text("doctor_avatar"),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: text("status").notNull().default("pending"),
  type: text("type").notNull(),
  notes: text("notes"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  sender: text("sender").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const wearableData = pgTable("wearable_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  deviceName: text("device_name").notNull(),
  deviceType: text("device_type").notNull(),
  heartRate: integer("heart_rate"),
  steps: integer("steps"),
  sleepHours: integer("sleep_hours"),
  calories: integer("calories"),
  timestamp: text("timestamp").notNull(),
  lastSync: text("last_sync").notNull(),
  isConnected: boolean("is_connected").notNull().default(true),
});

export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  metricType: text("metric_type").notNull(),
  value: integer("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const updateUserSchema = createInsertSchema(users).omit({ id: true, username: true, password: true }).partial();

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const updateAppointmentSchema = createInsertSchema(appointments).omit({ id: true }).partial();

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });

export const insertWearableDataSchema = createInsertSchema(wearableData).omit({ id: true });

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertWearableData = z.infer<typeof insertWearableDataSchema>;
export type WearableData = typeof wearableData.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
