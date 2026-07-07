/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_BUILDER_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
