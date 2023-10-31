import { useState } from 'react';
import MainBar from '../components/shared/MainBar';
import OwnerEditorBar from '../components/shared/OwnerEditorBar';
import { createBlog } from '../helpers/blogLambda';
import '../styles/createBlogView.scss';
import { useNavigate } from "react-router-dom";


function CreateBlogView({ user, signOut }) {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  async function handleCreate(event) {
    event.preventDefault();
    const _title = title === "" ? "Blog Title" : title;
    const authorId = user.attributes.sub;

    // console.log(`New Blog Coming Up :: ${_title} :: ${authorId}`);
    const data = {
      title: _title,
      authorId
    }

    const apiCall = await createBlog(data);
    if (apiCall.success === true) {
      navigate(`/e/${apiCall.response.blogId}`);
    }
  }

  return (
    <div className="create-blog-view view" data-testid="create-blog-view">
      <MainBar user={user} signOut={signOut} />
      <OwnerEditorBar />
      <section className="main-section section">
        <div className="blog-content content">
          <h1 className="headline">What's the title for your new blog?</h1>
          <form id="new-blog-form">
            <input
              className='headline input'
              type="text"
              placeholder="title"
              value={title}
              onChange={(ev) => { setTitle(ev.target.value) }}
              data-testid="create-title-input"
            ></input>
            <button onClick={(event) => { handleCreate(event) }}>OK</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CreateBlogView;
