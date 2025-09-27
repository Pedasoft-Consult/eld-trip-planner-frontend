interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
