import { useEffect, useState } from 'react';
import { useRef } from "react";
import MainBar from '../components/shared/MainBar';
import Spinner from '../components/shared/spinner';
import Footer from '../components/shared/Footer';
import { useParams, useNavigate } from 'react-router-dom';

import '../styles/editBlogView.scss';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getBlog, updateBlog, deleteBlog, sanitizeText } from '../helpers/blogLambda';

function EditBlogView({ user, signOut }) {
  const [blog, setBlog] = useState({});
  const [blogContent, setBlogContent] = useState('');
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const userId = user.attributes.sub;
  // if user id !=== author id then redirect to blog show page?
  
  let { id } = useParams();
  const quillElement = useRef();
  
  useEffect(() => {
    // console.log("userId : ", userId);
    async function fetchData() {
      const everything = await getBlog({ blogId: id });
      // console.log(everything);
      setBlog(everything);
      setBlogContent(`<h1>${everything.title}</h1>${everything.body}`);
      return;
    }
    fetchData();
  }, [id]);

  // @TODO - prompt if you have changes and navigate away from the page

  function handleChange(content, delta, source, editor) {
    setBlogContent(content);
  }

  function handlePublish() {
    const oldState = blog;
    if (blog.published === false) {
      var newState = { ...oldState, published: true, publishedDate: 'today' };
    } else {
      newState = { ...oldState, published: false, publishedDate: '' };
    }
    setBlog(newState);
  }

  async function handleSave() {
    setSpinner(true);
    const { title, body } = sanitizeText(blogContent);
    const data = {
      blogId: id,
      title: title,
      body: body,
      publishedDate: blog.publishedDate,
      published: blog.published,
      authorId: userId
    }
    await updateBlog(data)
    setSpinner(false);
    return data;
  }

  async function handleDelete() {
    setSpinner(true);
    await deleteBlog({ blogId: id });
    setSpinner(false);
    navigate('/u');
    return;
  }

  return (
    <div className="edit-blog-view view" data-testid="edit-blog-view">
      <MainBar signOut={signOut} />
      <nav className="editor-bar bar">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handlePublish}>
          <span className={`option ${blog.published === true ? 'active' : 'inactive'}`}>Public</span> -
          <span className={`option ${blog.published === false ? 'active' : 'inactive'}`}>Private</span>
        </button>
      </nav>
      <section className="main-section section">
        <div className="blog-content content">
          <ReactQuill ref={quillElement} theme="snow" value={blogContent} onChange={handleChange} data-testid="test" />
        </div>
        <Spinner show={spinner} />
      </section>
      <Footer />
    </div>
  );
}

export default EditBlogView;
