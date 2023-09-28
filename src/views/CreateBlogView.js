import { useState } from 'react';
import MainBar from '../components/shared/MainBar';
import OwnerEditorBar from '../components/shared/OwnerEditorBar';
import { createBlog } from '../helpers/blogLambda';
// // @TODO
// import { createBlog as updateBlogDatabase } from '../helpers/blogDatabase';
import '../styles/createBlogView.scss';
// import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function CreateBlogView({user, signOut}) {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  async function handleCreate(event) {
    event.preventDefault();
    let uuid = crypto.randomUUID();
    const _title = title === "" ? "Blog Title" : title;

    
    console.log(`New Blog Coming Up :: ${_title} :: ${uuid}`);
    const data = {
      id: uuid,
      title: _title,
      publishedDate: "",
      published: false,
      authorId: user.attributes.sub
    }

    const response = await createBlog(data);
    console.log(response);
    navigate(`/e/${uuid}`);
  }

  return (
    <div className="create-blog-view view">
      <MainBar signOut={signOut} />
      <OwnerEditorBar />
      <section className="main-section section">
        <div className="blog-content content">
          <h1 className="headline">What's the title for your new blog?</h1>
          <form id="new-blog-form" data-testid="new-blog-form">
            <input
              className='headline input'
              type="text"
              placeholder="title"
              value={title}
              onChange={(ev) => { setTitle(ev.target.value) }}
            ></input>
            <button onClick={(event) => { handleCreate(event) }}>OK</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CreateBlogView;
