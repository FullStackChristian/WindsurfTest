// App.tsx
import Home from "./components/Home";
import Contact from "./components/Contact";
import Resources from "./components/Resources";
import Product from "./components/Product";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/contact" Component={Contact} />
        <Route path="/resources" Component={Resources} />
        <Route path="/product" Component={Product} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
