import React from 'react';
import '../../styles/spinner.scss';

function Spinner({ show, value }) {
    value = value === "" ? 'loading' : value;
    if (show === true) {
        return (
            <div className="spinner-wrapper">
                <div className="spinner" data-testid="spinner">- {value} -</div>
            </div>
        );
    } else {
        return null;
    }
}

export default Spinner;