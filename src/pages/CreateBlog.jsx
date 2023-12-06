import React, { useState } from "react";
import style from "../styles/createblog.module.css";
import { IoMdCloseCircle } from "react-icons/io";
import { useFirebase } from "../context/firebase";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateBlog = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState(
    location.state ? location.state.title : ""
  );
  const [isTrending, setIsTrending] = useState(
    location.state ? location.state.isTrending : "no"
  );
  const [category, setCategory] = useState(
    location.state ? location.state.category : "Finance"
  );
  const [desc, setDesc] = useState(location.state ? location.state.desc : "");
  const [tags, setTags] = useState(location.state ? location.state.tags : []);
  const [thumbnail, setThumbnail] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTag = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      setTags([...tags, e.target.value.toLowerCase()]);
      e.target.value = "";
    }
  };

  const handleRemoveTag = (tagName) => {
    const newTagList = tags.filter((tag) => tag !== tagName);
    setTags(newTagList);
  };

  const handleSubmit = () => {
    if (location.state) {
      if (title && isTrending && category && desc && tags) {
        let updatedData = {
          title: title,
          isTrending: isTrending,
          category: category,
          desc: desc,
          tags: tags,
          thumbnail: thumbnail,
          imageURL: location.state.imageURL,
        };
        firebase
          .editDoc(location.state.blogId, updatedData)
          .then(() => {
            toast.success("Blog updated successfully!", {
              position: "bottom-center",
              autoClose: 3000,
            });
            navigate("/home");
          })
          .catch((error) => console.log("Error in updating blog", error));
      } else {
        setErrorMsg("All the fields must be filled!");
      }
    } else {
      if (title && isTrending && category && desc && tags && thumbnail) {
        firebase
          .addNewBlog(title, isTrending, category, desc, tags, thumbnail)
          .then((result) => {
            setTitle("");
            setIsTrending("no");
            setCategory("Finance");
            setDesc("");
            setTags([]);
            setThumbnail(null);
            toast.success("Blog added successfully!", {
              position: "bottom-center",
              autoClose: 3000,
            });
            navigate("/home");
          })
          .catch((error) => console.log("error in adding blog", error));
      } else {
        setErrorMsg("All the fields must be filled!");
      }
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsTrending("no");
    setCategory("Finance");
    setDesc("");
    setTags([]);
    setThumbnail(null);
    navigate("/home");
  };

  return (
    <>
      <Navbar />
      <div className={style.createblogContainer}>
        <h4>Create Your Blog</h4>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          Is it trending blog?{" "}
          <input
            type="radio"
            name="trending"
            value={isTrending}
            checked={isTrending === "yes" ? true : false}
            onChange={() => setIsTrending("yes")}
          />{" "}
          Yes{" "}
          <input
            type="radio"
            name="trending"
            value={isTrending}
            checked={isTrending === "no" ? true : false}
            onChange={() => setIsTrending("no")}
          />{" "}
          No
        </div>
        <div className="form-group mt-3">
          <label htmlFor="category" className="form-label text-muted">
            Category
          </label>
          <select
            className="w-100 p-1 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="category"
          >
            <option value="Finance">Finance</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>
        <div className="form-group mt-3">
          <textarea
            className="form-control"
            rows={9}
            style={{ resize: "none" }}
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div className={style.tagsContainer + " mt-3 form-control"}>
          <ul className={style.tagList}>
            {tags &&
              tags.map((tag) => (
                <li key={tag}>
                  {tag}{" "}
                  <span onClick={() => handleRemoveTag(tag)}>
                    <IoMdCloseCircle />
                  </span>
                </li>
              ))}
          </ul>
          <input type="text" onKeyUp={handleTag} placeholder="Tags" />
        </div>
        <div className="form-group mt-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
          />
        </div>
        {errorMsg && <small className="text-danger">{errorMsg}</small>}
        <div className="text-center">
          <button
            className="btn mt-3 btn-warning fw-bold"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn mt-3 btn-danger fw-bold ms-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
