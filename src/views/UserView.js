import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import MainBar from '../components/shared/MainBar';
import { Link } from 'react-router-dom';
import { getBlogsByAuthor } from '../helpers/blogLambda';

import '../styles/userView.scss';
import Footer from '../components/shared/Footer';

function UserView({ user, signOut }) {
  // console.log(user);
  const [blogData, setBlogData] = useState([]);
  const authorId = user.attributes.sub || "7642d2b4-1081-70ce-f9cd-54f2636a48ad";

  useEffect(() => {
    async function fetchBlogData() {
      const apiCall = await getBlogsByAuthor({ authorId });
      console.log(apiCall);
      if (apiCall.success === true) {
        setBlogData(apiCall.response);
      }
    }
    fetchBlogData();
  }, [authorId]);

  function BlogList({ data }) {
    if (data.length === 0) {
      return (
        <div className="blog-list-wrapper">
          <h2>Your Blogs</h2>
          <div className="blog-list-wrapper">...loading blogs</div>
        </div>
      );
    } else {
      return (
        <div className="blog-list-wrapper">
          <h2>Your Blogs</h2>
          <ol className="list">
            {
              data.map((blog, index) => {
                return (
                  <li className="blog" key={index}>
                    <div><Link to={`/b/${blog.blogId}`}><h3 className='title'>{blog.title}</h3></Link></div>
                    <div>
                      {blog.published === true && <span>{blog.publishedDate}</span>}
                      {blog.published === false && <span>Not Public</span>}
                      <span><Link to={`/e/${blog.blogId}`}>Edit</Link></span>
                    </div>
                  </li>
                )
              })
            }
          </ol>
        </div>
      )
    }
  }

  function UserData({ data }) {
    async function updateUserAttributes({ name }) {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(user, {
          name: name
        });
      } catch (err) {
        // console.log(err);
      }
    };

    function handleUpdateUser() {
      const name = prompt('What is your new name', data.attributes.name);
      if (name !== data.attributes.name && name !== "" && name !== undefined) {
        updateUserAttributes({ name })
      }
    }

    try {
      return (
        <div className="user-data-wrapper">
          <h2>Account settings</h2>
          <div><span>ID : </span>{data.attributes.sub}</div>
          <div><span>User Name : </span>{data.attributes.name} <button onClick={handleUpdateUser}>Edit</button></div>
          <div><span>Registered Email : </span>{data.attributes.email}</div>
        </div>
      );
    } catch (error) {
      return <div className="user-data-wrapper">...loading account settings</div>
    };
  }

  return (
    <div className="user-view view" data-testid="user-view">
      <MainBar user={user} signOut={signOut} />
      <section className="section">
        <div className="user-content content">
          <h1 className="headline">User Account Page</h1>
          <div className="grid">
            <BlogList data={blogData} />
            <UserData data={user} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default UserView;
