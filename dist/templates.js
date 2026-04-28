"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexTemplate = exports.typesTemplate = exports.stylesTemplate = exports.componentTemplate = void 0;
const componentTemplate = (name) => `import { View, Text } from 'react-native';

import { styles } from './${name}.styles';
import type { ${name}Props } from './${name}.types';

export const ${name} = ({}: ${name}Props) => {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
};

export default ${name};
`;
exports.componentTemplate = componentTemplate;
const stylesTemplate = (_name) => `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {},
});
`;
exports.stylesTemplate = stylesTemplate;
const typesTemplate = (name) => `export interface ${name}Props {
  [key: string]: any;
}
`;
exports.typesTemplate = typesTemplate;
const indexTemplate = (name) => `export { default, ${name} } from './${name}';
export type { ${name}Props } from './${name}.types';
`;
exports.indexTemplate = indexTemplate;
