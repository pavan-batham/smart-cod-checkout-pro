/**
 * Cron Jobs Entry Point
 * Run: node cron.js
 * Or via PM2: pm2 start cron.js --name scod-cron
 */

import cron from "node-cron";
import { runAbandonedRecovery } from "./app/utils/abandonedRecovery.server.js";

console.log("[SCOD Cron] Starting cron scheduler...");

// Run abandoned order recovery every hour
cron.schedule("0 * * * *", async () => {
  console.log("[SCOD Cron] Running abandoned order recovery...");
  try {
    await runAbandonedRecovery();
  } catch (err) {
    console.error("[SCOD Cron] Abandoned recovery error:", err);
  }
});

// Daily cleanup of old OTP logs (older than 7 days)
cron.schedule("0 2 * * *", async () => {
  console.log("[SCOD Cron] Running daily OTP log cleanup...");
  try {
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000);
    const deleted = await db.otpLog.deleteMany({
      where: { createdAt: { lt: sevenDaysAgo } },
    });
    console.log(`[SCOD Cron] Deleted ${deleted.count} old OTP logs`);
    await db.$disconnect();
  } catch (err) {
    console.error("[SCOD Cron] OTP cleanup error:", err);
  }
});

// Weekly analytics summary (every Monday at 9am IST)
cron.schedule("30 3 * * 1", async () => {
  console.log("[SCOD Cron] Running weekly analytics summary...");
  // Placeholder: send weekly report email to merchants on Pro plan
});

console.log("[SCOD Cron] Cron jobs scheduled. Waiting...");
