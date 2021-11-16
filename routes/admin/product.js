const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Category = require("../../model/categorySchema");
const Product = require("../../model/productSchema");
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');


router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

router.get("/", async (req, res) => {
    var pcount = Product.count();
    if(!pcount){pcount = 0;}
    const prods = await Product.find({});
    res.render("admin/products", {
        prods: prods,
        pcount: pcount
    });
});

router.get("/add", (req, res) => {
    var title = "";
    var desc = "";
    var price = "";
    
    Category.find((err , categories)=>{
        res.render('admin/add_product',{
            title: title,
            desc: desc,
            categories: categories,
            price: price
        })
    });
    
});

router.post('/add', async (req,res)=>{

    var imageFile = (typeof(req.files.image) !== "undefined") ? req.files.image.name : "";
    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    
    if(slug){
        const exists = await Product.findOne({slug:slug});
        if(!exists){

            var price2 = parseFloat(price).toFixed(2);

            const product = new Product({
                title: title,
                slug: slug,
                desc: desc,
                price: price2,
                category: category,
                image: imageFile
            });

            await product.save().then(() => console.log("Product Added.")).catch(()=>{console.log('Product not Added');res.redirect('/admin/product')});
            // mkdirp('/public/product_images/' + product._id, error => {
            //     return console.log(err);
            // });
            await mkdirp('public/product_images/' + product._id).catch(err =>{console.log(err)}).then(p => console.log(`made dir staring with ${p}`))
            await mkdirp('public/product_images/' + product._id + '/gallery').catch(err =>{console.log(err)}).then(p => console.log(`made dir staring with ${p}`))
            await mkdirp('public/product_images/' + product._id + '/gallery/thumbs').catch(err =>{console.log(err)}).then(p => console.log(`made dir staring with ${p}`))

            if ( imageFile != ""){
                var productImage = req.files.image;
                var path = 'public/product_images/' + product._id + '/' + imageFile;
                productImage.mv(path, function(err){
                    return console.log(err);
                });
            }
            return res.redirect('/admin/product/');
        }
    }
    console.log('Product not Added');
    res.redirect('/admin/product/add');
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
