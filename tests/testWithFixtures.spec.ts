import { faker } from "@faker-js/faker";
import { test } from "../fixtures/testOptions";

test("Parameterizes methods", async ({ pageManager }) => {
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(
    1000
  )}@test.com`;

  await pageManager
    .onFormLayoutsPage()
    .submitUsingGridFormWithCredentialsAndSelectOption(
      process.env.USERNAME,
      process.env.PASSWORD,
      "Option 1"
    );
  await pageManager
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true
    );
});
