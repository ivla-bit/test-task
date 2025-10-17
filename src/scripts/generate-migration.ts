import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const migrationName = process.env.npm_config_name;

if (!migrationName) {
  console.error("Error: Migration name is required. Use --name=migration_name");
  process.exit(1);
}

const cmd = `npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate migrations/${migrationName} -d src/typeOrm.config.ts
`;
console.log(`Running: ${cmd}`);
execSync(cmd, { stdio: "inherit" });
