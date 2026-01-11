import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

interface SetupOptions {
  skipConfig?: boolean;
  verbose?: boolean;
}

export async function setupCommand(options: SetupOptions) {
  console.log(chalk.magenta.bold('\n🚀 Fast-Kit Setup Wizard\n'));

  try {
    // Check prerequisites
    await checkPrerequisites();

    // Install MCP servers from npm
    await installServers(options.verbose);

    // Configure Claude Code (unless skipped)
    if (!options.skipConfig) {
      await configureClaude(options.verbose);
    }

    // Show success message
    showSuccessMessage(options.skipConfig);
  } catch (error) {
    console.error(chalk.red('\n✗ Setup failed:'), error);
    process.exit(1);
  }
}

async function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();

  try {
    // Check Node.js
    const { stdout: nodeVersion } = await execa('node', ['--version']);
    spinner.succeed(chalk.green(`Node.js detected: ${nodeVersion}`));

    // Check npm
    const { stdout: npmVersion } = await execa('npm', ['--version']);
    console.log(chalk.green(`✓ npm detected: v${npmVersion}`));
  } catch (error) {
    spinner.fail(chalk.red('Prerequisites check failed'));
    throw new Error('Node.js and npm are required. Please install from https://nodejs.org/');
  }
}

async function installServers(verbose?: boolean) {
  console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Installing MCP Servers'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  const servers = [
    { name: 'SpecKit', package: '@fast-kit/spec-kit' },
    { name: 'PromptKit', package: '@fast-kit/prompt-kit' },
  ];

  for (const server of servers) {
    const spinner = ora(`Installing ${server.name}...`).start();

    try {
      const args = ['install', '-g', server.package];
      if (!verbose) {
        args.push('--silent');
      }

      await execa('npm', args, {
        stdio: verbose ? 'inherit' : 'ignore',
      });

      spinner.succeed(chalk.green(`${server.name} installed`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to install ${server.name}`));
      throw error;
    }
  }
}

async function configureClaude(verbose?: boolean) {
  console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Configuring Claude Code'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  const configPath = getClaudeConfigPath();
  console.log(chalk.cyan(`→ Claude config location: ${configPath}`));

  // Ensure config directory exists
  await fs.ensureDir(path.dirname(configPath));

  // Get global npm prefix to find installed packages
  const { stdout: npmPrefix } = await execa('npm', ['prefix', '-g']);

  // Determine package paths based on OS
  const isWindows = os.platform() === 'win32';
  const nodeModulesPath = path.join(npmPrefix, isWindows ? '' : 'lib', 'node_modules');

  const specKitPath = path.join(nodeModulesPath, '@fast-kit', 'spec-kit', 'dist', 'index.js');
  const promptKitPath = path.join(nodeModulesPath, '@fast-kit', 'prompt-kit', 'dist', 'index.js');

  // Verify packages exist
  if (!await fs.pathExists(specKitPath)) {
    throw new Error(`SpecKit not found at: ${specKitPath}`);
  }
  if (!await fs.pathExists(promptKitPath)) {
    throw new Error(`PromptKit not found at: ${promptKitPath}`);
  }

  // Create config object
  const newConfig = {
    mcpServers: {
      'spec-kit': {
        command: 'node',
        args: [specKitPath],
      },
      'prompt-kit': {
        command: 'node',
        args: [promptKitPath],
      },
    },
  };

  // Merge with existing config if it exists
  let config = newConfig;
  if (await fs.pathExists(configPath)) {
    console.log(chalk.cyan('→ Existing config found. Merging...'));
    const existing = await fs.readJson(configPath);
    config = {
      ...existing,
      mcpServers: {
        ...existing.mcpServers,
        ...newConfig.mcpServers,
      },
    };
  }

  // Write config
  await fs.writeJson(configPath, config, { spaces: 2 });
  console.log(chalk.green('✓ Config updated successfully'));

  if (verbose) {
    console.log(chalk.cyan('\n📝 Config Preview:'));
    console.log(chalk.gray(JSON.stringify(config, null, 2)));
  }
}

function getClaudeConfigPath(): string {
  const platform = os.platform();

  switch (platform) {
    case 'win32':
      return path.join(process.env.APPDATA || '', 'claude', 'config.json');
    case 'darwin':
      return path.join(os.homedir(), 'Library', 'Application Support', 'claude', 'config.json');
    default:
      return path.join(os.homedir(), '.config', 'claude', 'config.json');
  }
}

function showSuccessMessage(skipConfig?: boolean) {
  console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Setup Complete!'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.green('✨ Fast-Kit is ready to use!\n'));

  if (!skipConfig) {
    console.log(chalk.cyan('📋 Next Steps:'));
    console.log('  1. Restart Claude Code completely (quit and reopen)');
    console.log('  2. In Claude Code, try: "List all prompts"');
    console.log('  3. Try your first prompt: "Use function_creation to create hello world"\n');
  } else {
    console.log(chalk.yellow('⚠️  Claude Code configuration was skipped.'));
    console.log('   Run "fast-kit setup" without --skip-config to configure Claude Code.\n');
  }

  console.log(chalk.cyan('📚 Documentation:'));
  console.log('  - Validate setup: fast-kit validate');
  console.log('  - List servers: fast-kit list');
  console.log('  - Update servers: fast-kit update');
  console.log('  - GitHub: https://github.com/fast-kit/fast-kit\n');

  console.log(chalk.green('✓ Happy coding with Fast-Kit!'));
}
