import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IScribble } from "../../models/IScribble";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { timeFormatter } from "../../helpers/helpers";

const Scribble = () => {
  const [scribble, setScribble] = useState<IScribble>();
  const [scribbleUpdated, setScribbleUpdated] = useState<boolean>(false);
  const [inputFromComment, setInputFromComment] = useState<string>("");
  const [scribbleComments, setScribbleComments] = useState<IScribble[]>([]);

  const navigate = useNavigate();
  const scribbleId = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:5000/feed/posts/" + scribbleId.id)
      .then((response) => {
        if (response) {
          // setScribbleUpdated(!scribbleUpdated);
          setScribble(response.data);
          setScribbleComments(response.data.comments);
        }
      });
  }, [scribbleUpdated]);

  const upVote = async (scribbleId) => {
    await axios
      .post("http://localhost:5000/feed/upvote/" + scribbleId)
      .then((response) => {
        if (response) {
          setScribbleUpdated(!scribbleUpdated);
        }
      });
  };

  const downVote = async (scribbleId) => {
    await axios
      .post("http://localhost:5000/feed/downvote/" + scribbleId)
      .then((response) => {
        if (response) {
          setScribbleUpdated(!scribbleUpdated);
        }
      });
  };

  const downVoteComment = async (comment) => {
    console.log(comment._id);

    await axios
      .post("http://localhost:5000/feed/downvote/comment/" + comment._id, {
        comment,
      })
      .then((response) => {
        if (response) {
          setScribbleUpdated(!scribbleUpdated);
        }
      });
  };

  const upVoteComment = async (comment) => {
    await axios
      .post("http://localhost:5000/feed/upvote/comment/" + comment._id, {
        comment,
      })
      .then((response) => {
        if (response) {
          setScribbleUpdated(!scribbleUpdated);
        }
      });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const cookie = localStorage.getItem("token");

    const commentObject = {
      content: inputFromComment,
      time: Date.now,
      author: "",
      votes: 0,
    };

    await axios
      .post("http://localhost:5000/feed/posts/comment/" + scribbleId.id, {
        commentObject,
        cookie,
      })
      .then((response) => {
        if (response) {
          setScribbleComments(response?.data?.comments);
          setScribbleUpdated(!scribbleUpdated);
        }
      });
  };

  const handleInput = (e) => {
    setInputFromComment(e.target.value);
  };

  const scribbleTime = timeFormatter(scribble?.time);

  const mappedComments = scribbleComments?.map((comment) => {
    const posted = timeFormatter(+comment.time);

    return (
      <article
        className="feed__article"
        style={{
          marginLeft: "24px",
          backgroundColor: "var(--borders)",
          paddingRight: "16px",
        }}
      >
        <div className="alias-and-text__wrapper">
          <div className="alias__wrapper">
            <div className="profile-pic__wrapper">
              <img src="/assets/coffee.png" alt="" className="profile__img" />
            </div>
            <span>{comment?.author}</span>
            <span className="time__wrapper">{posted}</span>
          </div>
          <div className="text__wrapper">{comment?.content}</div>
        </div>
        <div
          className="votes__wrapper"
          style={{ width: "100%", margin: "16px" }}
        >
          <button
            className="vote__button"
            onClick={() => upVoteComment(comment)}
          >
            <img src="/assets/vectorup.png" alt="arrowup" />
          </button>
          <p className="vote-counter__paragraph">{comment?.votes}</p>
          <button
            className="vote__button"
            onClick={() => downVoteComment(comment)}
          >
            <img src="/assets/vectordown.png" alt="arrowdown" />
          </button>
        </div>
      </article>
    );
  });

  return (
    <>
      <div style={{ minHeight: "100%" }} className="relative__wrapper">
        <div className="feed-icons__wrapper">
          <div className="icon__wrapper">
            <MdOutlineKeyboardArrowLeft
              onClick={() => navigate(-1)}
              style={{ fontSize: "24px", color: "var(--background)" }}
            />
          </div>
        </div>
        <article className="feed__article">
          <div className="alias-and-text__wrapper">
            <div className="alias__wrapper">
              <div className="profile-pic__wrapper">
                <img src="/assets/coffee.png" alt="" className="profile__img" />
              </div>
              <span>{scribble?.author}</span>
              <span className="time__wrapper">{scribbleTime}</span>
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
        {mappedComments}
        <div className="comment__wrapper">
          <div className="comment__input__wrapper">
            <div className="profile-pic__wrapper" style={{ maxHeight: "24px" }}>
              <img
                src="/assets/coffee.png"
                alt=""
                className="profile__img"
                style={{ maxHeight: "24px" }}
              />
            </div>
            <form action="" onSubmit={(e) => handleCommentSubmit(e)}>
              <input
                type="text"
                className="comment__input"
                placeholder="spread some love..."
                onChange={(e) => handleInput(e)}
              />
              <input
                type="submit"
                className="send__button"
                style={{
                  marginRight: "16px",
                  fontWeight: "600",
                  color: "var(--background)",
                }}
              />
            </form>
            send
          </div>
        </div>
      </div>
    </>
  );
};

export default Scribble;
