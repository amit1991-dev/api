const router = require("express").Router();
const Post = require("../node_models/posts");
const User = require("../node_models/users");
const Notifications = require("../node_models/notifications");



//create a post
// router.post("/", async (req, res) => {
//   var ret={status:"failed",message:""};
//   const newPost = new Post(req.body.post);
//   try {
//     const savedPost = await newPost.save();
//     ret.status="success";
//     ret.data=savedPost;
//     res.status(200).json(ret);
//   } catch (err) {
//     ret.error=err;
//     res.status(500).json(ret);
//   }
// });


// //update a post{update:{username:"neoned71"}}
// router.post("/:id", async (req, res) => {
//   var ret={status:"failed",message:""};
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.owner_id === req.user._id) {
//       await post.updateOne({ $set: req.body.update });
//       ret.status="success";
//       ret.message="the post has been updated";
//       res.status(200).json(ret);
//     } else {
//       ret.message="you can update only your post"
//       res.status(403).json(ret);
//     }
//   } catch (err) {
//     ret.error=err;
//     res.status(500).json(ret);
//   }
// });


// //delete a post
router.delete("/:id", async (req, res) => {
  var ret={status:"failed",message:""};
  try {
    const post = await Post.findById(req.params.id);
    if (post.owner_id == req.user._id) {
      await post.deleteOne();
      ret.status="success";
      ret.message="the post has been deleted";
      res.status(200).json(ret);
    } else {
      ret.message="you can delete only your post";
      res.status(403).json(ret);
    }
  } catch (err) {
    ret.error=err;
    res.status(500).json(err);
  }
});


//like / dislike a post
router.post("/like/:id/", async (req, res) => {
  var ret={status:"failed",message:""};
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      Notifications.put(post.owner_id,post._id,`${req.user.username} liked your post`);


      ret.status="success";
      ret.message="The post has been liked";
      res.status(200).json(ret);
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      Notifications.put(post.owner_id,post._id,`${req.user.username} disliked your post`);
      ret.message="The post has been disliked";
      ret.status="success";
      res.status(200).json(ret);
    }
  } catch (err) {
    ret.error=err;
    res.status(500).json(err);
  }
});


// //get a post
// router.get("/:id", async (req, res) => {
//   var ret={status:"failed",message:""};
//   try {
//     const post = await Post.findById(req.params.id);
//     ret.status="success";
//     ret.data=post;
//     res.status(200).json(ret);
//   } catch (err) {
//     ret.error=err;
//     res.status(500).json(err);
//   }
// });


//get timeline posts
router.get("/", async (req, res) => {
  var ret={status:"failed",message:""};
  // console.log("sdasd");
  // res.status(200).end("d");
  
  try {
    const currentUser = req.user;
    


    const notifications = await Notifications.get(currentUser.id);
    console.log(notifications);
    
    ret.status="success";
    ret.data=notifications;
    res.status(200).json(ret);
  } catch (err) {
    ret.error=err;
    ret.message="something";
    console.log(err);
    res.status(500).json(ret);
  }

});

//get timeline posts
router.get("/userposts/:username", async (req, res) => {
  var ret={status:"failed",message:""};
  // console.log("sdasd");
  // res.status(200).end("d");
  
  try {
    // const currentUser = req.params.user_id;
    // console.log(req.user);

    const user= await User.findOne({username:req.params.username});
    // console.log("user"+user._id);
    const userPosts = await Post.find({ owner_id: user._id });
    ret.status="success";
    ret.data=userPosts;
    res.status(200).json(ret);
  } catch (err) {
    ret.error=err;
    ret.message="something";
    console.log(err);
    res.status(500).json(ret);
  }

});

module.exports = router;
