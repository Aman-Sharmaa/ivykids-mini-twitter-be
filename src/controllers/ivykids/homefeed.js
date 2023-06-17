const reg = require("../../model/register");
const post = require("../../model/post");
const followModel = require("../../model/follows");

exports.userAndPost = async (req, res) => {
  const userId = req.user.id;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const postsPerPage = 10;
  const skipPosts = (page - 1) * postsPerPage;

  try {
    const followingUsers = await followModel.find({
      followerId: userId,
      isFollowing: "following",
    });

    const followingUserIds = followingUsers.map((follow) => follow.receiverId);

    const postCount = await post.countDocuments({
      $and: [
        { userId: { $nin: [userId] } },
        {
          $or: [{ userId: { $in: followingUserIds } }],
        },
      ],
    });

    const postDetails = await post
      .find({
        $and: [
          {
            $or: [{ userId: { $in: followingUserIds } }],
          },
        ],
      })
      .sort({ _id: -1 })
      .skip(skipPosts)
      .limit(postsPerPage);

    const userIds = postDetails.map((post) => post.userId);
    const userDetails = await reg.find({ _id: { $in: userIds } });
    const combinedData = postDetails.map((post) => {
      const user = userDetails.find(
        (user) => user._id.toString() === post.userId.toString()
      );

      return {
        _id: post._id,
        userId: post.userId,
        postImage: post.postImage,
        postQuestion: post.postQuestion,
        postPrivacy: post.postPrivacy,
        fullName: user ? user.fullName : "",
        userProfile: user ? user.userProfile : "",
        username: user ? user.email : "",
      };
    });

    const totalPages = Math.ceil(postCount / postsPerPage);

    res.status(200).json({
      message: "success",
      status: true,
      data: combinedData,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
