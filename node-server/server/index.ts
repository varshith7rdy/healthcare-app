import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes/routes.ts";
import { setupVite, serveStatic, log } from "./vite.ts";
import dotenv from "dotenv";
import { pool } from "./database/index.js";
import { ensureUsersTable } from "./schema/usersTable.js";
import { ensureAppsTable } from "./schema/apps.js"

dotenv.config();

const app = express();
const port = process.env.PORT

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {

  const server = await registerRoutes(app);
  await setupVite(app, server);
  
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
  await ensureAppsTable(pool).then(() => console.log("Apps table ensured"));
  await ensureUsersTable(pool).then(() => console.log("Users table ensured"));
})();
