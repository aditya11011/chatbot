// src/nhost.js
import { NhostClient } from '@nhost/nextjs';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// 1. Initialize Nhost Client (Corrected)
export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
});

// 2. Create Apollo Client
export const createApolloClient = (accessToken) => {
  const httpLink = new HttpLink({
    uri: nhost.graphql.getUrl(),
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: nhost.graphql.getWsUrl(),
      connectionParams: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};