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
    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    if(slug){
        const exists = await Category.findOne({slug:slug});
        if(!exists){
            const category = new Category({
                title: title,
                slug: slug
            });

            await category.save().then(() => console.log("Category Added.")).catch(()=>{console.log('Category not Added');res.redirect('/admin/category')});
            return res.redirect('/admin/category/');
        }
    }
    console.log('Category not Added');
    res.redirect('/admin/category/add');
})

router.get('/edit/:id',(req,res)=>{

    Category.findById(req.params.id , (err, cat) => {
        if(err){
            return console.log(err);
        }
        res.render('admin/edit_category',{
            title: cat.title,
            id: cat._id
        });
    });
});



router.post('/edit/:id',(req,res)=>{

    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var id = req.params.id;
    
    Category.findOne({slug: slug, _id: {'$ne': id}}, async (err,category)=>{
        
        if(category){
            res.render('admin/edit_category',{
                title: title,
                id: id
            });
        }else{
            Category.findById(id ,async (err, category) => {
                if(err){
                    return console.log(err);
                }
                category.title = title;
                category.slug = slug;
                await category.save().then(() => console.log("Category Added.")).catch(()=>{console.log('Category not Added');res.redirect('/admin/category')});
                return res.redirect('/admin/category');
            });
        }
    });
})

router.get('/delete/:id',(req,res)=>{

    Category.findByIdAndDelete(req.params.id, (err)=>{
        if(err){return console.log(err);}

        res.redirect('/admin/category/');
    });
})



module.exports = router;
