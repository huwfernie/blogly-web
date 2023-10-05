import { useState, useEffect } from 'react';
import MainBar from '../components/shared/MainBar';
import { Link } from 'react-router-dom';
import { getBlogsByAuthor } from '../helpers/blogLambda';

import '../styles/userView.scss';

function UserView({user, signOut}) {
  // console.log(user);
  const [blogData, setBlogData] = useState([]);
  const authorId = user.attributes.sub || "7642d2b4-1081-70ce-f9cd-54f2636a48ad";
  
  useEffect(() => {
    async function fetchBlogData() {
      const data = await getBlogsByAuthor({ authorId });
      setBlogData(data);
    }
    fetchBlogData();
  }, [authorId]);

  function BlogList({ data }) {
    if (data === null) {
      return <div className="blog-list-wrapper">...loading data</div>;
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
                      <span>{blog.publishedDate}</span> 
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
    try {
      return (
        <div className="user-data-wrapper">
          <h2>Account settings</h2>
          <div><span>ID : </span>{data.attributes.sub}</div>
          <div><span>User Name : </span>{data.attributes.name}</div>
          <div><span>Registered Email : </span>{data.attributes.email}</div>
        </div>
      );
    } catch (error) {
      return <div className="user-data-wrapper">...loading data</div>
    };
  }

  return (
    <div className="user-view" data-testid="user-view">
      <MainBar signOut={signOut} />
      <section className="section">
        <div className="user-content content">
          <h1 className="headline">User Account Page</h1>
          <div className="grid">
            <BlogList data={blogData} />
            <UserData data={user} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserView;
