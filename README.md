# Description
This is a template project for easy development of a Google Apps Script Web App with a SolidJS frontend. This template was set up  to be dropped into an existing project, so the build step will only build client files. If you're looking for help with building server files there are a ton of [options here](https://github.com/google/CLASP#migrating-from-2x-to-3x)

# Features
- All the benefits and ease of Vite's build / development system
- Typesafe api for calling the google.script.run API from the client with dev server support

# Setup 
1. Clone this repository into your project.
2. Install dependencies: ```bun install```
3. Update your `tsconfig.json` - add the paths to your public server api functions to the path alias `@api`  in `compilerOptions.paths`. Make sure to include those paths under `include` of they are outside your clients' root directory.
4. Update `build.outdir` in `vite.config.ts` to point to your build directory. 

## Development server
1. Create a `.env` file and add your `SCRIPT_ID`
2. Follow the steps [outlined here](https://github.com/google/clasp/blob/master/docs/run.md)  to set up  ```clasp run``` for your project, and take note of the path to ```client_secret.json```
3.  Update your `.env`  to choose how credentials and other configuration tokens are read and saved: 
- `CLIENT_SECRET_PATH`  -  wherever you saved `client_secret.json` from the previous step
- `CREDENTIAL_PATH` -  the location that your tokens will be stored after you authorize your development server
- `APPSSCRIPT_JSON_PATH` -  the location of the  ```appsscript.json```  for your project
4. Run the auth setup script: ```bun ./gas-polyfill/auth.ts -a```
# Usage
**start dev server**: `bun dev`  
**build**: `bun build`
# Server functions
For developer ergonomics, I created a small typesafe wrapper around `google.script.run` client API that promisifies server function calls. To get the full benefits of that typesafety, make sure to update the path alias `@api` to point to the modules that export your public API functions on your server.  
```
createServerFn<K extends keyof ServerApi>(fn: K):
  (...args: Parameters<ServerApi[K]>) => ReturnType<ServerApi[K]>
```
