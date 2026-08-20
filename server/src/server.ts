import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { PORT } from "./config/env";

async function main() {
  await connectDatabase();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});
