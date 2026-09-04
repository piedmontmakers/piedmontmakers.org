import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  use: { baseURL: 'http://127.0.0.1:4399', viewport: { width: 390, height: 844 }, trace: 'retain-on-failure' },
  webServer: {
    command: 'USE_CUSTOM_DOMAIN=true npm run preview -- --host 127.0.0.1 --port 4399',
    url: 'http://127.0.0.1:4399',
    reuseExistingServer: false,
  },
});
