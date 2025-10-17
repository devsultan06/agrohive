import { connectDB } from "./config/database.ts";
import { env } from "./config/env.ts";
import app from "./src/server.ts";

(async () => {
  await connectDB();
  app.listen(env.port, () =>
    console.log(`🚀 Server running on port ${env.port}`)
  );
})();
