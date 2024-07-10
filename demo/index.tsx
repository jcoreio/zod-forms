import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

const App = React.lazy(() => import('./App'))

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </React.StrictMode>
  )
}
