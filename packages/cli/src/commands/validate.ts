import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { execa } from 'execa';

interface ValidateOptions {
  verbose?: boolean;
}

export async function validateCommand(options: ValidateOptions) {
  console.log(chalk.magenta.bold('\n🔍 Fast-Kit Validation\n'));

  let hasErrors = false;

  try {
    // Check if packages are installed globally
    hasErrors = !(await checkInstallation(options.verbose));

    // Check Claude config
    const configValid = await checkClaudeConfig(options.verbose);
    if (!configValid) hasErrors = true;

    // Show summary
    showSummary(hasErrors);

    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    console.error(chalk.red('\n✗ Validation failed:'), error);
    process.exit(1);
  }
}

async function checkInstallation(verbose?: boolean): Promise<boolean> {
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Checking Installation'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  let allInstalled = true;

  const packages = ['@fast-kit/spec-kit', '@fast-kit/prompt-kit'];

  for (const pkg of packages) {
    try {
      const { stdout } = await execa('npm', ['list', '-g', pkg, '--depth=0']);

      if (stdout.includes(pkg)) {
        console.log(chalk.green(`✓ ${pkg} installed`));
        if (verbose) {
          const match = stdout.match(new RegExp(`${pkg}@([\\d.]+)`));
          if (match) {
            console.log(chalk.gray(`  Version: ${match[1]}`));
          }
        }
      } else {
        console.log(chalk.red(`✗ ${pkg} NOT installed`));
        console.log(chalk.cyan(`  Run: npm install -g ${pkg}`));
        allInstalled = false;
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${pkg} NOT installed`));
      console.log(chalk.cyan(`  Run: npm install -g ${pkg}`));
      allInstalled = false;
    }
  }

  return allInstalled;
}

async function checkClaudeConfig(verbose?: boolean): Promise<boolean> {
  console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Checking Claude Config'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  const configPath = getClaudeConfigPath();

  if (!(await fs.pathExists(configPath))) {
    console.log(chalk.red('✗ Claude config file NOT found'));
    console.log(chalk.cyan(`  Expected: ${configPath}`));
    console.log(chalk.cyan('  Run: fast-kit setup'));
    return false;
  }

  console.log(chalk.green('✓ Claude config file found'));
  if (verbose) {
    console.log(chalk.gray(`  Location: ${configPath}`));
  }

  try {
    const config = await fs.readJson(configPath);

    if (!config.mcpServers) {
      console.log(chalk.red('✗ No mcpServers section in config'));
      return false;
    }

    let configValid = true;

    // Check spec-kit
    if (config.mcpServers['spec-kit']) {
      console.log(chalk.green('✓ spec-kit configured'));
      const configuredPath = config.mcpServers['spec-kit'].args?.[0];
      if (verbose && configuredPath) {
        console.log(chalk.gray(`  Path: ${configuredPath}`));
      }
    } else {
      console.log(chalk.red('✗ spec-kit NOT configured'));
      configValid = false;
    }

    // Check prompt-kit
    if (config.mcpServers['prompt-kit']) {
      console.log(chalk.green('✓ prompt-kit configured'));
      const configuredPath = config.mcpServers['prompt-kit'].args?.[0];
      if (verbose && configuredPath) {
        console.log(chalk.gray(`  Path: ${configuredPath}`));
      }
    } else {
      console.log(chalk.red('✗ prompt-kit NOT configured'));
      configValid = false;
    }

    return configValid;
  } catch (error) {
    console.log(chalk.red('✗ Failed to parse config.json'));
    console.log(chalk.gray(String(error)));
    return false;
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

function showSummary(hasErrors: boolean) {
  console.log(chalk.yellow('\n━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.yellow('  Validation Summary'));
  console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  if (hasErrors) {
    console.log(chalk.red('❌ Validation FAILED\n'));
    console.log(chalk.yellow('Please fix the errors above and run setup again:'));
    console.log(chalk.cyan('  fast-kit setup\n'));
  } else {
    console.log(chalk.green('✅ All checks PASSED\n'));
    console.log(chalk.green('Fast-Kit is properly configured!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log('  1. Restart Claude Code');
    console.log('  2. Try: "List all prompts"');
    console.log('  3. Check: https://github.com/fast-kit/fast-kit\n');
  }
}
