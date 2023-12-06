import React, { useState, useEffect } from "react";
import style from "../styles/home.module.css";
import loadingGif from "../Assets/loading.gif";
import CardBlog from "../components/CardBlog";
import TrendingBlogCard from "../components/TrendingBlogCard";
import { firestore } from "../context/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  const handleSearch = (e) => {
    const newList = blogs.filter((blog) =>
      blog.data().title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBlogs(newList);
  };

  useEffect(() => {
    onSnapshot(collection(firestore, "blogs"), (snapshot) => {
      setBlogs(snapshot.docs);
      setLoading(false);
      setFilteredBlogs(snapshot.docs);
    });
  }, []);

  useEffect(() => {
    if (blogs) {
      let trendingBlogs = blogs.filter(
        (blog) => blog.data().isTrending === "yes"
      );
      setTrendingBlogs(trendingBlogs);
    }
  }, [blogs]);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="errorContainer">
          <img src={loadingGif} width={100} alt="loading" />
        </div>
      ) : (
        <div className="container mt-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search for blog..."
            onChange={(e) => handleSearch(e)}
          />
          <div className={style.trendingBlogContainer}>
            <h6>Trending Blogs</h6>
            <hr />
            <div className={style.trendingBlogsWrapper}>
              {trendingBlogs &&
                trendingBlogs.map((blog) => (
                  <TrendingBlogCard
                    {...blog.data()}
                    key={blog.id}
                    blogId={blog.id}
                  />
                ))}
            </div>
          </div>

          <div className={style.blogCardsContainer}>
            <h6>All Blogs</h6>
            <hr />
            <div className={style.cardsSection}>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <CardBlog {...blog.data()} blogId={blog.id} key={blog.id} />
                ))
              ) : (
                <h5>No Blogs to display</h5>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
