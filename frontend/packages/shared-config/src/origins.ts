export interface ORIGINS_INTERFACE {
  APP_ORIGIN: string;
  WIKI_ORIGIN: string;
}

export const ORIGINS = {
  APP_ORIGIN:
    (import.meta as any).env?.VITE_APP_ORIGIN ?? "http://localhost:3000",
  WIKI_ORIGIN:
    (import.meta as any).env?.VITE_WIKI_ORIGIN ?? "http://localhost:3001",
} satisfies ORIGINS_INTERFACE;
