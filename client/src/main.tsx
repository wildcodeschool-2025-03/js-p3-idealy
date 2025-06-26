// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import AuthGuard from "./components/AuthGuard";
import Admin from "./pages/Admin";
import Apropos from "./pages/Apropos";
import Compte from "./pages/Compte";
import Contact from "./pages/Contact";
import Detail from "./pages/Detail";
import Forbidden from "./pages/Forbidden";
import Home from "./pages/Home";
import Information from "./pages/Information";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Parcourir from "./pages/Parcourir";
import Principal from "./pages/Principal";
import Soumettre from "./pages/Soumettre";

/* ************************************************************************* */

// Import the main app component
import App from "./App";

/* ************************************************************************* */

// Create router configuration with routes
// You can add more routes as you build out your app!
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Route libre
      {
        path: "/",
        element: <Home />,
      },

      // Routes protégées par AuthGuard
      {
        element: (
          <AuthGuard>
            <Admin />
          </AuthGuard>
        ),
        path: "/admin",
      },
      {
        element: (
          <AuthGuard>
            <Apropos />
          </AuthGuard>
        ),
        path: "/a-propos",
      },
      {
        element: (
          <AuthGuard>
            <Compte />
          </AuthGuard>
        ),
        path: "/compte",
      },
      {
        element: (
          <AuthGuard>
            <Contact />
          </AuthGuard>
        ),
        path: "/contact",
      },
      {
        element: (
          <AuthGuard>
            <Detail />
          </AuthGuard>
        ),
        path: "/detail/:id",
      },
      {
        element: (
          <AuthGuard>
            <Information />
          </AuthGuard>
        ),
        path: "/informations",
      },
      {
        element: (
          <AuthGuard>
            <Legal />
          </AuthGuard>
        ),
        path: "/legal",
      },
      {
        element: (
          <AuthGuard>
            <NotFound />
          </AuthGuard>
        ),
        path: "*",
      },
      {
        element: (
          <AuthGuard>
            <Parcourir />
          </AuthGuard>
        ),
        path: "/parcourir",
      },
      {
        element: (
          <AuthGuard>
            <Principal />
          </AuthGuard>
        ),
        path: "/principal",
      },
      {
        element: (
          <AuthGuard>
            <Soumettre />
          </AuthGuard>
        ),
        path: "/soumettre",
      },
      {
        element: (
          <AuthGuard>
            <Forbidden />
          </AuthGuard>
        ),
        path: "/forbidden",
      },
    ],
  },
]);

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
