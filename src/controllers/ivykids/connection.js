const followModel = require("../../model/follows");
const reg = require("../../model/register");

exports.connectionGet = async (req, res) => {
  const senderId = req.user.id;

  try {
    const users = await reg.find({ userType: "ivykids" });

    const userData = await Promise.all(
      users.map(async (user) => {
        if (user._id.toString() === senderId) {
          return null;
        }

        const existingFollow = await followModel.findOne({
          senderId,
          receiverId: user._id,
        });

        if (existingFollow && existingFollow.isFollowing === "following") {
          // Exclude the user if isFollowing is "following"
          return null;
        }

        return {
          receiverId: user._id,
          fullName: user.fullName,
          username: user.email,
          userProfile: user.userProfile,
          userAbout: user.userAbout,
          isFollowing: existingFollow ? existingFollow.isFollowing : "follow",
        };
      })
    );

    const filteredUserData = userData.filter((user) => user !== null);

    res.json({ message: "success", status: true, data: filteredUserData });
  } catch (error) {
    console.error("Error retrieving users' data:", error);
    res.status(500).json({
      message: "Failed to retrieve users' data.",
      status: false,
    });
  }
};
