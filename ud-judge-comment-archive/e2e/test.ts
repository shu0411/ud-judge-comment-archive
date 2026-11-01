import { test as base } from "@playwright/test";

// widgets.js は応答が遅いと page.goto の load 待ちを超過し、速いと埋め込みの描画で
// レイアウトがずれて操作中のクリックが失われる。e2eでは埋め込みの本文を検証しない
// ため空のスクリプトに差し替える（abortするとコンソールエラーになる）
export const test = base.extend({
  page: async ({ page }, runTest) => {
    await page.route("https://platform.twitter.com/widgets.js", (route) =>
      route.fulfill({ contentType: "text/javascript", body: "" }),
    );
    await runTest(page);
  },
});

export { expect } from "@playwright/test";
