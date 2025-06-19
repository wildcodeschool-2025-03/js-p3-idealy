import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
