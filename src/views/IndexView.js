import { useEffect, useState } from 'react';
import '../styles/index.scss';
import { Link } from 'react-router-dom';
// import { getFiveRecentBlogs } from '../helpers/Index';

import { createBlog, deleteBlog, getBlog } from '../helpers/blogLambda';



function Index({ user, signOut }) {
  const [searchValue, setSearchValue] = useState("");
  const [blogList, setBlogList] = useState([]);
  if (user) {
    console.log(user);
  }

  useEffect(() => {
    async function fetchData() {
      // @TODO
      // const data = await getFiveRecentBlogs();
      const _data = [
        {
          id: "1eaadf37bd4e4f1097d122983daa56ca",
          title: "blog_1"
        },
        {
          id: "2eaadf37bd4e4f1097d122983daa56ca",
          title: "blog_2"
        },
        {
          id: "3eaadf37bd4e4f1097d122983daa56ca",
          title: "blog_3"
        },
        {
          id: "4eaadf37bd4e4f1097d122983daa56ca",
          title: "blog_4"
        },
        {
          id: "5eaadf37bd4e4f1097d122983daa56ca",
          title: "blog_5"
        }
      ]
      setBlogList(_data);
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
          <span><Link to="/login">Sign Up</Link></span> or 
          <span><Link to="/login">Sign In</Link></span>
        </nav>
      )
    } else {
      return (
        <nav className="index-bar bar">
          <span><Link to="/c">Create</Link></span> 
          <span onClick={signOut}>Sign Out</span>
          <div onClick={() => {createBlog({id: "1"})}}>Create</div>
          <div onClick={() => {deleteBlog({id: "1"})}}>Delete</div>
          <div onClick={() => {getBlog({id: "1"})}}>Get</div>
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
