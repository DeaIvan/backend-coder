import { Router } from 'express';
import { promises } from 'fs';
import fs from 'fs';

const router = Router();

const products = await promises.readFile('./src/productos.json', 'utf-8');
let data = JSON.parse(products, null, "\n");

router.post('/', async (req, res) => {

    const newProduct = req.body;

    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.status || !newProduct.code || !newProduct.stock) {
        return res.status(400).send({status: 'error', message: 'Incomplete values'});
    };

    if (data.length === 0) {
        newProduct.id = 1;
    } else {
        newProduct.id = data[data.length - 1].id + 1;
    }
    
    await data.push(newProduct);

    await fs.promises.writeFile(data, JSON.stringify(newProduct, null, '\t'))
    .then(() => {return console.log(`Se agrego el producto ${newProduct.title} correctamente`)})
    .catch(error => console.log(error))
    console.log(newProduct);
    res.send(`Producto cargado exitosamente ${newProduct.title}`);   
});


router.get('/', async (req, res) => {
    const limit = Number(req.query.limit)
    if(!limit) return res.send(data);

    const filterLimit = data.filter(p => data.length = limit)

    res.send({filterLimit})   
});



router.get('/:id', (req, res) => {
    const idProducto = Number(req.params.id);

    const product = data.find(u=>u.id === idProducto);
    if(!product) return res.send({error: 'Producto no encontrado'});
    res.send(product);
});

router.put('/:id', (req, res) => {
    const product = req.body;
    const productId = Number(req.params.id);

    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.status || !newProduct.code || !newProduct.stock) {
        return res.status(400).send({status: 'error', message: 'Incomplete values'});
    }

    const newProduct = { id: productId, ...product }

    const index = data.findIndex(u => u.id === productId)

    if (index != -1) {
        data[index] = newProduct;
        res.send({status: 'sucess', message: 'Product updated'});
    } else {
        res.status(404).send({status: 'error', message: 'Product not found'});
    }
});

router.delete('/:id', (req, res) => {
    const productId = Number(req.params.id);

    const index = data.findIndex(u => u.id === productId);

    if (index != -1) {
        data.splice(index, 1);
        res.send({status: 'sucess', message: 'Product deleted'});
    } else {
        res.status(404).send({status: 'error', message: 'Product not found'});
    }
});

export default router;