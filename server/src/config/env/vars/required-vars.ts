export const REQUIRED_VARS = ["COOKIE_SECRET", "NODE_ENV", "PORT"] as const;

export type RequiredVar = (typeof REQUIRED_VARS)[number];
export default REQUIRED_VARS;
