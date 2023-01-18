import axios from "axios";
import e from "express";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { timeFormatter } from "../../helpers/helpers";
import { MdSend } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import { BsFilterCircleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

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
  const [scribblesExist, setScribblesExist] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (newPost && inputRef.current) {
      inputRef.current!.focus();
    }
  }, [newPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cookie = localStorage.getItem("token");

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
        setPostContent("");
        setNewPost(false);
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

  const mappedScribbles = scribbles?.map((scribble: IScribble) => {
    const posted = timeFormatter(+scribble?.time);

    return (
      <>
        <div className="main-feed__wrapper">
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
                <span className=" ">{scribble?.author}</span>
                <span className="time__wrapper">{posted}</span>
              </div>
              <div className="text__wrapper ">{scribble?.content}</div>
            </div>
            <div className="votes__wrapper">
              <button
                onClick={() => upVote(scribble?._id)}
                className="vote__button"
              >
                <MdKeyboardArrowUp />
              </button>
              <p className="vote-counter__paragraph">{scribble?.votes}</p>
              <button
                onClick={() => downVote(scribble?._id)}
                className="vote__button"
              >
                <MdKeyboardArrowDown />
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
      <div className="main-feed__wrapper" style={{ paddingBottom: "40px" }}>
        <div className="feed-icons__wrapper">
          <div className="add-and-filter__wrapper">
            <MdAddCircle
              onClick={handleNewPost}
              className="icon--styles"
              style={{ fontSize: "30.5px", cursor: "pointer" }}
              id="add__button"
            />

            <BsFilterCircleFill className="icon--styles" />
          </div>
          <div className="profile__wrapper">
            <CgProfile
              className="icon--styles"
              style={{
                backgroundColor: "var(--borders)",
                color: "var(--background)",
                borderRadius: "25px",
              }}
            />
          </div>
        </div>
        {newPost && (
          <div
            className="comment__wrapper"
            style={{
              borderBottom: "1px solid #585858",
            }}
          >
            <div className="comment__input__wrapper">
              <div
                className="profile-pic__wrapper"
                style={{ maxHeight: "24px" }}
              ></div>
              <form
                action=""
                onSubmit={(e) => handleSubmit(e)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "88%",
                }}
              >
                <input
                  value={postContent}
                  ref={inputRef}
                  type="text"
                  className="comment__input"
                  placeholder="spread some love..."
                  onChange={(e) => handleInput(e)}
                />
                <button type="submit" className="feed-submit__button">
                  <MdSend />
                </button>
              </form>
            </div>
          </div>
        )}

        {mappedScribbles}
        <article className="feed__article">
          <div className="alias-and-text__wrapper">
            <div className="alias__wrapper">
              <div className="profile-pic__wrapper">
                <img
                  src="/assets/asaprocky.png"
                  alt=""
                  className="profile__img"
                  style={{ height: "100%", borderRadius: "25px" }}
                />
              </div>
              <span>ALIA$_Rocky</span>
              <span className="time__wrapper">Long time ago</span>
            </div>
            <div className="text__wrapper">
              Great app Michael, how do I invest?
            </div>
          </div>
          <div className="votes__wrapper">
            <button className="vote__button">
              <MdKeyboardArrowUp />
            </button>
            <p className="vote-counter__paragraph">99</p>
            <button className="vote__button">
              <MdKeyboardArrowDown />
            </button>
          </div>
        </article>
      </div>
    </>
  );
};

export default Feed;
