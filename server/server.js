const React = require("react");
const { BrowserRouter: Router, Routes, Route } = require("react-router-dom");
const SearchBooks = require("./pages/SearchBooks");
const SavedBooks = require("./pages/SavedBooks");
const Navbar = require("./components/Navbar");
const { ApolloProvider } = require("@apollo/react-hooks");
const ApolloClient = require("apollo-boost");

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;