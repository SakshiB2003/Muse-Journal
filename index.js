import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

// Data Center
let posts = [];

// Post Constructor
function Post(title, content) {
    this.title = title;
    this.content = content;
}

// Add Post
function addPost(title, content) {
    let post = new Post(title, content);
    posts.push(post);
}

// Delete Post 
function deletePost(idx) {
    posts.splice(idx, 1);
}

// Edit Post 
function editPost(idx, title, content) {
    posts[idx] = new Post(title, content);
}

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Home 
app.get("/", (req, res) => {
    res.render("home.ejs", {posts: posts});
});

// View post

app.get("/view/:id", (req, res) => {
    let idx = req.params.id;
    let post = posts[idx];
    res.render("view.ejs", {postId: idx, title: post.title, content: post.content});
});

// Delete post 
app.post("/delete", (req,res) => {
    let idx = req.body["postId"];
    deletePost(idx);
    res.redirect("/");
})

// Edit
app.get("/edit/:id", (req, res) => {
    let idx = req.params.id;
    let post = posts[idx];
    res.render("create.ejs", {postId: idx, title: post.title, content: post.content});
});

// Update
app.post("/update", (req, res) => {
    let title = req.body["title"];
    let content = req.body["content"];
    let idx = req.body["idx"];
    editPost(idx, title, content);
    res.redirect("/");
});

// Create post
app.get("/create", (req,res) => {
    res.render("create.ejs", {postId: null, title: "", content: ""});
});

// Save post
app.post("/save", (req,res) => {
    let title = req.body["title"];
    let content = req.body["content"];

    addPost(title, content);
    res.redirect("/");
});

app.listen(port, () => {
    addPost("Why My Coffee Tastes Better at 2 AM", "I don’t know what kind of magic the night has, but coffee at 2 AM tastes different. Maybe it’s the silence, maybe it’s the panic of deadlines, or maybe my brain finally wakes up when the world sleeps. Either way, 2 AM coffee feels like a warm hug and a wake-up slap at the same time.");
    addPost("How I Survived a Week Without My Phone", "Seven days. Zero notifications. Absolute chaos. I didn’t realize how much I depended on my phone until I tried living without it. I spent the first day checking my empty pockets every five minutes. But somewhere in the silence, life felt slower, kinder, and much more peaceful.");
    console.log(`Server is running on ${port}`);
});