// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import Admin from "./pages/Admin";
import Apropos from "./pages/Apropos";
import Compte from "./pages/Compte";
import Contact from "./pages/Contact";
import Detail from "./pages/Detail";
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
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/a-propos",
        element: <Apropos />,
      },
      {
        path: "/compte",
        element: <Compte />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/detail/:id", // Dynamic route for details page admin
        element: <Detail />,
      },
      {
        path: "/informations",
        element: <Information />,
      },
      {
        path: "/legal",
        element: <Legal />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/parcourir",
        element: <Parcourir />,
      },
      {
        path: "/principal",
        element: <Principal />,
      },
      {
        path: "/soumettre",
        element: <Soumettre />,
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
