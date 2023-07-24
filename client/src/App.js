import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient.js'; // Import useApolloClient
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

function App() {
  const client = useApolloClient(); // Access Apollo Client instance here

  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;