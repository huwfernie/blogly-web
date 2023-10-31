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
  const [blog, setBlog] = useState({ published: false, title: '' });
  const [blogContent, setBlogContent] = useState('');
  const [spinner, setSpinner] = useState({ show: false, value: '' });
  const navigate = useNavigate();

  const userId = user.attributes.sub;
  // @TODO - if user id !=== author id then redirect to blog show page?

  let { id } = useParams();
  const quillElement = useRef();

  useEffect(() => {
    async function fetchData() {
      const apiCall = await getBlog({ blogId: id, userId });
      if (apiCall.success === true) {
        setBlog(apiCall.response);
        setBlogContent(`<h1>${apiCall.response.title}</h1>${apiCall.response.body}`);
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
    setSpinner({ show: true, value: 'publishing' });
    const { title, body } = sanitizeText(blogContent);
    let data = {
      blogId: id,
      title: title,
      body: body,
      published: blog.published,
      authorId: userId
    }
    const apiCall = await publishUnpublishBlog(data);

    if (apiCall.success === true) {
      setBlog(apiCall.response);
    }
    setSpinner({ show: false, value: '' });
    return;
  }

  async function handleSave() {
    setSpinner({ show: true, value: 'saving' });
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
    setSpinner({ show: false, value: '' });
    return;
  }

  async function handleDelete() {
    setSpinner({ show: true, value: 'deleting' });
    await deleteBlog({ blogId: id });
    setSpinner({ show: false, value: '' });
    navigate('/u');
    return;
  }

  return (
    <div className="edit-blog-view view" data-testid="edit-blog-view">
      <MainBar user={user} signOut={signOut} />
      <section className="main-section section">
        <div className="blog-content content">
          <ReactQuill
            ref={quillElement}
            theme="snow"
            value={blogContent}
            onChange={handleChange}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [2, 3, false] }],
                  ['bold', 'italic', 'underline', 'link', 'image'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['clean']
                ]
              },
              clipboard: {
                matchVisual: false
              }
            }}
          />
        </div>
        <aside className="side-content">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handlePublish} data-testid="publish-button">
            <span className={`option ${blog.published === true ? 'active' : 'inactive'}`}>Public</span> -
            <span className={`option ${blog.published === false ? 'active' : 'inactive'}`}>Private</span>
          </button>
        </aside>
      </section>
      <Footer />
      <Spinner show={spinner.show} value={spinner.value} />
    </div>
  );
}

export default EditBlogView;
