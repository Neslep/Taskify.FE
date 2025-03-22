import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from 'src/contexts/AuthContext';

import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
