import axios from "axios";
import e from "express";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { timeFormatter } from "../../helpers/helpers";
// import { timeFormatter } from "../../lib/helpers";
// import TimeForMatter from "../../services/helpers";
// import { timeFormatter } from "../../lib/helpers";
// import { IPost } from "../../models/IPosts";
// import { timeFormatter } from "../../lib/helperz";

interface IScribble {
  _id?: string;
  content: string;
  time: string;
  author: string;
  votes?: number;
}

const Feed = () => {
  const [newPost, setNewPost] = useState<boolean>(false);
  const [postContent, setPostContent] = useState("");

  const [scribbles, setScribbles] = useState<IScribble[]>([]);
  const [scribblesUpdated, setScribblesUpdated] = useState<boolean>(false);
  const [scribbleVotes, setScribbleVotes] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/feed/posts").then((response) => {
      response.data.reverse();
      setScribbles(response.data);
    });
  }, [scribblesUpdated]);

  const handleNewPost = () => {
    setNewPost(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // sätter scribbles
    // const newScribble: IScribble = {
    //   content: postContent,
    //   time: Date.now().toString(),
    //   author: "challe",
    //   votes: 0,
    // };
    const cookie = localStorage.getItem("token");
    // setScribbles([...scribbles, newScribble]);
    try {
      const response = await axios.post<IScribble>(
        "http://localhost:5000/feed/posts",
        {
          postContent,
          token: cookie,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data) {
        setScribbles([...scribbles, response.data]);
        // setScribbles((prevScribbles) => [response.data, ...prevScribbles]);
        setScribblesUpdated(!scribblesUpdated);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const upVote = async (scribbleId) => {
    await axios
      .post("http://localhost:5000/feed/upvote/" + scribbleId)
      .then((response) => {
        if (response) {
          setScribblesUpdated(!scribblesUpdated);
        }
      });
  };

  const downVote = async (scribbleId) => {
    await axios
      .post("http://localhost:5000/feed/downvote/" + scribbleId)
      .then((response) => {
        if (response) {
          setScribblesUpdated(!scribblesUpdated);
        }
      });
  };

  //   const

  //   axios.post("http://localhost:5000/feed/addvotes").then((response) => {
  //     if (response) {
  //       console.log("got a response from backend");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   axios.get<IPost[]>("http://localhost:5000/feed/posts").then((response) => {
  //     setPosts({ ...posts, posts: response.data });
  //     console.log(posts);
  //   });
  // }, []);

  const mappedScribbles = scribbles?.map((scribble: IScribble) => {
    // const posted = timeFormatter(+scribble?.time);

    const posted = timeFormatter(+scribble?.time);

    // const posted = TimeForMatter(+scribble.time);

    // const timeInMinutes = Math.floor((Date.now() - +scribble?.time) / 60000);

    // let timeLabel = `${timeInMinutes} m ago`;
    // if (timeInMinutes > 60) {
    //   const timeInHours = Math.floor(timeInMinutes / 60);
    //   timeLabel = `${timeInHours} h ago`;
    // }
    return (
      <>
        <div className="main-feed__wrapper">
          {/* <Link
            to={"/feed/scribble/" + scribble._id}
            style={{ textDecoration: "none", color: "inherit" }}
          > */}
          <article className="feed__article">
            <div
              className="alias-and-text__wrapper"
              onClick={() => navigate("/feed/scribble/" + scribble._id)}
            >
              <div className="alias__wrapper">
                <div className="profile-pic__wrapper">
                  <img
                    src="/assets/coffee.png"
                    alt=""
                    className="profile__img"
                  />
                </div>
                <span>{scribble?.author}</span>
                <span className="time__wrapper">{posted}</span>
              </div>
              <div className="text__wrapper">{scribble?.content}</div>
            </div>
            <div className="votes__wrapper">
              <button
                onClick={() => upVote(scribble?._id)}
                className="vote__button"
              >
                <img src="/assets/vectorup.png" alt="arrowup" />
              </button>
              <p className="vote-counter__paragraph">{scribble?.votes}</p>
              <button
                onClick={() => downVote(scribble?._id)}
                className="vote__button"
              >
                <img src="/assets/vectordown.png" alt="arrowdown" />
              </button>
            </div>
          </article>
          {/* </Link> */}
        </div>
      </>
    );
  });

  return (
    <>
      <div className="main-feed__wrapper">
        <div className="feed-icons__wrapper">
          <div className="add-and-filter__wrapper">
            <img
              src="assets/newpost.png"
              alt="add"
              className="lolhover"
              onClick={handleNewPost}
            />
            <img src="assets/filter.png" alt="filter" />
          </div>
          <div className="profile__wrapper">
            <img src="/assets/profile.png" alt="profile" />
          </div>
        </div>
        {newPost && (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              // value={}
              onChange={handleInput}
              className="input-field"
            />
            <input type="submit" value="submit" />
          </form>
        )}
        {mappedScribbles}
      </div>
    </>
  );
};

export default Feed;
