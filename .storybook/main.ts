import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Scoped to shared blocks and feature components only (see project_spec.md).
  stories: [
    "../src/blocks/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/blocks/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.mdx"
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/react-vite"
};
export default config;