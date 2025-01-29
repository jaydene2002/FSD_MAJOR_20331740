import { expect, seedData, test } from "./fixtures";

test.beforeAll(async () => {
  await seedData();
});

test.describe("Anonymous Layout", () => {
  test("Home Page", async ({ page }) => {
    await page.goto("/");
    expect(await page.title()).toBe("Create Next App");
    await expect(
      page.getByText(
        "Delicious, bite-sized pieces of skills for your personal growth!",
      ),
    ).toBeVisible();
    await expect(page.getByText("Public Course")).toBeVisible();
  });
});
