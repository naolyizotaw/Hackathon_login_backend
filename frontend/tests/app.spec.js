const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000'; // Assuming frontend runs on port 3000

// Generate random user credentials for each test run
const randomString = () => Math.random().toString(36).substring(7);
const testUser = {
  username: `testuser_${randomString()}`,
  email: `test_${randomString()}@example.com`,
  password: 'password123',
};

test.describe('Contact Management App E2E Test', () => {

  test.beforeAll(async () => {
    // In a real-world scenario, you would start your servers here.
    // For this environment, we assume the servers are started externally.
    // Backend on port 5000, Frontend on port 3000.
  });

  test('should allow a user to sign up, log in, and manage contacts', async ({ page }) => {
    // --- 1. Registration ---
    await page.goto(`${BASE_URL}/signup`);
    await expect(page).toHaveURL(`${BASE_URL}/signup`);

    await page.fill('input[name="username"]', testUser.username);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Sign Up")');

    // Wait for the success message
    const successAlert = page.locator('div[role="alert"]', { hasText: /signup successful/i });
    await expect(successAlert).toBeVisible({ timeout: 10000 });

    // --- 2. Login ---
    // The signup page should redirect to login after a few seconds, or we can navigate manually
    await page.waitForURL(`${BASE_URL}/login`, { timeout: 6000 });

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Sign In")');

    // After login, user should be on the dashboard
    await page.waitForURL(`${BASE_URL}/`, { timeout: 5000 });
    await expect(page.locator('h1', { hasText: 'Contacts Dashboard' })).toBeVisible();
    await expect(page.locator(`text=Welcome, ${testUser.username}`)).toBeVisible();

    // --- 3. Add a new contact ---
    const contact = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };

    await page.click('button:has-text("Add Contact")');

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await dialog.locator('input[name="name"]').fill(contact.name);
    await dialog.locator('input[name="email"]').fill(contact.email);
    await dialog.locator('input[name="phone"]').fill(contact.phone);
    await dialog.locator('button:has-text("Save")').click();

    // Check if the contact appears in the list
    const newContactInList = page.locator(`text=${contact.name}`);
    await expect(newContactInList).toBeVisible();

    // --- 4. Edit the contact ---
    const updatedContact = {
      name: 'John Doe Updated',
      email: 'john.doe.updated@example.com',
    };

    const contactListItem = page.locator('li', { hasText: contact.name });
    await contactListItem.locator('button[aria-label="edit"]').click();

    await expect(dialog).toBeVisible();
    await dialog.locator('input[name="name"]').fill(updatedContact.name);
    await dialog.locator('input[name="email"]').fill(updatedContact.email);
    await dialog.locator('button:has-text("Save")').click();

    await expect(page.locator(`text=${updatedContact.name}`)).toBeVisible();
    await expect(page.locator(`text=${contact.name}`)).not.toBeVisible();

    // --- 5. Delete the contact ---
    const updatedContactListItem = page.locator('li', { hasText: updatedContact.name });

    page.on('dialog', dialog => dialog.accept());

    await updatedContactListItem.locator('button[aria-label="delete"]').click();

    await expect(page.locator(`text=${updatedContact.name}`)).not.toBeVisible();
    await expect(page.locator('text=No contacts found')).toBeVisible();
  });
});
