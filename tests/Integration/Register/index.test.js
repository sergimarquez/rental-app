import 'expect-puppeteer';

describe('Load page', () => {
  test('welcome page loads loads correctly', async () => {
    await page.goto('http://localhost:3000');
    await expect(page).toMatch('Welcome');
    await expect(page).toMatch('Find the apartment of your dreams');
  });

  test('navigate to register page', async () => {
    await page.goto('http://localhost:3000');

    await page.click("button", { text: "Access the private area" });
    await expect(page).toMatch("Login to your account");

    await expect(page).toClick("a", { text: "Sign Up" });

    await expect(page).toMatch("Create an account");
    await expect(page).toMatch(
      "I'm a realtor and want to publish my listings."
    );
  });

  test("test validating registration data", async () => {
    await page.goto("http://localhost:3000/signup");

    await expect(page).toFill('input[name="email"]', "notanemail");
    await expect(page).toFill('input[name="passwordOne"]', "pass");
    await expect(page).toFill('input[name="passwordTwo"]', "not matching");

    await expect(page).toMatchElement('button[type="submit"]:disabled');

    await expect(page).toFill('input[name="username"]', "James");
    await expect(page).toFill('input[name="email"]', "james@email.com");
    await expect(page).toFill('input[name="passwordOne"]', "pass1234");
    await expect(page).toFill('input[name="passwordTwo"]', "pass1234");

    await expect(page).toMatchElement('button[type="submit"]:not([disabled])');
  });
});
