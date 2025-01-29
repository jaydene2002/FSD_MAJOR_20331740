import { test as setup } from "@playwright/test";
import { seedData } from "./fixtures";

setup.beforeAll(async () => {
  await seedData();
});

setup("authenticate user", async ({ page, playwright }) => {
  const authFile = ".auth/user.json";
  // Perform authentication steps. Replace these actions with your own.
  const apiContext = await playwright.request.newContext({
    baseURL: process.env.ROOT_URL,
  });
  const { csrfToken } = await (await apiContext.get("/api/auth/csrf")).json();
  await apiContext.post("/api/auth/callback/credentials", {
    form: {
      csrfToken,
      email: "user@email.com",
      password: "123",
    },
  });

  await apiContext.storageState({ path: authFile });
});

setup("authenticate admin", async ({ page, playwright }) => {
  const authFile = ".auth/wsu-admin.json";
  // Perform authentication steps. Replace these actions with your own.
  const apiContext = await playwright.request.newContext({
    baseURL: process.env.ROOT_URL,
  });
  const { csrfToken } = await (await apiContext.get("/api/auth/csrf")).json();
  await apiContext.post("/api/auth/callback/credentials", {
    form: {
      csrfToken,
      email: "admin@email.com",
      password: "123",
    },
  });

  await apiContext.storageState({ path: authFile });
});
