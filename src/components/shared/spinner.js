import React from 'react';
import '../../styles/spinner.scss';

function Spinner({show}) {
    if (show === true) {
        return (
            <div className="spinner-wrapper">
                <div className="spinner" data-testid="spinner">- Loading -</div>
            </div>
        );
    } else {
        return null;
    }
}

export default Spinner;