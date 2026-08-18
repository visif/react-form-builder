import React from 'react'

import FORM_BUILDER_VERSION from '../../constants/version'
import IS_LOCAL_BUILD from '../../constants/localBuild'

/**
 * Fixed notice shown only when the package was built with VITE_LOCAL_BUILD=true
 * (`yarn build:local` / `yarn link:local`). Publish builds never include this.
 */
const LocalBuildBanner = () => {
  if (!IS_LOCAL_BUILD) {
    return null
  }

  return (
    <div
      aria-label="Using local form-builder build"
      data-dev-local-form-builder
      className="rfb-local-build-banner"
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 10000,
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: 11,
        fontFamily: 'ui-monospace, Menlo, monospace',
        color: '#fff',
        backgroundColor: '#b45309',
        pointerEvents: 'none',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      local @visif/form-builder · v{FORM_BUILDER_VERSION}
    </div>
  )
}

export default LocalBuildBanner
