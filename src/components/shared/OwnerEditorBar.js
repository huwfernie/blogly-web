import React from 'react';
import { Link } from 'react-router-dom';

// import '../../styles/editorBar.scss';

function OwnerEditorBar(props) {
  let { showEditorBar = false, blogId } = props;

  if (showEditorBar === true && blogId !== undefined) {
    return (
      <nav className="owner-editor-bar" data-testid="owner-edit-bar">
        <Link to={`/e/${blogId}`}><button>Edit</button></Link>
      </nav>
    );
  } else {
    return <nav data-testid="owner-edit-bar"></nav>
  }
}

export default OwnerEditorBar;
