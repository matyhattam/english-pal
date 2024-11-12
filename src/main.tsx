import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from './routes/error-page.tsx';
import LoginPage from './routes/login-page.tsx';
import Wrapper from './wrapper.tsx';
import App from './App.tsx';
import SignupPage from './routes/signup-page.tsx';

const router = createBrowserRouter([

  {
    path: "/",
    element: <Wrapper />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
