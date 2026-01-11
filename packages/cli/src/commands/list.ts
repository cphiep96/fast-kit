import chalk from 'chalk';
import { execa } from 'execa';

export async function listCommand() {
  console.log(chalk.magenta.bold('\n📦 Fast-Kit Installed Servers\n'));

  try {
    const packages = [
      { name: 'SpecKit', package: '@fast-kit/spec-kit' },
      { name: 'PromptKit', package: '@fast-kit/prompt-kit' },
    ];

    for (const pkg of packages) {
      try {
        const { stdout } = await execa('npm', ['list', '-g', pkg.package, '--depth=0']);

        const match = stdout.match(new RegExp(`${pkg.package}@([\\d.]+)`));
        if (match) {
          console.log(chalk.green(`✓ ${pkg.name}`));
          console.log(chalk.gray(`  Package: ${pkg.package}`));
          console.log(chalk.gray(`  Version: ${match[1]}`));
          console.log();
        } else {
          console.log(chalk.yellow(`⚠ ${pkg.name} - Not installed`));
          console.log(chalk.cyan(`  Run: npm install -g ${pkg.package}\n`));
        }
      } catch (error) {
        console.log(chalk.red(`✗ ${pkg.name} - Not installed`));
        console.log(chalk.cyan(`  Run: npm install -g ${pkg.package}\n`));
      }
    }

    console.log(chalk.cyan('💡 Tip: Run "fast-kit validate" to check configuration'));
  } catch (error) {
    console.error(chalk.red('Failed to list packages:'), error);
    process.exit(1);
  }
}
