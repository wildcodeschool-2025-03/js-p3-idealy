import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={2000} />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
