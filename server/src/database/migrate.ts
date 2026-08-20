import { connectDatabase, disconnectDatabase } from "../config/database";
import { MigrationModel } from "./migration.model";
import * as m001 from "./migrations/001-create-indexes";
import * as m002 from "./migrations/002-add-required-job-fields";

const migrations = [m001, m002];

async function run() {
  await connectDatabase();
  console.log("[migrate] starting migration run");

  for (const migration of migrations) {
    const already = await MigrationModel.findOne({ name: migration.name });
    if (already) {
      console.log(`[migrate] skipping ${migration.name} (already applied)`);
      continue;
    }

    console.log(`[migrate] applying ${migration.name}`);
    try {
      await migration.up();
      await MigrationModel.create({ name: migration.name });
      console.log(`[migrate] applied ${migration.name}`);
    } catch (err) {
      console.error(`[migrate] FAILED on ${migration.name}`);
      console.error(err);
      await disconnectDatabase();
      process.exit(1);
    }
  }

  console.log("[migrate] all migrations up to date");
  await disconnectDatabase();
  process.exit(0);
}

run();
