import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: (id) =>
        /^react(?:-dom)?(?:\/|$)/.test(id) ||
        id.startsWith('@radix-ui/') ||
        id === 'react-day-picker',
      // One file per module so consumers drop unused components (and their runtimes).
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
});
