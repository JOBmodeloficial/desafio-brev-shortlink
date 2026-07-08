import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'node_modules', 'src/db/migrations'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
);
