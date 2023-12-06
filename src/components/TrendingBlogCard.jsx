import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase";
import style from '../styles/trendingBlogcard.module.css';
import {useNavigate} from 'react-router-dom';

const TrendingBlogCard = (props) => {
  const [url, setUrl] = useState("");
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    firebase
      .getImgURL(props.imageURL)
      .then((url) => setUrl(url))
      .catch((error) => console.log("Error in fetching image URL"));
  }, [props.imageURL, firebase]);

  return (
    <div className={style.trendingCard+" card"}>
      <img src={url} className="card-img" alt="thumbnail-img" />
      <div className={style.trendingCardOverlay + " card-img-overlay"}>
        <h4 className="card-title">{props.title}</h4>
        <button className={style.readBtn} onClick={()=>navigate(`blog/${props.blogId}`)}>Read</button>
      </div>
    </div>
  );
};

export default TrendingBlogCard;
