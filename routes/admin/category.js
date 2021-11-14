const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const monngoose = require("mongoose");
const Category = require("../../model/categorySchema");

router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

router.get("/", async (req, res) => {
    const cats = await Category.find({});
    res.render("admin/categories", { cats: cats });
});

router.get("/add", (req, res) => {
    var title = "";

    res.render("admin/add_category", {
        title: title,
    });
});

router.post('/add', async (req,res)=>{
    const title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    if(slug){
        const exists = await Category.findOne({slug:slug});
        if(!exists){
            const category = new Category({
                title: title,
                slug: slug
            });

            await category.save().then(() => console.log("Categoery Added.")).catch(()=>{console.log('Category not Added');res.redirect('/admin/category')});
            return res.redirect('/admin/category/');
        }
    }
    console.log('Category not Added');
    res.redirect('/admin/category/add');
})

module.exports = router;
