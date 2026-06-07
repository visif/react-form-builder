import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'import.meta.env.VITE_FORM_BUILDER_VERSION': JSON.stringify(
      process.env.npm_package_version || '0.0.1'
    ),
  },
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'),
      name: 'ReactFormBuilder',
      formats: ['es', 'umd'],
      fileName: (format) => `app.${format}.js`,
    },
    outDir: 'dist',
    cssFileName: 'app',
    rollupOptions: {
      // Externalize React so the consumer's React is used
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
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
