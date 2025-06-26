import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
