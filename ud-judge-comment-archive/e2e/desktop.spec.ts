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
  // Tournament B is not the latest tournament, so it starts collapsed.
  await page
    .locator("#fixture-tournament-b")
    .getByRole("button", { name: "Fixture Tournament B" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Fixture Event B-1" }),
  ).toBeVisible();

  // Tournament C has no events: its empty-state message is shown instead,
  // once expanded (it also starts collapsed as a non-latest tournament).
  const tournamentC = page.locator("#fixture-tournament-c");
  await expect(
    tournamentC.getByRole("heading", { name: "Fixture Tournament C" }),
  ).toBeVisible();
  await tournamentC
    .getByRole("button", { name: "Fixture Tournament C" })
    .click();
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

  // Tournament B is not the latest tournament, so it starts collapsed and
  // its tweets aren't embedded until it's expanded.
  await page
    .locator("#fixture-tournament-b")
    .getByRole("button", { name: "Fixture Tournament B" })
    .click();
  await expect(
    page.getByRole("link", { name: tweetUrl("2222222222222222222") }),
  ).toBeVisible();
});

test("画面外のツイートはスクロールするまで埋め込まれず、近づくと表示される", async ({
  page,
}) => {
  await page.goto("/");

  // Event A-3 の末尾のツイートは初期ビューポートから十分離れているため、
  // スクロールするまで埋め込みが生成されない。
  const lastTweetLink = page.getByRole("link", {
    name: tweetUrl("3333333333333333320"),
  });
  await expect(
    page.getByRole("heading", { name: "Fixture Event A-3" }),
  ).toBeVisible();
  await expect(lastTweetLink).toBeHidden();

  // ページ下部までスクロールすると読み込まれて表示される。
  await page.locator("#fixture-tournament-b").scrollIntoViewIfNeeded();
  await expect(lastTweetLink).toBeVisible();
});

test("大会を閉じて再度開いてもツイートが表示される", async ({ page }) => {
  await page.goto("/");
  const tweetLink = page.getByRole("link", {
    name: tweetUrl("1111111111111111111"),
  });
  await expect(tweetLink).toBeVisible();

  const tournamentA = page
    .locator("#fixture-tournament-a")
    .getByRole("button", { name: "Fixture Tournament A" });
  await tournamentA.click();
  await expect(tweetLink).toBeHidden();

  await tournamentA.click();
  await expect(tweetLink).toBeVisible();
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
  const tournamentC = page.locator("#fixture-tournament-c");
  await expect(tournamentC).toBeInViewport();

  // Tournament C starts collapsed (it's not the latest tournament); clicking
  // its ToC entry should expand it, not just scroll to its collapsed header.
  await expect(
    tournamentC.getByText("まだ日程が登録されていません。"),
  ).toBeVisible();
});

test("prefers-color-schemeに応じてライト/ダークテーマが切り替わる", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const root = page.locator("#root > div").first();
  // theme.ts sets light background.default to #F8FAFC.
  await expect(root).toHaveCSS("background-color", "rgb(248, 250, 252)");

  await page.emulateMedia({ colorScheme: "dark" });
  // theme.ts sets dark background.default to #1E293B.
  await expect(root).toHaveCSS("background-color", "rgb(30, 41, 59)");
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
