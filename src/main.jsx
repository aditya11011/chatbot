// src/main.jsx
import React,{useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NhostProvider,useAccessToken } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import  client  from './assets/apolloClient.js'
import App from './App';
import { nhost, createApolloClient } from './nhost';
import './index.css';

const ApolloWrapper = ({ children }) => {
  const accessToken = useAccessToken();

  const apolloClient = useMemo(() => {
    return createApolloClient(accessToken);
  }, [accessToken]); // This dependency array ensures the client is recreated on login/logout

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <ApolloWrapper>
          <App />
        </ApolloWrapper>
      </NhostProvider>
    </BrowserRouter>
  </React.StrictMode>
);
