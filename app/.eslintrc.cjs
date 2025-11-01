/* eslint-env node */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    // 直接 process.env を参照せず、config/env.ts の型付きenvを使う
    "no-restricted-properties": [
      "error",
      {
        object: "process",
        property: "env",
        message: "環境変数は config/env.ts から参照してください",
      },
    ],
  },
  overrides: [
    {
      files: ["config/env.ts", "scripts/check-env.js"],
      rules: {
        "no-restricted-properties": "off",
      },
    },
  ],
};
