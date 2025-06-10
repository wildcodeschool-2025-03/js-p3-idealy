import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
