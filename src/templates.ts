export const componentTemplate = (name: string): string => `import React from 'react';
import { View } from 'react-native';

import { styles } from './${name}.styles';
import type { ${name}Props } from './${name}.types';

const ${name}: React.FC<${name}Props> = () => {
  return <View style={styles.container} />;
};

export default ${name};
`;

export const stylesTemplate = (name: string): string => `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {},
});
`;

export const typesTemplate = (name: string): string => `export interface ${name}Props {
  // define props here
}
`;

export const indexTemplate = (name: string): string => `export { default } from './${name}';
export type { ${name}Props } from './${name}.types';
`;
