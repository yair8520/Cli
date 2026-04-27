import fs from 'fs';
import path from 'path';
import { componentTemplate, stylesTemplate, typesTemplate, indexTemplate } from './templates';

export function generateComponent(name: string, targetPath: string): void {
  const componentDir = path.join(targetPath, name);

  if (fs.existsSync(componentDir)) {
    throw new Error(`Component "${name}" already exists at ${componentDir}`);
  }

  fs.mkdirSync(componentDir, { recursive: true });

  const files: Record<string, string> = {
    [`${name}.tsx`]: componentTemplate(name),
    [`${name}.styles.ts`]: stylesTemplate(name),
    [`${name}.types.ts`]: typesTemplate(name),
    ['index.ts']: indexTemplate(name),
  };

  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(componentDir, filename), content, 'utf-8');
  }
}
