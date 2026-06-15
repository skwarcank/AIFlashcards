import { createServer } from "node:http";
import { spawn } from "node:child_process";

const appPort = process.env.PORT ?? "3000";
const supabasePort = process.env.E2E_SUPABASE_PORT ?? "54329";

const supabaseMock = createServer((request, response) => {
  if (request.url?.startsWith("/auth/v1/user")) {
    response.writeHead(401, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "JWT missing" }));
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message: "Not found" }));
});

await new Promise((resolve) => {
  supabaseMock.listen(Number(supabasePort), "127.0.0.1", resolve);
});

const next = spawn("npx", ["next", "dev", "--port", appPort], {
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${supabasePort}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key",
    OPENROUTER_API_KEY: "",
  },
  stdio: "inherit",
});

function shutdown() {
  next.kill("SIGTERM");
  supabaseMock.close();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
next.on("exit", (code) => {
  supabaseMock.close();
  process.exit(code ?? 0);
});
