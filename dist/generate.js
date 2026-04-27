"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const templates_1 = require("./templates");
function generateComponent(name, targetPath) {
    const componentDir = path_1.default.join(targetPath, name);
    if (fs_1.default.existsSync(componentDir)) {
        throw new Error(`Component "${name}" already exists at ${componentDir}`);
    }
    fs_1.default.mkdirSync(componentDir, { recursive: true });
    const files = {
        [`${name}.tsx`]: (0, templates_1.componentTemplate)(name),
        [`${name}.styles.ts`]: (0, templates_1.stylesTemplate)(name),
        [`${name}.types.ts`]: (0, templates_1.typesTemplate)(name),
        ['index.ts']: (0, templates_1.indexTemplate)(name),
    };
    for (const [filename, content] of Object.entries(files)) {
        fs_1.default.writeFileSync(path_1.default.join(componentDir, filename), content, 'utf-8');
    }
}
