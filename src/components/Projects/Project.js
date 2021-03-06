import React from "react";
import styles from "./Projects.module.css";

const project = (props) => {
  return (
    <div className={styles.project}>
      <div className="row ">
        <div className="col s12 m5">
          <h4>{props.title}</h4>
          <h6>{props.tech}</h6>
          <p>{props.desc}</p>
          <a
            href={props.github}
            className={[
              styles.button,
              "waves-effect waves-light btn blue darken-4",
            ].join(" ")}
          >
            Github
          </a>
          <a
            href={props.demo}
            className={[
              styles.button,
              "waves-effect waves-light btn blue darken-4",
            ].join(" ")}
          >
            Demo
          </a>
        </div>
        <div className="col s12 m7">
          <img
            className={styles.portfolioImg}
            alt="Portfolio screenshot"
            src={props.img}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default project;
