import React from 'react';
import { Link } from 'react-router-dom';

function OwnerEditorBar(props) {
  let { showEditorBar = false, blogId } = props;

  if (showEditorBar === true && blogId !== undefined) {
    return (
      <nav className="owner-editor-bar bar" data-testid="owner-edit-bar">
        <span><Link to={`/e/${blogId}`}>Edit</Link></span>
      </nav>
    );
  } else {
    return <nav data-testid="owner-edit-bar"></nav>
  }
}

export default OwnerEditorBar;
