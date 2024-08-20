import Product from "../models/ProductModel.js";

// add new product
export const addProduct = async (req, res) => {
    try {
        const { name, brand, category, description, sku, barcode } = req.fields;
        
        switch(true) {
            case !name:
                return res.json( { error: "Name is required" } );
            case !brand:
                return res.json( { error: "Brand is required" } );
            case !description:
                return res.json( { error: "Description is required" } );
            case !category:
                return res.json( { error: "Category is required" } );
            case !sku:
                return res.json( { error: "SKU is required" } );
            case !barcode:
                return res.json( { error: "Barcode is required" } );
        }
        
        const product = new Product({...req.fields});
        await product.save();
        res.status(201).json( { msg : "Product Added Successfully" } );
    } catch (error) {
        res.status(400).json( { msg : "Product Adding Failed ", error } );
    }
}

// fetch all products
export const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(400).json( { msg : "No Product Found", error } );
    }
}

// fetch a product by id
export const fetchProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json( { msg : "Product Not Found" } );
        }
        res.json(product);
    } catch (error) {
        res.status(404).json( { msg : "Cannot find this product", error } );
    }
}

// update product
export const updateProduct = async (req, res) => {
    try {
        const { name, brand, category, description, sku, barcode } = req.fields;
        
        switch(true) {
            case !name:
                return res.json( { error: "Name is required" } );
            case !brand:
                return res.json( { error: "Brand is required" } );
            case !description:
                return res.json( { error: "Description is required" } );
            case !category:
                return res.json( { error: "Category is required" } );
            case !sku:
                return res.json( { error: "SKU is required" } );
            case !barcode:
                return res.json( { error: "Barcode is required" } );
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields}, { new : true });
        if(!product) {
            return res.status(400).json( { msg : "Product not found" } )
        }
        await product.save();
        res.json( { msg : "Update Successful ", product } );
    } catch (error) {
        res.status(400).json( { msg : "Update Failed ", error } );
    }
}

// delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) {
            return res.status(400).json( { msg : "Product not found" } )
        }
        res.json( { msg : "Product Deleted Successfully" } )
    } catch (error) {
        res.status(400).json( { msg : "Product Cannot Delete ", error } );
    }
}