import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { __getComments } from "../../modules/commentsSlice";
import { __AddLikes, __getPosts } from "../../modules/postsSlice";
import {
  __signUp,
  __getUsers,
  __switchIsLogin,
  __userLikes,
} from "../../modules/usersSlice";
import {
  Article,
  H1,
  PostBox,
  PostLike,
  Section,
  PostContainer,
  GageBar,
  BarA,
} from "./style";

const PostList = () => {
  const dispatch = useDispatch();
  const { error, posts } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const { users } = useSelector((state) => state.users);

  const currentUserId = localStorage.getItem("id");
  const myLikes = users.filter((user) => user.id == currentUserId);

  const navigate = useNavigate();
  if (error) {
    return <div>{error.message}</div>;
  }

  // 좋아요 추가 함수
  const switchLikesHandler = (post) => {
    //filter ,find 함수를 사용하여 like키값에 해당 값이 있는 판별
    const isNotLike = post.like.filter((like) => like !== currentUserId);
    const isLike = post.like.find((like) => like === currentUserId);

    const addLike = {
      ...post,
      like: [...post.like, currentUserId],
    };
    const deleteLike = {
      ...post,
      like: isNotLike,
    };
    //  거짓이면 추가 참이면 삭제
    if (isLike !== currentUserId) {
      dispatch(__AddLikes(addLike));
    }
    if (isLike === currentUserId) {
      dispatch(__AddLikes(deleteLike));
    }
    console.log(post.like);
  };

  return (
    <Section>
      <H1>토론주제</H1>

      {posts.map((post) => {
        let countA = 0;
        let countB = 0;
        let barA = "lightgray";
        let barB = "gray";
        comments.map((comment) => {
          if (comment.isA === true && comment.postId === post.id) {
            countA = countA + 1;
            barA = "coral";
          }
          if (comment.isA === false && comment.postId === post.id) {
            countB = countB + 1;
            barB = "skyblue";
          }
        });
        let ratioA = Math.round(100 - (countA / (countA + countB)) * 100);
        let ratioB = Math.round(100 - (countB / (countA + countB)) * 100);

        if (countA === 0) {
          ratioA = 50;
        }
        if (countB === 0) {
          ratioB = 50;
        }
        return (
          <Article
            key={post.id}
            // onClick={() => {
            //   navigate(`/${post.id}`);
            // }}
          >
            <PostContainer>
              <PostBox>
                <div>논제: {post.title}</div>
                <div>
                  <div>
                    A: {post.categoryA} vs B: {post.categoryB}
                  </div>
                  <div></div>
                </div>
              </PostBox>
              <PostLike onClick={() => switchLikesHandler(post)}>
                👍
                <br />({post.like.length})
              </PostLike>
            </PostContainer>
            <GageBar>
              <BarA bg={ratioA} color={barA}>
                {ratioA}%
              </BarA>
              <BarA bg={ratioB} color={barB}>
                {ratioB}%
              </BarA>
            </GageBar>
          </Article>
        );
      })}
    </Section>
  );
};
export default PostList;
