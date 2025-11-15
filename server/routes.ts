import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAppointmentSchema,
  updateAppointmentSchema,
  insertChatMessageSchema,
  insertWearableDataSchema,
  insertHealthMetricSchema,
  updateUserSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = "user-1";

  app.get("/api/user/profile", async (_req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  app.patch("/api/user/profile", async (req, res) => {
    try {
      const validatedData = updateUserSchema.parse(req.body);
      const updated = await storage.updateUser(DEFAULT_USER_ID, validatedData);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = updated;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/appointments", async (_req, res) => {
    try {
      const appointments = await storage.getAppointments(DEFAULT_USER_ID);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Invalid appointment data" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const validatedData = updateAppointmentSchema.parse(req.body);
      const updated = await storage.updateAppointment(req.params.id, validatedData);
      if (!updated) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Invalid appointment data" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  app.get("/api/chat/messages", async (_req, res) => {
    try {
      const messages = await storage.getChatMessages(DEFAULT_USER_ID);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const message = await storage.createChatMessage(validatedData);
      
      setTimeout(async () => {
        const assistantMessage = await storage.createChatMessage({
          userId: DEFAULT_USER_ID,
          message: "I understand your concern. Let me help you with that. Based on your recent health data, I recommend scheduling a consultation with your healthcare provider.",
          sender: "assistant",
          timestamp: new Date().toISOString(),
        });
      }, 1000);
      
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.get("/api/wearables", async (_req, res) => {
    try {
      const data = await storage.getWearableData(DEFAULT_USER_ID);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wearable data" });
    }
  });

  app.get("/api/wearables/latest", async (_req, res) => {
    try {
      const data = await storage.getLatestWearableData(DEFAULT_USER_ID);
      if (!data) {
        return res.status(404).json({ error: "No wearable data found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wearable data" });
    }
  });

  app.post("/api/wearables", async (req, res) => {
    try {
      const validatedData = insertWearableDataSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const data = await storage.createWearableData(validatedData);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid wearable data" });
    }
  });

  app.get("/api/health/metrics", async (req, res) => {
    try {
      const metricType = req.query.type as string | undefined;
      const metrics = await storage.getHealthMetrics(DEFAULT_USER_ID, metricType);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health metrics" });
    }
  });

  app.post("/api/health/metrics", async (req, res) => {
    try {
      const validatedData = insertHealthMetricSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      const metric = await storage.createHealthMetric(validatedData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ error: "Invalid health metric data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
