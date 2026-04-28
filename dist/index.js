#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const commander_1 = require("commander");
const generate_1 = require("./generate");
// Built-in RN and HTML element names that shouldn't be used as component names
const RESERVED_NAMES = new Set([
    'View', 'Text', 'Image', 'ScrollView', 'FlatList', 'SectionList',
    'TextInput', 'TouchableOpacity', 'TouchableHighlight', 'Pressable',
    'Button', 'Switch', 'Slider', 'ActivityIndicator', 'Modal',
    'SafeAreaView', 'KeyboardAvoidingView', 'StatusBar', 'VirtualizedList',
    'Component', 'Fragment', 'Children', 'React', 'App',
]);
function validateComponentName(value) {
    const name = value.trim();
    if (!name)
        return 'Component name is required';
    if (name.length < 2)
        return 'Name must be at least 2 characters';
    if (!/^[A-Z]/.test(name))
        return 'Must start with an uppercase letter (PascalCase)';
    if (!/^[A-Z][A-Za-z0-9]+$/.test(name))
        return 'Only letters and digits allowed, PascalCase (e.g. MovieCard)';
    if (RESERVED_NAMES.has(name))
        return `"${name}" is a reserved React Native name — use a more specific name`;
    return true;
}
const program = new commander_1.Command();
program
    .name('rngx')
    .description('React Native component generator')
    .version('1.0.0')
    .argument('[name]', 'component name')
    .option('-p, --path <path>', 'target directory', process.cwd())
    .action(async (nameArg, options) => {
    console.log(chalk_1.default.cyan('\n  React Native Component Generator\n'));
    const { shouldCreate } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'shouldCreate',
            message: 'Create a new component?',
            default: true,
        },
    ]);
    if (!shouldCreate) {
        console.log(chalk_1.default.yellow('Cancelled.'));
        process.exit(0);
    }
    let name = nameArg?.trim();
    if (name) {
        const validation = validateComponentName(name);
        if (validation !== true) {
            console.error(chalk_1.default.red(`\n  Invalid name: ${validation}\n`));
            process.exit(1);
        }
    }
    else {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Component name:',
                validate: validateComponentName,
            },
        ]);
        name = answers.name.trim();
    }
    const { targetPath } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'targetPath',
            message: 'Target path:',
            default: options.path,
        },
    ]);
    const resolvedPath = path_1.default.resolve(targetPath);
    try {
        (0, generate_1.generateComponent)(name, resolvedPath);
        console.log(chalk_1.default.green(`\n  ✓ Created ${name}/`));
        console.log(chalk_1.default.gray(`    ${name}/${name}.tsx`));
        console.log(chalk_1.default.gray(`    ${name}/${name}.styles.ts`));
        console.log(chalk_1.default.gray(`    ${name}/${name}.types.ts`));
        console.log(chalk_1.default.gray(`    ${name}/index.ts\n`));
    }
    catch (err) {
        console.error(chalk_1.default.red(`\n  Error: ${err.message}\n`));
        process.exit(1);
    }
});
program.parse();
