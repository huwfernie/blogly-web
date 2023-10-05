import { useEffect, useState, useRef } from 'react';
import * as DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';

import MainBar from '../components/shared/MainBar';
import OwnerEditorBar from '../components/shared/OwnerEditorBar';
import Footer from '../components/shared/Footer';

import { getBlog } from '../helpers/blogLambda';

import '../styles/showBlogView.scss';

function BlogShowView({ user, signOut }) {
  const { blogId } = useParams();

  const initialBlog = {
    blogId: "",
    userId: "",
    title: "",
    author: "",
    body: "",
    publishedDate: "",
    published: false,
    authorId: ""
  };

  const blogElement = useRef();
  const [blog, setBlog] = useState(initialBlog);
  const [showEditorBar, setShowEditorBar] = useState(false);

  useEffect(() => {
    async function init() {
      const blog = await getBlog({ blogId });
      if (blog !== null) {
        setBlog(blog);
      }
    }
    init();
  }, [blogId]);

  useEffect(() => {
    try {
      if (blog.authorId === user.id) {
        setShowEditorBar(true);
      }
    } catch (error) {
      // null
    }
  }, [blog, user]);

  useEffect(() => {
    if (blogElement.current !== undefined) {
      blogElement.current.innerHTML = DOMPurify.sanitize(blog.body);
    }
  }, [blog]);

  try {
    return (
      <div className="show-blog-view view" data-testid="showBlogView">
        <MainBar signOut={signOut} />
        <OwnerEditorBar showEditorBar={showEditorBar} blogId={blogId} />
        <section className="main-section section">
          <div className="blog-content content">
            <h1 className="headline">{blog.title}</h1>
            <p className="blog-info">By : <span>{blog.author}</span>, published on <span>{blog.publishedDate}</span></p>
            <div ref={blogElement}></div>
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
