import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import loadingGif from "../Assets/loading.gif";
import style from "../styles/blogDetailed.module.css";
import Navbar from "../components/Navbar";

const BlogDetailed = () => {
  const [blogDetails, setBlogDetails] = useState();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .getBlogById(params.blogId)
      .then((result) => {
        setBlogDetails(result.data());
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [firebase, params.blogId]);

  useEffect(() => {
    if (blogDetails) {
      firebase
        .getImgURL(blogDetails.imageURL)
        .then((url) => setUrl(url))
        .catch((error) => console.log("Error in fetching image URL"));
    }
  }, [blogDetails, firebase]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="errorContainer">
          <img src={loadingGif} width={100} alt="loading" />
        </div>
      ) : (
        <div className={style.blogDetailedContainer}>
          <div className={style.headerImgWrapper}>
            <img src={url} alt="img-thumbnail" className={style.headerImg} />
          </div>
          <small>{blogDetails.category}</small>
          <h2>{blogDetails.title}</h2>
          <small>{blogDetails.createdAt}</small>
          <p>{blogDetails.desc}</p>
          <span>By {blogDetails.authorName}</span>
          <div className={style.tagsWrapper}>
            {blogDetails.tags &&
              blogDetails.tags.map((tag) => (
                <div
                  className={style.tag}
                  key={tag}
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BlogDetailed;
