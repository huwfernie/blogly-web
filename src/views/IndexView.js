import { useEffect, useState } from 'react';
import '../styles/index.scss';
import IndexBar from '../components/shared/IndexBar';
import { getFiveBlogs } from '../helpers/blogLambda';
import SearchBar from '../components/shared/SearchBar';

function Index({ user, signOut }) {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const apiCall = await getFiveBlogs();
      if (apiCall.success === true) {
        setBlogList(apiCall.response);
      }
      return;
    }
    fetchData();
  }, []);

  function BlogList() {
    return (
      <ul>
        {
          blogList.map((el, index) => {
            return (
              <li key={index}><a href={`/b/${el.id}`}>{el.title}</a></li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <div className="index-view" data-testid="index-view">
      <IndexBar user={user} signOut={signOut} />
      <section className="section">
        <div className="content">
          <h1 className="headline">Welcome to Blogly</h1>
          <div className="grid">
            <div className="">
              <h2>Explore</h2>
              <SearchBar initialValue="" placeholder="Search Here" />
            </div>
            <div className="">
              <h2>Recently published</h2>
              <BlogList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Index;
