import { useEffect, useState } from 'react';
import { useRef } from "react";
import MainBar from '../components/shared/MainBar';
import Spinner from '../components/shared/spinner';
import Footer from '../components/shared/Footer';

import '../styles/editBlogView.scss';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditBlogView() {
  const [blog, setBlog] = useState({});
  const [blogContent, setBlogContent] = useState('');
  const [spinner, setSpinner] = useState(false);

  const quillElement = useRef();

  useEffect(() => {

    async function fetchData() {
      const _data = {
        id: "1eaadf37bd4e4f1097d122983daa56ca",
        title: "Blog 1 Heading",
        textContent: "<p>this is some text</p><p>this is a quote</p><h2>This is another heading</h2><p><br></p><p>End</p>",
        publishedDate: "",
        published: false,
        author: "A B Creely"
      }
      setBlog(_data);
      setBlogContent(`<h1>${_data.title}</h1>${_data.textContent}`);
      return;
    }
    fetchData();
  }, []);

  // @TODO - prompt if you have changes and navigate away from the page

  function sanitizeText(content) {
    // heading should always be an H1
    content = content.replace(/<(.*?)>(.*?)<(.*?)>/, '<h1>$2</h1>');
    // title is the contents of the H1
    const title = content.replace(/<h1>(.*?)<\/h1>(.*)/, '$1');
    // body is everything after the h1
    const body = content.replace(/(.*?)<\/h1>/, '');
    // console.log("Title = ", title);
    // console.log("Body = ", body);
    return { title, body };
  }

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

  function handleSave() {
    setSpinner(true);
    const { title, body } = sanitizeText(blogContent);
    const data = {
      id: blog.id,
      title: title,
      textContent: body,
      publishedDate: blog.publishedDate,
      published: blog.published,
      author: blog.author
    }
    setTimeout(() => {
      setSpinner(false);
    }, 1000);
    return data;
  }

  return (
    <div className="edit-blog-view view" data-testid="edit-blog-view">
      <MainBar />
      <nav className="editor-bar bar">
        <button onClick={handleSave}>Save</button>
        <button>Delete</button>
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