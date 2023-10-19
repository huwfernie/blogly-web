import { useEffect, useState } from 'react';
import '../styles/index.scss';
import { Link } from 'react-router-dom';
import { getFiveBlogs } from '../helpers/blogLambda';

function Index({ user, signOut }) {
  const [searchValue, setSearchValue] = useState("");
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFiveBlogs();
      setBlogList(data);
      return;
    }
    fetchData();
  }, []);


  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  function handleSearch() {
    console.log("Seaching :: ", searchValue);
  }

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

  function IndexBar() {
    if (user === undefined) {
      return (
        <nav className="index-bar bar">
          <span><Link to="/login">Sign In</Link></span>
          or
          <span><Link to="/login">Sign Up</Link></span>
        </nav>
      )
    } else {
      return (
        <nav className="index-bar bar">
          <span><Link to="/c">Create</Link></span>
          <span onClick={signOut}><Link to="#">Sign Out</Link></span>
          <span><Link to="/u">My Account</Link></span>
        </nav>
      )
    }
  }

  return (
    <div className="index-view" data-testid="index-view">
      <IndexBar />
      <section className="section">
        <div className="content">
          <h1 className="headline">Welcome to Blogly</h1>
          <div className="grid">
            <div className="">
              <h2>Explore</h2>
              <form>
                <input type="text" role="searchbox" placeholder='Placeholder' value={searchValue} onChange={handleSearchChange}></input>
                <input type="submit" onClick={handleSearch} value="Search"></input>
              </form>
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
