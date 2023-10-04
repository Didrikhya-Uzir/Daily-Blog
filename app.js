//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3030;

const mongoURI = `${process.env.URI}/blogDB`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const homeStartingContent = "Welcome to the Daily Journal - a haven for daily reflections and the art of mindful living. Our journal blog is a sanctuary where each day unfolds with the beauty of ordinary moments. From sunrise to sunset, we capture the essence of life in words. Explore the tapestry of emotions and experiences woven by our diverse community of writers. Join us in celebrating the extraordinary within the ordinary—where the simplicity of daily routines becomes a canvas for self-discovery. Start your own journaling journey with our creative prompts and tips. Embrace the power of storytelling, one day at a time. Your daily inspiration awaits, guiding you through the mosaic of life's meaningful details..";
const aboutContent = "Welcome to the heart of The Daily Journal. Our about page is a glimpse into the soul of our daily journal blog. Here, we unfold the story behind the pixels—a collective of passionate writers, dreamers, and storytellers dedicated to cherishing life's minutiae. Discover the inspiration that fuels our commitment to mindful living and the joy of everyday discoveries. Join us in this journey as we strive to create a space where authenticity meets creativity, and where each word resonates with the rhythm of life.";
const contactContent = "Connect with us at The Daily Journal. Your thoughts, questions, and shared moments are the threads that weave our community together. Whether you want to share your own daily reflections, collaborate, or simply say hello, we'd love to hear from you. Reach out through the contact form below, and let's embark on this journey of connection and discovery together. Your messages are the whispers that inspire us to continue exploring the magic within the ordinary. Thank you for being a part of our daily journal blog—where every connection is a new chapter in our shared story.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res){
  try {
    const posts = await Post.find({}).exec();
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    // Handle any errors here
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    // Handle any errors here
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/posts/:postTitle", async function(req, res) {
  const requestedPostTitle = req.params.postTitle;

  try {
    const post = await Post.findOne({ title: requestedPostTitle }).exec();
    if (!post) {
      // Handle the case where the post is not found
      return res.status(404).send("Post not found");
    }

    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    // Handle any errors here
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
