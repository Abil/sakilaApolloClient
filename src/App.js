import "./App.css";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.js";
//import Actor from "./pages/Actor.js";
import Film from "./pages/Film.js";
//import FilmActor from "./pages/FilmActor.js";

import Menu from "./components/nav/Menu.js";

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: "http://localhost:4000", // Update with your GraphQL server URL
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Menu />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/film" element={<Film />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
