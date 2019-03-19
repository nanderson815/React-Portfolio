import React from 'react';

const skills = (props) => {
   
    return (
        <div className="col m4">
            <div className="center promo promo-example">
                <i className={props.style}>{props.icon}</i>
                <h4 className="promo-caption">{props.title}</h4>
                <p className="light center">{props.desc}</p>
            </div>
        </div>
    )
}

export default skills;