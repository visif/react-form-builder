/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_BUILDER_VERSION?: string
  readonly VITE_LOCAL_BUILD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
