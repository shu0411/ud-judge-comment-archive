import { test, expect } from "@playwright/test";
import { tweetUrl } from "../src/constants.ts";

test("ヘッダーにサイトタイトルと非公式の注意書きが表示される", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "UNIDOL 審査員コメントまとめ",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "当サイトはファンによる非公式サイトです。UNIDOL公式とは一切関係ありません。",
    ),
  ).toBeVisible();
});

test("fixtureデータの大会・日程が表示され、空状態のメッセージも表示される", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page
      .locator("#fixture-tournament-a")
      .getByRole("heading", { name: "Fixture Tournament A" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-1" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-2" }),
  ).toBeVisible();

  await expect(
    page
      .locator("#fixture-tournament-b")
      .getByRole("heading", { name: "Fixture Tournament B" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Fixture Event B-1" }),
  ).toBeVisible();

  // Tournament C has no events: its empty-state message is shown instead.
  const tournamentC = page.locator("#fixture-tournament-c");
  await expect(
    tournamentC.getByRole("heading", { name: "Fixture Tournament C" }),
  ).toBeVisible();
  await expect(
    tournamentC.getByText("まだ日程が登録されていません。"),
  ).toBeVisible();

  // Event A-2 has no tweets: its empty-state message is shown instead.
  const eventA2 = page
    .locator("div", {
      has: page.getByRole("heading", { name: "Fixture Event A-2" }),
    })
    .last();
  await expect(
    eventA2.getByText("まだコメントが登録されていません。"),
  ).toBeVisible();
});

test("ツイートIDごとに埋め込みが表示され、共有アカウントのURLにリンクする", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: tweetUrl("1111111111111111111") }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: tweetUrl("1111111111111111112") }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: tweetUrl("2222222222222222222") }),
  ).toBeVisible();
});

test("全て折りたたむ・全て展開する・個別の開閉が正しく動作する", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-1" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "全て折りたたむ" }).click();
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-1" }),
  ).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Fixture Tournament A" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "全て展開" }).click();
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-1" }),
  ).toBeVisible();

  // Collapsing only Tournament A hides its own events but leaves Tournament B untouched.
  await page
    .locator("#fixture-tournament-a")
    .getByRole("button", { name: "Fixture Tournament A" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-1" }),
  ).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Fixture Event B-1" }),
  ).toBeVisible();
});

test("目次に大会名が一覧表示され、クリックすると該当箇所へスクロールする", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "目次を開く" })).toBeHidden();

  const toc = page.locator("nav");
  await expect(
    toc.getByRole("button", { name: "Fixture Tournament A" }),
  ).toBeVisible();
  await expect(
    toc.getByRole("button", { name: "Fixture Tournament B" }),
  ).toBeVisible();
  await expect(
    toc.getByRole("button", { name: "Fixture Tournament C" }),
  ).toBeVisible();

  await toc.getByRole("button", { name: "Fixture Tournament C" }).click();
  await expect(page.locator("#fixture-tournament-c")).toBeInViewport();
});

test("prefers-color-schemeに応じてライト/ダークテーマが切り替わる", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const root = page.locator("#root > div").first();
  await expect(root).toHaveCSS("background-color", "rgb(255, 255, 255)");

  await page.emulateMedia({ colorScheme: "dark" });
  // Tailwind v4's default gray-900 is defined in OKLCH, not sRGB.
  await expect(root).toHaveCSS("background-color", "oklch(0.21 0.034 264.665)");
});

test("コンソールエラーが発生しない", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Fixture Tournament A" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
