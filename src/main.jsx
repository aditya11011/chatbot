// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import  client  from './assets/apolloClient.js'
import App from './App';
import { nhost, createApolloClient } from './nhost';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </NhostProvider>
    </BrowserRouter>
  </React.StrictMode>
);
