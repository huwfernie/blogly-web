import { useState } from 'react';
import MainBar from '../components/shared/MainBar';
import OwnerEditorBar from '../components/shared/OwnerEditorBar';

import '../styles/createBlogView.scss';

function CreateBlogView({signOut}) {
  const [title, setTitle] = useState("");

  // function handleClose() {
  //   setTitle("");
  // }

  function handleCreate(event) {
    event.preventDefault();
    if (title !== "") {
      console.log("New Blog Coming Up :: ", title);
    }
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
