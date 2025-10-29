import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files
      include: '**/*.{jsx,js}',
    }),
    cssInjectedByJsPlugin(), // Inject CSS into JS for library build
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'ReactFormBuilder',
      formats: ['es', 'umd'],
      fileName: (format) => `app.${format}.js`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        // Preserve directory structure for CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'app.css'
          return assetInfo.name
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
    // Reduce bloat from legacy polyfills for modern browsers
    target: 'es2015',
  },

  server: {
    port: 8080,
    open: true,
  },

  // Enable JSX in .js files via esbuild
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  resolve: {
    alias: {
      // Stub jQuery as before
      jquery: resolve(__dirname, 'jquery-stub.js'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.json', '.scss', '.css'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['./node_modules'],
      },
    },
  },
})
