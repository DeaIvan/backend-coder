import { Router } from 'express';
import { promises } from 'fs';
import fs from 'fs';
import CartManager from '../manager/CartManager.js';


const cartMng = new CartManager("./carts.json");
const router = Router();

router.post('/', async (req, res) => {
    const newCart = await cartMng.createCart();
    if (newCart){
        res.send(newCart);
    }else{
        res.status(404).send("No se pudo crear el carrito");
    }
});


router.get('/:cid', async (req, res) => {
    const idCarrito = Number(req.params.id);
    try {
        const cart = await cartMng.getCart(idCarrito);
        res.send(cart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});



router.post('/:cid/product/:pid', async (req, res) => {
    const idCarrito = Number(req.params.id);
    const idProducto = Number(req.params.id);
    try {
        const cart = await cartMng.addToCart(idCarrito, idProducto);
        res.send(cart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

export default router;