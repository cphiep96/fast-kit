import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

export async function updateCommand() {
  console.log(chalk.magenta.bold('\n🔄 Fast-Kit Update\n'));

  const servers = [
    { name: 'SpecKit', package: '@fast-kit/spec-kit' },
    { name: 'PromptKit', package: '@fast-kit/prompt-kit' },
  ];

  try {
    for (const server of servers) {
      const spinner = ora(`Updating ${server.name}...`).start();

      try {
        await execa('npm', ['update', '-g', server.package]);
        spinner.succeed(chalk.green(`${server.name} updated`));
      } catch (error) {
        spinner.fail(chalk.red(`Failed to update ${server.name}`));
        throw error;
      }
    }

    console.log(chalk.green('\n✓ All servers updated successfully!'));
    console.log(chalk.cyan('\n💡 Restart Claude Code to use the updated versions'));
  } catch (error) {
    console.error(chalk.red('\n✗ Update failed:'), error);
    process.exit(1);
  }
}
