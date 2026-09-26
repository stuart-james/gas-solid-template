import { authenticate } from "@google-cloud/local-auth";
import fs from "fs";
import path from "path";
import { google, type Common } from "googleapis";

function getScopes(pathToAppsscriptJson: string, ...aditionalScopes: string[]) {
  const filePath = path.resolve(pathToAppsscriptJson);
  if (!fs.existsSync(filePath)) {
    throw new Error("Invalid path to appsscript.json:\n" + filePath);
  }
  try {
    const str = fs.readFileSync(filePath).toString();
    const scopes: string[] = JSON.parse(str).oauthScopes ?? [];
    for (const scope of aditionalScopes) {
      if (!scopes.includes(scope)) {
        scopes.push(scope);
      }
    }
    return scopes;
  } catch (e) {
    throw new Error(
      `Error getting scopes from appscript.json: " + ${
        e instanceof Error ? e.message : e
      }`,
    );
  }
}

const CREDENTIAL = "./credentials.json";
const CLIENT_SECRET = "./client_secret.json";
const APPSSCRIPT_JSON = "./appsscript.json";

export async function handleAuth() {
  const client = await authenticate({
    scopes: getScopes(process.env.APPSSCRIPT_JSON_PATH ?? APPSSCRIPT_JSON),
    keyfilePath: process.env.CLIENT_SECRET_PATH || CLIENT_SECRET,
  });
  const creds = client.credentials;
  fs.writeFileSync(
    path.resolve(process.env.CREDENTIAL_PATH ?? CREDENTIAL),
    JSON.stringify(creds),
  );
  return { ok: true, value: null };
}

function getCredentials(credentialsPath: string) {
  if (fs.existsSync(credentialsPath)) {
    return JSON.parse(fs.readFileSync(credentialsPath).toString());
  }
  return undefined;
}

export function createAuthClient() {
  const client = new google.auth.OAuth2();
  const credPath = process.env.CREDENTIAL_PATH ?? CREDENTIAL;
  const creds = getCredentials(credPath);
  if (creds) {
    client.setCredentials(creds);
  }
  return client;
}
if (Bun.argv.at(-1) === "-a") {
  await handleAuth();
}
