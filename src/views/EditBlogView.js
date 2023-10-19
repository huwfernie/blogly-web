import { useEffect, useState } from 'react';
import { useRef } from "react";
import MainBar from '../components/shared/MainBar';
import Spinner from '../components/shared/spinner';
import Footer from '../components/shared/Footer';
import { useParams, useNavigate } from 'react-router-dom';

import '../styles/editBlogView.scss';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { getBlog, updateBlog, deleteBlog, sanitizeText, publishUnpublishBlog } from '../helpers/blogLambda';

function EditBlogView({ user, signOut }) {
  const [blog, setBlog] = useState({ published: false, title: "" });
  const [blogContent, setBlogContent] = useState('');
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  const userId = user.attributes.sub;
  // @TODO - if user id !=== author id then redirect to blog show page?
  
  let { id } = useParams();
  const quillElement = useRef();
  
  useEffect(() => {
    async function fetchData() {
      const data = await getBlog({ blogId: id, userId });
      if (data.success === true) {
        setBlog(data.body);
        setBlogContent(`<h1>${data.body.title}</h1>${data.body.body}`);
      }
      return;
    }
    fetchData();
  }, [id, userId]);

  // @TODO - prompt if you have changes and navigate away from the page

  function handleChange(content, delta, source, editor) {
    setBlogContent(content);
  }

  async function handlePublish() {
    setSpinner(true);
    const { title, body } = sanitizeText(blogContent);
    let data = {
      blogId: id,
      title: title,
      body: body,
      published: blog.published,
      authorId: userId
    }
    data = await publishUnpublishBlog(data);

    if (data.success === true) {
      setBlog(data.body);
    }
    setSpinner(false);
    return;
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
    return;
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
      <MainBar user={user} signOut={signOut} />
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
          <ReactQuill
            ref={quillElement}
            theme="snow"
            value={blogContent}
            onChange={handleChange}
            data-testid="test"
            modules={{  
              toolbar: {  
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'link', 'image'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['clean']
                ]
              }
            }}
          />
        </div>
        <Spinner show={spinner} />
      </section>
      <Footer />
    </div>
  );
}

export default EditBlogView;
