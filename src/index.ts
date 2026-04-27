#!/usr/bin/env node
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Command } from 'commander';
import { generateComponent } from './generate';

// Built-in RN and HTML element names that shouldn't be used as component names
const RESERVED_NAMES = new Set([
  'View', 'Text', 'Image', 'ScrollView', 'FlatList', 'SectionList',
  'TextInput', 'TouchableOpacity', 'TouchableHighlight', 'Pressable',
  'Button', 'Switch', 'Slider', 'ActivityIndicator', 'Modal',
  'SafeAreaView', 'KeyboardAvoidingView', 'StatusBar', 'VirtualizedList',
  'Component', 'Fragment', 'Children', 'React', 'App',
]);

function validateComponentName(value: string): true | string {
  const name = value.trim();

  if (!name) return 'Component name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (!/^[A-Z]/.test(name)) return 'Must start with an uppercase letter (PascalCase)';
  if (!/^[A-Z][A-Za-z0-9]+$/.test(name)) return 'Only letters and digits allowed, PascalCase (e.g. MovieCard)';
  if (RESERVED_NAMES.has(name)) return `"${name}" is a reserved React Native name — use a more specific name`;

  return true;
}

const program = new Command();

program
  .name('rn-gen')
  .description('React Native component generator')
  .version('1.0.0')
  .argument('[name]', 'component name')
  .option('-p, --path <path>', 'target directory', process.cwd())
  .action(async (nameArg: string | undefined, options: { path: string }) => {
    console.log(chalk.cyan('\n  React Native Component Generator\n'));

    const { shouldCreate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldCreate',
        message: 'Create a new component?',
        default: true,
      },
    ]);

    if (!shouldCreate) {
      console.log(chalk.yellow('Cancelled.'));
      process.exit(0);
    }

    let name = nameArg?.trim();

    if (name) {
      const validation = validateComponentName(name);
      if (validation !== true) {
        console.error(chalk.red(`\n  Invalid name: ${validation}\n`));
        process.exit(1);
      }
    } else {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Component name:',
          validate: validateComponentName,
        },
      ]);
      name = answers.name.trim();
    }

    const { targetPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'targetPath',
        message: 'Target path:',
        default: options.path,
      },
    ]);

    const resolvedPath = path.resolve(targetPath);

    try {
      generateComponent(name!, resolvedPath);

      console.log(chalk.green(`\n  ✓ Created ${name}/`));
      console.log(chalk.gray(`    ${name}/${name}.tsx`));
      console.log(chalk.gray(`    ${name}/${name}.styles.ts`));
      console.log(chalk.gray(`    ${name}/${name}.types.ts`));
      console.log(chalk.gray(`    ${name}/index.ts\n`));
    } catch (err) {
      console.error(chalk.red(`\n  Error: ${(err as Error).message}\n`));
      process.exit(1);
    }
  });

program.parse();
