// export default {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: [
//     'plugin:react/recommended',
//     'airbnb',
//     'plugin:prettier/recommended',
//   ],
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 12,
//     sourceType: 'module',
//   },
//   plugins: [
//     'react',
//     'react-hooks',
//     'unused-imports',
//     'prettier',
//   ],
//   settings: {
//     react: {
//       version: 'detect',
//     },
//   },
//   rules: {
//     'react/jsx-filename-extension': [
//       2,
//       { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
//     ],
//     'react/jsx-props-no-spreading': 'off',
//     'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
//     'react/jsx-indent': 'off',
//     'react/jsx-indent-props': 'off',
//     'react/jsx-curly-newline': 'off',
//     'react/prop-types': 'off',
//     'import/no-unresolved': 'off',
//     'no-param-reassign': 'off',
//     'prettier/prettier': [
//       'error',
//       {
//         endOfLine: 'auto',
//       },
//       {
//         "rules": {
//           "unused-imports/no-unused-imports": "error"
//         }
//       }
//     ],
//     'react-hooks/rules-of-hooks': 'error',
//     'import/prefer-default-export': 'off',
//     'react/function-component-definition': 'off',
//     'no-unused-vars': 'off', // Remove the extra space here
//     'import/extensions': 'off',
//     'no-shadow': 'off',
//     'no-use-before-define': 'off',
//     'react/require-default-props': 'off',
//     'no-promise-executor-return': 'off',
//     'import/no-extraneous-dependencies': 'off',
// },

// };

// // module.exports = {
// //   root: true,
// //   env: { browser: true, es2020: true },
// //   extends: [
// //     'eslint:recommended',
// //     'plugin:react/recommended',
// //     'plugin:react/recommended',
// //     'plugin:react/jsx-runta



module.exports = {
  "root": false,
  "env": {
    "es2021": true
  },
  "extends": [
    "prettier",
    "plugin:react/jsx-runtime",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "React",
      "fragment": "Fragment",
      "version": "detect",
      "flowVersion": "0.53"
    },
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "src/"]
      }
    }
  },
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "impliedStrict": true,
      "jsx": true
    },
    "ecmaVersion": 12
  },
  "plugins": ["prettier", "react", "react-hooks"],
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/react-in-jsx-scope": "off",
    "no-undef": "off",
    "react/display-name": "error",
    "react/jsx-filename-extension": "off",
    "no-param-reassign": "off",
    "react/prop-types": "warn",
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/jsx-props-no-spreading": "off",
    "react/forbid-prop-types": "off",
    "import/order": "off",
    "import/no-cycle": "off",
    "no-console": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "prefer-destructuring": "off",
    "no-shadow": "error",
    "import/no-named-as-default": "error",
    "import/no-extraneous-dependencies": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-unused-vars": "error",
    "unused-imports/no-unused-imports": "error",
    "prettier/prettier": [
      "warn",
      {
        "bracketSpacing": true,
        "printWidth": 140,
        "singleQuote": true,
        "trailingComma": "none",
        "tabWidth": 4,
        "useTabs": false,
        "endOfLine": "auto"
      }
    ]
  }
}
