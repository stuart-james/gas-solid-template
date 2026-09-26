import { Connect, defineConfig, type Plugin, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solidPlugin from "vite-plugin-solid";
import path from "path";
import devtools from "solid-devtools/vite";
import { handleGasRequest } from "./gas-polyfill/api";

async function readRequestBody(request: Connect.IncomingMessage) {
  return new Promise<string | object>((res, rej) => {
    let body = "";
    request.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      try {
        res(JSON.parse(body));
      } catch (e) {
        res(body);
      }
    });
    request.on("error", rej);
  });
}

function gasPolyfill(scriptId: string): Plugin {
  return {
    name: "gas-polyfill",
    async configureServer(server) {
      server.middlewares.use("/api/gas", async (req, res) => {
        console.log("SERVER FN REQUEST");
        if (req.method !== "POST") {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Must be POST request" }));
        }
        if (!scriptId) {
          console.log("NO SCRIPT ID");
          res.statusCode = 500;
          return;
          res.end(
            JSON.stringify({
              error:
                "SCRIPT_ID must be set in order to use server function in a dev environment",
            }),
          );
          return;
        }
        try {
          const body = await readRequestBody(req);

          const googleResp = await handleGasRequest(scriptId, body);
          if (googleResp.error) {
            res.statusCode = 500;
          }
          res.end(JSON.stringify({ value: googleResp }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e }));
        }
      });
    },
  };
}
export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), "");
  const scriptId = env.SCRIPT_ID;
  if (!scriptId) {
    console.warn(
      "SCRIPT_ID is not set and required for server functions in dev to work",
    );
  }
  return {
    plugins: [
      devtools(),
      solidPlugin(),
      viteSingleFile(),
      gasPolyfill(scriptId),
    ],
    server: {
      port: 5173,
    },
    resolve: {
      alias: {
        "@gasrun": path.resolve(__dirname, "src/api/run-polyfill.ts"),
      },
    },
    build: {
      target: "esnext",
      outDir: "../build/client",
    },
  };
});
