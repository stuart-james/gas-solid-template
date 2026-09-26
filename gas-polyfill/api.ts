import * as v from "valibot";
import { google, Common } from "googleapis";
import { writeFileSync } from "fs";

const RunRequestSchema = v.object({
  function: v.string("Function must be a string!"),
  parameters: v.array(v.string(), "Parameters must be a string array."),
});

export async function handleGasRequest(
  authClient: Common.OAuth2Client,
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
        error: `Script run request failed with response code: ${googleResp.status} ${googleResp.statusText}`,
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
    writeFileSync("error.json", JSON.stringify(e));
    return {
      error: `Script run request failed with unknown error: \n${e}}`,
    };
  }
}
