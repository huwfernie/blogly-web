import { useEffect, useState, useRef } from 'react';
import MainBar from '../components/shared/MainBar';
import OwnerEditorBar from '../components/shared/OwnerEditorBar';
import Footer from '../components/shared/Footer';
import '../styles/showBlogView.scss';
import { useParams } from 'react-router-dom';
// import { useAuthenticator } from '@aws-amplify/ui-react';

function BlogShowView({user, signOut}) {
  const { id } = useParams();
  // const { user } = useAuthenticator((context) => [context.user]);
  // console.log(user);
  // if user.id === author.id then render editor bar

  const initialBlog = {
    id: "",
    title: "",
    textContent: "",
    publishedDate: "",
    published: false,
    author: ""
  }
  const [blog, setBlog] = useState(initialBlog);
  const reef = useRef();

  useEffect(() => {
    async function fetchData(id) {
      // const data = await getFiveRecentBlogs();
      const _data = {
        id: "1eaadf37bd4e4f1097d122983daa56ca",
        title: "Blog 1 Heading",
        textContent: "<p>this is some text</p><p>this is a quote</p><h2>This is another heading</h2><p><br></p><p>End</p>",
        publishedDate: "10/11/12",
        published: false,
        author: "A B Creely"
      }
      setBlog(_data);
      return;
    }
    fetchData(id);
  }, [id]);

  useEffect(() => {
    if (reef.current !== undefined) {
      reef.current.innerHTML = blog.textContent;
    }
  }, [blog]);

  try {
    return (
      <div className="show-blog-view view" data-testid="showBlogView">
      <MainBar signOut={signOut} />
        <OwnerEditorBar owner={true} blogId={blog.id} />
        <section className="main-section section">
          <div className="blog-content content">
            <h1 className="headline">{blog.title}</h1>
            <p className="blog-info">By : <span>{blog.author}</span>, published on <span>{blog.publishedDate}</span></p>
            <div ref={reef}></div>
          </div>
        </section>
        <Footer />
      </div>
    );
  } catch (error) {
    return null;
  }
}

export default BlogShowView;
