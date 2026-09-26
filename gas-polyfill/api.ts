import * as v from "valibot";
import { google, type script_v1 } from "googleapis";
import { createAuthClient } from "./auth.ts";

const authClient = createAuthClient();

const RunRequestSchema = v.object({
  function: v.string("Function must be a string!"),
  parameters: v.array(v.string(), "Parameters must be a string array."),
});

export async function handleGasRequest(
  scriptId: string,
  args: any,
): Promise<{ error?: string; value?: any }> {
  if (!authClient.credentials) {
    return {
      error:
        "Client is not authenticated. Follow the instructions in the README.md to authenticate the dev server",
    };
  }
  const paramsResult = v.safeParser(RunRequestSchema)(args);
  if (!paramsResult.success) {
    return {
      error: "Invalid request params: " + paramsResult.issues[0].message,
    };
  }
  try {
    const googleResp = await google.script("v1").scripts.run({
      auth: authClient,
      scriptId,
      requestBody: paramsResult.output,
    });
    if (googleResp.status !== 200) {
      return {
        error: `Script run request failed with response code ${googleResp.status} ${googleResp.statusText}`,
      };
    }
    if (googleResp.data.error) {
      return {
        error:
          googleResp.data.error.message ||
          "Script run request failed with unknown error",
      };
    }
    return {
      value: googleResp.data.response?.result,
    };
  } catch (e) {
    return {
      error: `Script run request failed with unknown error: ${e instanceof Error ? e.message : e}`,
    };
  }
}
