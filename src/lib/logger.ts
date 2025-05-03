// src/lib/logger.ts
import fs from "fs";
import path from "path";

export function logToFile(message: string) {
  const logPath = path.join(process.cwd(), "logs", "app.log");
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, logMessage);
}
