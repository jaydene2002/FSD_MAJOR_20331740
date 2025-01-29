import { expect } from "@playwright/test";
import { seedData, setOptions, test } from "./fixtures";

const adminUrl = (view = "general") => `/admin/...`;

test.describe("Authorisation", () => {
  test.beforeEach(async () => {
    await seedData();
  });

  test("cannot be visited by a non owner", async ({ userPage }) => {
    await setOptions(userPage.context(), { editMode: true });
    await userPage.goto(adminUrl());
    await expect(userPage.getByText("Access Prohibited")).toBeVisible();
  });
});

test.describe("General Properties", () => {
  test.beforeEach(async ({ adminPage }) => {
    await seedData();
    await adminPage.goto(adminUrl("general"));
  });

  test("shows bullets based on section type", async ({ adminPage }) => {
    await adminPage.getByLabel("Type", { exact: true }).selectOption("Lecture");
    await adminPage.getByText("Change").click();
  });
});
