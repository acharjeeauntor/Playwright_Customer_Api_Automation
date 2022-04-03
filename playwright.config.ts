// @ts-check
import { PlaywrightTestConfig } from '@playwright/test'
const config: PlaywrightTestConfig = {

  testDir: './tests',
  testMatch: "*.test.ts",
  expect: {

    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 20000
  },
  //Global Setup to run before all tests
  globalSetup: `./global-setup`,

  //Global Teardown to run after all tests
  globalTeardown: `./global-teardown`,

  //sets timeout for each test case
  timeout: 120000,

  //number of retries if test case fails
  retries: 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  // reporter: [[`./CustomReporterConfig.ts`], ['list'], [`allure-playwright`], [`html`, { outputFolder: 'html-report', open: 'never' }]],
  reporter: [['list'], [`allure-playwright`], [`html`, { outputFolder: 'html-report', open: 'never' }]],

  /* Configure projects for major browsers */
  projects: [
    {
      name: `API`,
      use: {
        baseURL:`https://customer-test-api.herokuapp.com`,
        extraHTTPHeaders:{
          'Accept': 'application/json',
        }
      }
    }
  ],
};
export default config;