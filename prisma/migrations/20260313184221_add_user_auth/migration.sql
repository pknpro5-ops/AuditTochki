-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formData" TEXT NOT NULL,
    "floorPlanPath" TEXT,
    "floorPlanName" TEXT,
    "floorPlanExpiresAt" DATETIME,
    "ocrData" TEXT,
    "report" TEXT,
    "verdict" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tier" TEXT NOT NULL DEFAULT 'FREE',
    "analysisStartedAt" DATETIME,
    "analysisCompletedAt" DATETIME,
    "email" TEXT,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Audit" ("analysisCompletedAt", "analysisStartedAt", "createdAt", "email", "floorPlanExpiresAt", "floorPlanName", "floorPlanPath", "formData", "id", "ocrData", "report", "sessionId", "status", "tier", "updatedAt", "verdict") SELECT "analysisCompletedAt", "analysisStartedAt", "createdAt", "email", "floorPlanExpiresAt", "floorPlanName", "floorPlanPath", "formData", "id", "ocrData", "report", "sessionId", "status", "tier", "updatedAt", "verdict" FROM "Audit";
DROP TABLE "Audit";
ALTER TABLE "new_Audit" RENAME TO "Audit";
CREATE INDEX "Audit_sessionId_idx" ON "Audit"("sessionId");
CREATE INDEX "Audit_status_idx" ON "Audit"("status");
CREATE INDEX "Audit_userId_idx" ON "Audit"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
