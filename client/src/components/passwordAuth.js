
import React from 'react';

//password authentication lightbox
export default (props) => {
    const {
        cancel,
        invalidPass,
        submit,
        submitButtonText,
        elements,
    } = props;

    //prevents form submission and triggers parent component submit function
    function handleSubmit(event) {
        event.preventDefault();
        submit();
    }

    //removes password authentication lightbox
    function handleCancel(event) {
        event.preventDefault();
        cancel();
    }

    return(
        <div className="lightbox--outer">
            <div className="lightbox--inner">
                <div>
                    <h2 className="password--auth--heading">Please enter password to make changes</h2>
                    {invalidPass? (
                        <h2 className="password--error">Invalid password</h2>
                    ) : (
                        null
                    )}
                    <form onSubmit={handleSubmit}>
                        {elements()}
                        <div>
                            <button className="button" type="submit">{submitButtonText}</button>
                            <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

