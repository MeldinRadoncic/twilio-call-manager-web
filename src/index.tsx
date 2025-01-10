import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react'



const frontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

if (!frontendApi) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={frontendApi}>
      <App />
    </ClerkProvider>
    
  </React.StrictMode>
);
