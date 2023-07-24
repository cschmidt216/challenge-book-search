import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// Create an ApolloClient instance
const client = new ApolloClient({
  uri: 'https://serene-dusk-48581-595086ab6dc3.herokuapp.com/graphql', 
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap the App component with ApolloProvider and pass the client as a prop */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);