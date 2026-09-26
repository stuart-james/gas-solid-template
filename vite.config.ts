import { Connect, defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solidPlugin from "vite-plugin-solid";
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
console.log(process.env.SCRIPT_ID)
function gasPolyfill(): Plugin {
  return {
    name: "gas-polyfill",
    async configureServer(server) {
      server.middlewares.use("/api/gas", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: "Must be POST request" }));
        }
        try {
          const body = await readRequestBody(req);
          const googleResp = await handleGasRequest(body);
          if (googleResp.error) {
            res.statusCode = 500;
          }
          res.end(JSON.stringify(googleResp));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e }));
        }
      });
    },
  };
}

export default defineConfig((configEnv) => ({
  plugins: [devtools(), solidPlugin(), viteSingleFile(), gasPolyfill()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@gasrun":
        configEnv.mode === "production" ?
          "./src/api/run.ts"
        : "./src/api/run-polyfill.ts",
    },
  },
  build: {
    target: "esnext",
    outDir: "../build/client",
  },
}));
