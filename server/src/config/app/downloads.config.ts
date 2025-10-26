export interface DownloadsConfig {
  CACHE_DURATION: number;
}

const config = {
  CACHE_DURATION: 5 * 60 * 1000,
} satisfies DownloadsConfig;

export default config;
