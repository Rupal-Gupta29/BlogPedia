import React, { useEffect, useState } from "react";
import style from "../styles/cardblog.module.css";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CardBlog = (props) => {
  const [url, setUrl] = useState("");
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    firebase
      .getImgURL(props.imageURL)
      .then((url) => setUrl(url))
      .catch((error) => console.log("Error in fetching image URL"));
  }, [props.imageURL, firebase]);

  const handleDelete = () => {
    let ans = window.confirm("Are you sure you wan to delete this blog?");
    if(ans){
      firebase
      .deleteDocById(props.blogId)
      .then(() => {
        toast.success("Blog Deleted Successfully!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Error in deleting blog", {
          position: "bottom-center",
          autoClose: 3000,
        });
      });
    }
  };

  const handleEdit = () => {
    navigate("/createblog", {
      state: {
        blogId:props.blogId,
        title: props.title,
        isTrending: props.isTrending,
        category: props.category,
        desc:props.desc,
        tags:props.tags,
        imageURL:props.imageURL
      },
    });
  };

  return (
    <div className="row p-2">
      <div className="col-md-4">
        <img className="card-img" src={url} alt="img-thumbnail" />
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <div className={style.categoryWrapper}>
            <span className={style.category}>{props.category}</span>
          </div>
          <h5 className="card-title mt-2">{props.title}</h5>
          <p>
            {props.authorName} - {props.createdAt}
          </p>
          <p className={style.cardPreviewText + " scard-text"}>{props.desc}</p>
          <div className={style.btnWrapper}>
            <button
              className={style.readBtn}
              onClick={() => navigate(`blog/${props.blogId}`)}
            >
              Read More
            </button>
            {firebase.user.email === props.authorEmail && (
              <div>
                <FaTrashCan className={style.icon} onClick={handleDelete} />
                <FaEdit className={style.icon} onClick={handleEdit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBlog;
