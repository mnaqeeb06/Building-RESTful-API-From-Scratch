const express = require("express");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParse.urlencoded({ extended: true }));

app.use(express.static("public"));

//setting view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////// RequestS Targetting all Articles ///////////////// 
// chain route
app.route("/articles")

    // ----- Get All Articles -> GET request
    .get(function (req, res) {

        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });

    })
    // ----- POST a New Article 
    .post(function (req, res) {
        // console.log(req.body.title);
        // console.log(req.body.content);
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        // saving into database
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.")
            } else {
                res.send(err);
            }
        });

    })
    // ----- Delete All Articles
    // delete all the article in articles collection
    // {condition}, if empty that means everything
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfuly deleted all articles")
            } else {
                res.send(err);
            }
        });
    });

///////////// Request Targetting a Specific Article ///////////////////////
/* localhost://3000/articles/something */
app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, articleFound) {
            if (articleFound) {
                res.send(articleFound);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            
            function (err) {
                if (!err) {
                    res.send("Successfully updated the article");
                }else{
                    res.send(err);
                }
            })
    })

    .patch(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated Article")
                }else{
                    res.send(err);
                }
            }
        )
    });

    

app.listen(3000, function () {
    console.log("listening at port 3000");
});

