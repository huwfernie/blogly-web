import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import IndexView from './views/IndexView';
import ShowBlogView from './views/ShowBlogView';
import EditBlogView from './views/EditBlogView';
import CreateBlogView from './views/CreateBlogView';
import UserView from './views/UserView';
import LoginView from './views/LoginView';
// import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

// import { withAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import { RequireAuth } from './components/RequireAuth';
import { BypassAuth } from './components/BypassAuth';




import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

Amplify.configure(awsExports);

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <BypassAuth>
        <IndexView />
      </BypassAuth>,
  },
  {
    path: "/b/:id",
    element: <ShowBlogView />,
  },
  {
    path: "/e/:id",
    element:
      <RequireAuth>
        <EditBlogView />
      </RequireAuth>
  },
  {
    path: "/c",
    element:
      <RequireAuth>
        <CreateBlogView />
      </RequireAuth>
  },
  {
    path: "/u/",
    element:
      <RequireAuth>
        <UserView />
      </RequireAuth>
  },
  {
    path: "/login",
    element: <LoginView />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Authenticator.Provider>
    <RouterProvider router={router} />
  </Authenticator.Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
