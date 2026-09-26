# Description
This is a template project for easy development of a Google Apps Script Web App with a SolidJS frontend.

# Features
- All the benefits and ease of Vite's build / development system
- Typesafe api for calling the google.script.run API from the client with dev server support

# Setup 
1. Clone this repository into your project `git clone <repo_url>`. 
2. Install [clasp](https://github.com/google/CLASP)  and pull the repo into your build directory or create a new project specifying your rootDir  
3. Install dependencies: ```bun install```
## Development server
1. Create a `.env` file and add your `SCRIPT_ID`
2. Follow the steps [outlined here](https://github.com/google/clasp/blob/master/docs/run.md)  to set up  ```clasp run``` for your project, and take note of the path to ```client_secret.json```
3.  Update your `.env`  to choose how credentials and other configuration tokens are read and saved: 
	`CLIENT_SECRET_PATH`  -  wherever you saved `client_secret.json` from the previous step
	`CREDENTIAL_PATH` -  the location that your tokens will be stored after you authorize your development server
	`APPSSCRIPT_JSON_PATH` -  the location of the  ```appsscript.json```  for your project
4. Run the auth setup script: ```bun ./gas-polyfill/auth.ts -a```

# Usage
dev: ```bun run dev``` 
build: ```bun run build```
