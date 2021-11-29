const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Category = require("../../model/categorySchema");
const Product = require("../../model/productSchema");
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const resizeImg = require("resize-img");

router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

router.get("/", async (req, res) => {
    var pcount = Product.count();
    if (!pcount) {
        pcount = 0;
    }
    const prods = await Product.find({});
    res.render("admin/products", {
        prods: prods,
        pcount: pcount,
    });
});

router.get("/add", (req, res) => {
    var title = "";
    var desc = "";
    var price = "";

    Category.find((err, categories) => {
        res.render("admin/add_product", {
            title: title,
            desc: desc,
            categories: categories,
            price: price,
        });
    });
});

router.post("/add", async (req, res) => {
    var imageFile =
        typeof req.files.image !== "undefined" ? req.files.image.name : "";
    var title = req.body.title;
    var slug = title.replace(/\s+/g, "-").toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    if (slug) {
        const exists = await Product.findOne({ slug: slug });
        if (!exists) {
            var price2 = parseFloat(price).toFixed(2);

            const product = new Product({
                title: title,
                slug: slug,
                desc: desc,
                price: price2,
                category: category,
                image: imageFile,
            });

            await product
                .save()
                .then(() => console.log("Product Added."))
                .catch(() => {
                    console.log("Product not Added");
                    res.redirect("/admin/product");
                });
            // mkdirp('/public/product_images/' + product._id, error => {
            //     return console.log(err);
            // });
            await mkdirp("public/product_images/" + product._id)
                .catch((err) => {
                    console.log(err);
                })
                .then((p) => console.log(`made dir staring with ${p}`));
            await mkdirp("public/product_images/" + product._id + "/gallery")
                .catch((err) => {
                    console.log(err);
                })
                .then((p) => console.log(`made dir staring with ${p}`));
            await mkdirp("public/product_images/" + product._id + "/gallery/thumbs")
                .catch((err) => {
                    console.log(err);
                })
                .then((p) => console.log(`made dir staring with ${p}`));

            if (imageFile != "") {
                var productImage = req.files.image;
                var path = "public/product_images/" + product._id + "/" + imageFile;
                productImage.mv(path);
            }
            return res.redirect("/admin/product/");
        }
    }
    console.log("Product not Added");
    res.redirect("/admin/product/add");
});

router.get("/edit/:id", (req, res) => {
    Category.find((err, categories) => {
        Product.findById(req.params.id, async (err, product) => {
            if (err) {
                return console.log(err);
            }

            //for future use to add more images
            // var galleryDir = 'public/product_images/' + product._id + '/gallery';
            // var galleryImages = null;

            // galleryImages = galleryDir;
            res.render("admin/edit_product", {
                title: product.title,
                desc: product.desc,
                categories: categories,
                category: product.category.replace(/\s+/g, "-").toLowerCase(),
                price: product.price,
                image: product.image,
                // galleryImages: galleryImages,
                id: product._id
            });
        });
    });
});

router.post("/edit/:id", (req, res) => {

    var imageFile =  (req.files !== null) ? req.files.image.name : "";
    var title = req.body.title;
    var slug = title.replace(/\s+/g, "-").toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var nimage = req.body.nimage;
    var id = req.params.id;

    if (slug) {
         Product.findById(id, async (err, prod) => {
            if (err) { console.log(err); }
            else {
                if (prod) {
                    var price2 = parseFloat(price).toFixed(2);
                    prod.title = title;
                    prod.slug = slug;
                    prod.desc = desc;
                    prod.category = category;
                    prod.price = price2;
                    if (imageFile != "") {
                        prod.image = imageFile;
                    }
                    prod
                        .save()
                        .then(() => console.log("Product Editted."))
                        .catch(() => {
                            console.log("Product not Editted");
                            res.redirect("/admin/product");
                        });
                }
            }
            
            if (imageFile != "") {
                if (nimage != "") {
                    await fs.remove("public/product_images/" + id +"/"+ nimage, (err) => {
                        if (err) console.log(err);
                    });
                }
                
                var productImage = req.files.image;
                var path = "public/product_images/" + id + "/" + imageFile;
                productImage.mv(path);
            }
        });

        return res.redirect("/admin/product/");
    };

    console.log("Product not Editted");
    res.redirect("/admin/product/edit");
});


router.get("/delete/:id", (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            return console.log(err);
        }
        var id = req.params.id;
        var path = "public/product_images/" + id;


        fs.remove(path);
        res.redirect("/admin/product/");
    });
});

module.exports = router;
