const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

// connecting mongodb to my app
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Setting ejs to my express app
app.set("view engine", "ejs");
// using body-parser to my app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Creating a schema for my wikiDB
const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});
// Creating a model using articlesSchema
const Article = mongoose.model("article", articlesSchema);

app.get("/", (req, res) => {
  res.render("home");
});

// Creating a get, post & delete request to our db using "express route"
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const titleContent = req.body.title;
    const actualContent = req.body.content;

    const newArticle = new Article({
      title: titleContent,
      content: actualContent,
    });
    newArticle.save().then(() => res.redirect("/articles"));
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all the documents from wikiDB!");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:customListName")
  .get((req, res) => {
    const customListName = req.params.customListName;

    Article.findOne({ title: customListName }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No matches found!");
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.customListName },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Successfully updated the specific collection!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.customListName },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send(
            "Successfull patch work to update a particular part of our Database."
          );
        }
      }
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.customListName }, (err) => {
      if (!err) {
        res.send("Successfully deleted the specific item from the db!");
      } else {
        res.send(err);
      }
    });
  });

const port = process.env.PORT || 2000;

app.listen(port, () => {
  console.log(`Your app started on port ${port}`);
});
