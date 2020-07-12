import React from 'react';

export default (props) => {

    return(
        <div className="bounds">
            <h1>Error</h1>
            <p>Sorry! We just encountered an unexpected error.</p>
            <p>{props.error}</p>
        </div>
    );
}