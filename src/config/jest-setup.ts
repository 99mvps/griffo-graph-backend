import { TestDataSourceSetup } from "@database/typeorm";

export async function setupE2EDB(showLogs = false) {
  try {
    showLogs && console.log("initializing connection");
    await TestDataSourceSetup.initialize();

    showLogs && console.log("running migrations");
    await TestDataSourceSetup.runMigrations();
  } catch (error) {
    console.error(error);
  }
}

export async function closeE2ETests() {
  console.log("dropping migrations");
  try {
    await TestDataSourceSetup.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);

    await TestDataSourceSetup.destroy();
  } catch (error) {
    console.error(error);
  }
}

beforeAll(async () => {
  await setupE2EDB(true);
});

afterAll(async () => {
  await closeE2ETests();
});
