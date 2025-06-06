import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";
import path from "path";
import { fileURLToPath } from "url";

test.beforeEach(async () => {
  await seed();
});

test.describe("ADMIN UPDATE SCREEN", () => {
  test(
    "Authorisation",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Shows login screen if not logged
      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Update post form",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      const saveButton = await userPage.getByText("Save");

      // UPDATE SCREEN > There must be the following fields which must be validated for errors:

      // UPDATE SCREEN > Title
      // replaced getByLabel("Title") with getByRole("textbox", { name: "Title" }) as it is conflicting with library
      const titleInput = userPage.getByRole("textbox", { name: "Title" });
      await expect(titleInput).toBeVisible();
      await userPage.getByRole("textbox", { name: "Title" }).clear();
      await saveButton.click();

      await expect(userPage.getByText("Title is required")).toBeVisible({ timeout: 10000 });
      await userPage.getByRole("textbox", { name: "Title" }).fill("New title");
      await saveButton.click();
      await expect(userPage.getByText("Title is required")).not.toBeVisible();

      // UPDATE SCREEN > Description

      await userPage.getByLabel("Description").clear();
      await saveButton.click();

      await expect(userPage.getByText("Description is required")).toBeVisible();
      await userPage.getByLabel("Description").fill("New Description");
      await saveButton.click();
      await expect(
        userPage.getByText("Description is required"),
      ).not.toBeVisible();

      // cannot be longer than 200
      await userPage.getByLabel("Description").fill("a".repeat(201));
      await saveButton.click();
      await expect(
        userPage.getByText(
          "Description is too long. Maximum is 200 characters",
        ),
      ).toBeVisible();

      await userPage.getByLabel("Description").fill("a".repeat(200));
      await saveButton.click();
      await expect(
        userPage.getByText(
          "Description is too long. Maximum is 200 characters",
        ),
      ).not.toBeVisible();

      // UPDATE SCREEN > Content

      await userPage.getByLabel("Content").clear();
      await saveButton.click();

      await expect(userPage.getByText("Content is required")).toBeVisible();
      await userPage.getByLabel("Content").fill("New Description");
      await saveButton.click();
      await expect(userPage.getByText("Content is required")).not.toBeVisible();

      // UPDATE SCREEN > Image

      await userPage.getByLabel("Image URL").clear();
      await saveButton.click();

      // required
      await expect(userPage.getByText("Image URL is required")).toBeVisible();

      // invalid
      await userPage.getByLabel("Image URL").fill("some url");
      await saveButton.click();
      await expect(userPage.getByText("This is not a valid URL")).toBeVisible();

      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await saveButton.click();
      await expect(
        userPage.getByText("Image URL is required"),
      ).not.toBeVisible();

      // UPDATE SCREEN > Tag Lists

      await userPage.getByLabel("Tags").clear();
      await saveButton.click();

      await expect(
        userPage.getByText("At least one tag is required"),
      ).toBeVisible();
      await userPage.getByLabel("Tags").fill("Tag");
      await saveButton.click();
      await expect(
        userPage.getByText("At least one tag is required"),
      ).not.toBeVisible();
    },
  );

  test(
    "Save post form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // BACKEND / ADMIN / UPDATE SCREEN > Logged in user can save changes to database, if the form is validated

      const titleInput = userPage.getByRole("textbox", { name: "Title" });
      await expect(titleInput).toBeVisible();
      await userPage.getByRole("textbox", { name: "Title" }).fill("New title");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");
      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Post updated successfully"),
      ).toBeVisible();

      // check if the changes are there
      await userPage.goto("/");

      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
      await expect(article.getByText("Tag")).toBeVisible();
      await expect(article.locator("img")).toHaveAttribute(
        "src",
        "http://example.com/image.jpg",
      );
    },
  );

  test(
    "Create post form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/posts/create");

      // BACKEND / ADMIN / UPDATE SCREEN > Logged in user can create a new post to the database, if the form is validated

      await userPage.getByRole("textbox", { name: "Title" }).fill("New title");
      await userPage.getByLabel("Category").fill("React");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");
      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Post updated successfully"),
      ).toBeVisible();

      // check if the changes are there
      await userPage.goto("/");

      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
      await expect(article.locator('a:has-text("New title")')).toHaveAttribute(
        "href",
        "/post/new-title",
      );
      await expect(article.getByText("Tag")).toBeVisible();
      await expect(article.locator("img")).toHaveAttribute(
        "src",
        "http://example.com/image.jpg",
      );
    },
  );

  test(
    "Show preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Under the Description is a "Preview" button that replaces the text area with a rendered markdown string and changes the title to "Close Preview".
      await (await userPage.getByText("Preview").all())[1].focus();
      await (await userPage.getByText("Preview").all())[1].click();
      await expect(userPage.getByTestId("content-preview")).toBeVisible();
      await expect(
        await userPage.getByTestId("content-preview").innerHTML(),
      ).toContain("<strong>sint voluptas</strong>");
      await expect(userPage.getByText("Close Preview")).toBeVisible();
    },
  );

  test(
    "Restore preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > When the preview is closed, the cursor must be in the same position as before opening the preview.

      let textBox = await userPage.getByLabel("Content");
      await textBox.evaluate((element: HTMLTextAreaElement) => {
        element.focus();
        element.setSelectionRange(20, 20);
        element.focus();
      });

      await (await userPage.getByText("Preview").all())[1].click();
      await userPage.getByText("Close Preview").click();

      textBox = await userPage.getByLabel("Content");
      const { selectionStart, selectionEnd } = await textBox.evaluate(
        (textarea: HTMLTextAreaElement) => {
          return {
            selectionStart: textarea.selectionStart,
            selectionEnd: textarea.selectionEnd,
          };
        },
      );

      expect(selectionStart).toBe(20);
      expect(selectionEnd).toBe(20);
    },
  );

  test(
    "Image Preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Under the image input is an image preview;

      await expect(userPage.getByTestId("image-preview")).toBeVisible();
      await expect(
        await userPage.getByTestId("image-preview").getAttribute("src"),
      ).toBe(
        "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      );
    },
  );

  test(
    "Save Button",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > User can click on the "Save" button that displays an error ui if one of the fields is not specified or valid.

      await expect(
        userPage.getByText("Please fix the errors before saving"),
      ).not.toBeVisible();

      await userPage.getByRole("textbox", { name: "Title" }).clear();
      await userPage.getByText("Save").click();
      await expect(
        userPage.getByText("Please fix the errors before saving"),
      ).toBeVisible();
    },
  );

  test("Image upload shows preview", { tag: "@a4" }, async ({ userPage }) => {
    await userPage.goto("/post/no-front-end-framework-is-the-best");
    
// @ts-expect-error: import.meta.url is supported in our environment
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, "../assets/test.svg");

    // Get the initial src
    const preview = userPage.getByTestId("image-preview");
    const initialSrc = await preview.getAttribute("src");

    // Click the upload button to open file dialog
    const [fileChooser] = await Promise.all([
      userPage.waitForEvent("filechooser"),
      userPage.getByText("Upload image").click(),
    ]);
    await fileChooser.setFiles(filePath);

    // Wait for the src to change to a Cloudinary URL
    await expect
      .poll(async () => await preview.getAttribute("src"), {
        timeout: 10000,
      })
      .not.toBe(initialSrc);

    const src = await preview.getAttribute("src");
    expect(src).toContain("cloudinary.com");
  });

  test(
    "RichTextEditor renders markdown preview correctly",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // Fill the content field with markdown
      await userPage.getByLabel("Content").fill("**bold text**");

      // Click the Preview button for Content (second one)
      await (await userPage.getByText("Preview").all())[1].click();

      // Check that the preview is visible and contains the rendered HTML
      const preview = userPage.getByTestId("content-preview");
      await expect(preview).toBeVisible();
      await expect(await preview.innerHTML()).toContain("<strong>bold text</strong>");
    }
  );

  test(
    "RichTextEditor renders markdown preview for Description",
    { tag: "@a4" },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // Fill the description field with markdown
      const descInput = await userPage.getByLabel("Description");
      await descInput.click({ clickCount: 3 });
      await descInput.fill("");
      await descInput.type("**desc bold**");
      await userPage.waitForTimeout(100);

      // Click the Preview button for Description (first one)
      await (await userPage.getByText("Preview").first()).click();

      // Check that the preview is visible and contains the rendered HTML
      const preview = userPage.getByTestId("description-preview");
      await expect(preview).toBeVisible();
      await expect(await preview.innerHTML()).toContain("<strong>desc bold</strong>");
    }
  );
});
