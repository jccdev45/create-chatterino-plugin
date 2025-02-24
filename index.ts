#!/usr/bin/env bun

import chalk from "chalk";
import { Command } from "commander";
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import * as prompts from "prompts";

const program = new Command();

program
  .name("create-chatterino-plugin")
  .description("A CLI tool to create Chatterino plugins")
  .version("0.0.1");

program
  .argument("[pluginName]", "Name of the plugin")
  .option(
    "-p, --permissions <permissions>",
    "Plugin permissions (comma-separated)"
  )
  .action(
    async (
      pluginName: string | undefined,
      options: { permissions?: string }
    ) => {
      try {
        const name = pluginName || (await askForPluginName());
        const permissions = options.permissions
          ? options.permissions.split(",")
          : await askForPermissions();

        await createPlugin(name, permissions);

        console.log(chalk.green(`Plugin "${name}" created successfully!`));
      } catch (error: any) {
        console.error(chalk.red(`Failed to create plugin: ${error.message}`));
      }
    }
  );

function getChatterinoPath(): string {
  switch (process.platform) {
    case "win32":
      return join(process.env.APPDATA || "", "Chatterino2");
    case "linux":
      return join(homedir(), ".local", "share", "chatterino");
    case "darwin":
      return join(homedir(), "Library", "Application Support", "chatterino");
    default:
      throw new Error("Unsupported platform");
  }
}

async function askForPluginName(): Promise<string> {
  const response = await prompts({
    type: "text",
    name: "name",
    message: "What is the name of your plugin?",
    validate: (value: string) =>
      value !== "" ? true : "Plugin name cannot be empty",
  });
  return response.name;
}

async function askForPermissions(): Promise<string[]> {
  const response = await prompts({
    type: "multiselect",
    name: "permissions",
    message: "Select the permissions your plugin needs:",
    choices: [
      { title: "FilesystemRead", value: "FilesystemRead" },
      { title: "FilesystemWrite", value: "FilesystemWrite" },
      { title: "HTTP", value: "HTTP" },
    ],
  });
  return response.permissions;
}

function createInfoJson(pluginName: string, permissions: string[]): string {
  return JSON.stringify(
    {
      name: pluginName,
      description: "A new Chatterino plugin.",
      authors: ["Your Name"],
      homepage: "https://github.com/yourusername/your-repo",
      tags: ["plugin"],
      version: "0.0.1",
      license: "MIT",
      permissions: permissions.map((p) => ({ type: p })),
    },
    null,
    2
  );
}

function createInitLua(pluginName: string, permissions: string[]): string {
  let content = `print("${pluginName} plugin initialized!")\n\n`;

  if (
    permissions.includes("FilesystemRead") ||
    permissions.includes("FilesystemWrite")
  ) {
    content += `function cmd_filesystem(ctx)
    -- Add your filesystem operations here
end

c2.register_command("/test-fs", cmd_filesystem)
`;
  }

  if (permissions.includes("HTTP")) {
    content += `function cmd_http(ctx)
    -- Add your HTTP operations here
end

c2.register_command("/test-http", cmd_http)
`;
  }

  return content;
}

async function createPlugin(pluginName: string, permissions: string[]) {
  const baseDir = getChatterinoPath();
  const pluginDir = join(baseDir, "Plugins", pluginName);

  // Create plugin directory
  await mkdir(pluginDir, { recursive: true });

  // Create info.json
  const infoJsonContent = createInfoJson(pluginName, permissions);
  await writeFile(join(pluginDir, "info.json"), infoJsonContent);

  // Create init.lua
  const initLuaContent = createInitLua(pluginName, permissions);
  await writeFile(join(pluginDir, "init.lua"), initLuaContent);

  console.log(chalk.green(`Created plugin directory: ${pluginDir}`));
}

program.parse(process.argv);
