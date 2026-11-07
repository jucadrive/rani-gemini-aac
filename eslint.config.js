import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * @description GEMINI.md 헌법의 하드 룰(HR-01 ~ HR-03)을 정적 분석으로 강제하는 ESLint Flat Config
 * 1. [HR-01] 단일 파일 200줄 제한 (공백 및 주석 포함)
 * 2. [HR-02] 명시적/암시적 any 금지
 * 3. [HR-03] src/components 내부에서 store 및 services 직접 참조 금지
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      'max-lines': [
        'error',
        {
          max: 200,
          skipBlankLines: false,
          skipComments: false,
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/store/**', '**/store', '../store/**', '../../store/**'],
              message:
                '[HR-03 위반] src/components 내부에서는 store를 직접 참조할 수 없습니다. Props를 통해 주입받으세요.',
            },
            {
              group: ['**/services/**', '**/services', '../services/**', '../../services/**'],
              message:
                '[HR-03 위반] src/components 내부에서는 services를 직접 참조할 수 없습니다. Props 또는 상위 컨테이너를 통해 주입받으세요.',
            },
          ],
        },
      ],
    },
  }
);

