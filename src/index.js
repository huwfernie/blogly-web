import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import IndexView from './views/IndexView';
import ShowBlogView from './views/ShowBlogView';
import EditBlogView from './views/EditBlogView';
import CreateBlogView from './views/CreateBlogView';
import UserView from './views/UserView';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";  

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexView />,
  },
  {
    path: "/b/:id",
    element: <ShowBlogView />,
  },
  {
    path: "/e/:id",
    element: <EditBlogView />,
  },
  {
    path: "/c",
    element: <CreateBlogView />,
  },
  {
    path: "/u/:id",
    element: <UserView />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
