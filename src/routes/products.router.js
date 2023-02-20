import { Router } from 'express';
import { promises } from 'fs';
import fs from 'fs';
import ProductManager from '../manager/ProductManager.js';


const prodMng = new ProductManager("./files/productos.json");
const router = Router();

const products = await promises.readFile('./files/productos.json', 'utf-8');
let data = JSON.parse(products, null, "\n");

router.post('/', async (req, res) => {
    const newProduct = req.body;

    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.status || !newProduct.code || !newProduct.stock) {
        return res.status(400).send({status: 'error', message: 'Incomplete values'});
    }else{
        const products = await prodMng.addProduct(newProduct);
        res.send(newProduct.title);
    }

});


router.get('/', async (req, res) => {
    const products = await prodMng.getProducts()
    const limit = Number(req.query.limit)

    if(!limit) return res.send(products);
    const filterLimit = products.filter(p => products.length = limit)

    res.send({filterLimit})   
});



router.get('/:id', async (req, res) => {
    const idProducto = Number(req.params.id);
    try {
        const products = await prodMng.getProduct(idProducto);
        res.send(products);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.put('/:id',async (req, res) => {
    const product = req.body;
    const productId = Number(req.params.id);

    if (!product.title || !product.description || !product.price || !product.status || !product.code || !product.stock) {
        return res.status(400).send({status: 'error', message: 'Incomplete values'});
    }else{
        const products = await prodMng.editProduct(productId);
        res.send(product);
    }
});

router.delete('/:id', async (req, res) => {
    const productId = Number(req.params.id);
    try {
        const products = await prodMng.deleteProduct(productId);
        res.send(products);
    } catch (error) {
        res.status(404).send(error.message);
        
    }
});

export default router;