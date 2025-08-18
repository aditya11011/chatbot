import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// 2. Create the link to your GraphQL server.
const httpLink = createHttpLink({
  // You provide YOUR specific server URL here.
  uri: 'https://fddrxlocitryedjlnsmi.hasura.ap-south-1.nhost.run/v1/graphql',
});

// 3. Create the client instance using the imported class.
const client = new ApolloClient({
  // Pass your specific configuration to the constructor.
  link: httpLink,
  cache: new InMemoryCache(),
});

// 4. Export your configured client so the rest of your app can use it.
export default client;