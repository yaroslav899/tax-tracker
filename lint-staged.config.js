module.exports = {
  'apps/web/src/**/*.{ts,tsx}': () =>
    'bash -c "cd apps/web && npx eslint src --fix --max-warnings=0"',
  'apps/api/src/**/*.ts': () =>
    'bash -c "cd apps/api && npx eslint src --fix --max-warnings=0"',
}
