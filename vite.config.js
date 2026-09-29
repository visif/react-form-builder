import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  define: {
    'import.meta.env.VITE_FORM_BUILDER_VERSION': JSON.stringify(
      process.env.npm_package_version || '0.0.1'
    ),
    'import.meta.env.VITE_LOCAL_BUILD': JSON.stringify(
      process.env.VITE_LOCAL_BUILD === 'true' ? 'true' : 'false'
    ),
  },
  plugins: [
    react(),
    dts({
      include: [
        'src/index.tsx',
        'src/types/**/*.ts',
        'src/constants/**/*.ts',
        'src/utils/**/*.ts',
        'src/hooks/**/*.ts',
        'src/contexts/**/*.tsx',
        'src/import/**/*.ts',
        'src/components/builder/Import/*.tsx',
        'src/components/builder/Toolbar/toolbarItems.d.ts',
        'src/components/builder/ReactFormBuilder.tsx',
        'src/components/generator/ReactFormGenerator.tsx',
        'src/components/generator/utils/formHelpers.ts',
        'src/components/generator/hooks/useFormDataCollection.ts',
        'src/components/generator/hooks/useFormValidation.ts',
      ],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'ReactFormBuilder',
      formats: ['es', 'umd'],
      fileName: (format) => `app.${format}.js`,
      cssFileName: 'app',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      // The document parsers used by "Import from file" (pdfjs-dist, mammoth,
      // xlsx, tesseract.js) are loaded with dynamic import() so they become
      // separate ES chunks fetched only when a file is imported. Allowing the
      // entry signature to be extended keeps app.es.js as the real entry
      // (no facade) while those chunks share CommonJS helpers with it.
      preserveEntrySignatures: 'allow-extension',
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react/jsx-dev-runtime': 'ReactJSXDEVRuntime',
        },
      },
    },
    target: 'es2015',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})
