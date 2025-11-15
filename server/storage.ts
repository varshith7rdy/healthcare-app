import {
  type User,
  type InsertUser,
  type UpdateUser,
  type Appointment,
  type InsertAppointment,
  type UpdateAppointment,
  type ChatMessage,
  type InsertChatMessage,
  type WearableData,
  type InsertWearableData,
  type HealthMetric,
  type InsertHealthMetric,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User | undefined>;
  
  getAppointments(userId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: UpdateAppointment): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getWearableData(userId: string): Promise<WearableData[]>;
  getLatestWearableData(userId: string): Promise<WearableData | undefined>;
  createWearableData(data: InsertWearableData): Promise<WearableData>;
  
  getHealthMetrics(userId: string, metricType?: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointments: Map<string, Appointment>;
  private chatMessages: Map<string, ChatMessage>;
  private wearableData: Map<string, WearableData>;
  private healthMetrics: Map<string, HealthMetric>;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.chatMessages = new Map();
    this.wearableData = new Map();
    this.healthMetrics = new Map();
    
    this.seedData();
  }

  private seedData() {
    const userId = "user-1";
    const user: User = {
      id: userId,
      username: "johndoe",
      password: "password123",
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      bloodType: "O+",
      allergies: "Penicillin, Peanuts",
      avatar: null,
    };
    this.users.set(userId, user);

    const appointments: Appointment[] = [
      {
        id: "apt-1",
        userId,
        doctorName: "Dr. Sarah Johnson",
        doctorSpecialty: "Cardiologist",
        doctorAvatar: null,
        appointmentDate: "2024-11-20",
        appointmentTime: "2:00 PM",
        status: "confirmed",
        type: "virtual",
        notes: null,
      },
      {
        id: "apt-2",
        userId,
        doctorName: "Dr. Michael Chen",
        doctorSpecialty: "General Practitioner",
        doctorAvatar: null,
        appointmentDate: "2024-11-21",
        appointmentTime: "10:30 AM",
        status: "confirmed",
        type: "in-person",
        notes: null,
      },
      {
        id: "apt-3",
        userId,
        doctorName: "Dr. Emily Rodriguez",
        doctorSpecialty: "Dermatologist",
        doctorAvatar: null,
        appointmentDate: "2024-11-18",
        appointmentTime: "3:00 PM",
        status: "pending",
        type: "virtual",
        notes: null,
      },
    ];
    appointments.forEach(apt => this.appointments.set(apt.id, apt));

    const messages: ChatMessage[] = [
      {
        id: "msg-1",
        userId,
        message: "Hello! I'm your virtual health assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date().toISOString(),
      },
    ];
    messages.forEach(msg => this.chatMessages.set(msg.id, msg));

    const wearables: WearableData[] = [
      {
        id: "wear-1",
        userId,
        deviceName: "Apple Watch Series 9",
        deviceType: "smartwatch",
        heartRate: 72,
        steps: 8542,
        sleepHours: 7,
        calories: 1847,
        timestamp: new Date().toISOString(),
        lastSync: new Date(Date.now() - 2 * 60000).toISOString(),
        isConnected: true,
      },
      {
        id: "wear-2",
        userId,
        deviceName: "Fitbit Charge 6",
        deviceType: "fitness-tracker",
        heartRate: 71,
        steps: 8200,
        sleepHours: 7,
        calories: 1800,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        lastSync: new Date(Date.now() - 3600000).toISOString(),
        isConnected: true,
      },
    ];
    wearables.forEach(w => this.wearableData.set(w.id, w));

    const metrics: HealthMetric[] = [
      { id: "metric-1", userId, metricType: "heart_rate", value: 72, unit: "bpm", timestamp: new Date().toISOString() },
      { id: "metric-2", userId, metricType: "steps", value: 8542, unit: "steps", timestamp: new Date().toISOString() },
      { id: "metric-3", userId, metricType: "sleep", value: 7, unit: "hours", timestamp: new Date().toISOString() },
      { id: "metric-4", userId, metricType: "calories", value: 1847, unit: "kcal", timestamp: new Date().toISOString() },
    ];
    metrics.forEach(m => this.healthMetrics.set(m.id, m));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateUser: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updateUser };
    this.users.set(id, updated);
    return updated;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.userId === userId,
    );
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updateAppointment: UpdateAppointment): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updated = { ...appointment, ...updateAppointment };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { ...insertMessage, id };
    this.chatMessages.set(id, message);
    return message;
  }

  async getWearableData(userId: string): Promise<WearableData[]> {
    return Array.from(this.wearableData.values())
      .filter((data) => data.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getLatestWearableData(userId: string): Promise<WearableData | undefined> {
    const data = await this.getWearableData(userId);
    return data[0];
  }

  async createWearableData(insertData: InsertWearableData): Promise<WearableData> {
    const id = randomUUID();
    const data: WearableData = { ...insertData, id };
    this.wearableData.set(id, data);
    return data;
  }

  async getHealthMetrics(userId: string, metricType?: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter((metric) => {
        if (metric.userId !== userId) return false;
        if (metricType && metric.metricType !== metricType) return false;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = randomUUID();
    const metric: HealthMetric = { ...insertMetric, id };
    this.healthMetrics.set(id, metric);
    return metric;
  }
}

export const storage = new MemStorage();
