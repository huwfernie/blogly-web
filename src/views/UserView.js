import { useState, useEffect } from 'react';
import MainBar from '../components/shared/MainBar';
import { Link } from 'react-router-dom';

import '../styles/userView.scss';

function UserView() {
  const [userData, setUserData] = useState({ blogs: null, user: null });

  useEffect(() => {
    async function fetchData() {
      const _data = {
        user: {
          id: "007df37bd4e4f1097d122983daa56ca",
          username: "A B Creely",
          joinedDate: "01/11/2011"
        },
        blogs: [
          {
            id: "1eaadf37bd4e4f1097d122983daa56ca",
            title: "blog_1",
            publishedDate: "10/11/2011",
            favorite: 21
          },
          {
            id: "2eaadf37bd4e4f1097d122983daa56ca",
            title: "blog_2",
            publishedDate: "11/11/2011",
            favorite: 12
          }
        ]
      }
      setUserData(_data);
      return;
    }
    fetchData();
  }, []);

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
                    <div><Link to={`/b/${blog.id}`}><h3 className='title'>{blog.title}</h3></Link></div>
                    <div>
                      <span>{blog.publishedDate}</span> 
                      <span><Link to={`/e/${blog.id}`}>Edit</Link></span>
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
          <div><span>ID : </span>{data.id}</div>
          <div><span>User Name : </span>{data.username}</div>
          <div><span>Joined Date : </span>{data.joinedDate}</div>
          <a href="/todo">Edit</a>
        </div>
      );
    } catch (error) {
      return <div className="user-data-wrapper">...loading data</div>
    };
  }

  return (
    <div className="user-view" data-testid="user-view">
      <MainBar />
      <section className="section">
        <div className="user-content content">
          <h1 className="headline">User Account Page</h1>
          <div className="grid">
            <BlogList data={userData.blogs} />
            <UserData data={userData.user} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserView;