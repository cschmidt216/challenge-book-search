import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import the required Apollo modules
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// Create the Apollo Client instance
const client = new ApolloClient({
  uri: '/graphql', 
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap the App component with ApolloProvider */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);