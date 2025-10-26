export const REQUIRED_VARS = [
      "COOKIE_SECRET",
  "CURSEFORGE_API_KEY",
  "CURSEFORGE_PROJECT_ID",
  "MODRINTH_PROJECT_ID",
  "NODE_ENV",
  "PORT",
    ] as const;

    export type RequiredVar = typeof REQUIRED_VARS[number];
    export default REQUIRED_VARS;
    