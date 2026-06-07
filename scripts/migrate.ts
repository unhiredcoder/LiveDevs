import postgres from "postgres"
import * as dotenv from "fs"

const DATABASE_URL = process.env.DATABASE_URL!

const sql = postgres(DATABASE_URL)

async function migrate() {
  console.log("Running migrations...")

  await sql`ALTER TABLE "room" ADD COLUMN IF NOT EXISTS "is_private" boolean NOT NULL DEFAULT false`
  await sql`ALTER TABLE "room" ADD COLUMN IF NOT EXISTS "password" text`
  await sql`ALTER TABLE "room" ADD COLUMN IF NOT EXISTS "max_participants" integer DEFAULT 10`
  await sql`ALTER TABLE "room" ADD COLUMN IF NOT EXISTS "scheduled_at" timestamp`

  await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" text`
  await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "skills" text`

  await sql`
    CREATE TABLE IF NOT EXISTS "saved_rooms" (
      "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "room_id" uuid NOT NULL REFERENCES "room"("id") ON DELETE CASCADE,
      "saved_at" timestamp NOT NULL DEFAULT now(),
      PRIMARY KEY ("user_id", "room_id")
    )
  `

  console.log("Migrations complete!")
  await sql.end()
}

migrate().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
