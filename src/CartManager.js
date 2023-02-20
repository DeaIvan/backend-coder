import fs from 'fs';

class CartManager {

    constructor(path) {
        this.path = path
    }

    getCarts = async() => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                console.log(data);
                const carts = JSON.parse(data);
                return carts; 
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    createCart = async() => {
        const carts = await this.getCarts();
        if (carts.length === 0) {
            const cart = {
                id: 1,
                products: []
                }
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } else {
            const cart = {
                id: carts[carts.length -1].id + 1,
                products: []
                }
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        }
        
        return carts;
    }

    getCart = async(id) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(e=>e.id === id);

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado");
        }else{
            let carritoB = carts.filter((item => item.id == id));
            console.log('Carrito encontrado:');
            console.log(carritoB);
            return carritoB;
        }
    }


addToCart = async(cartId, productId) => {
    const carts = await this.getCart(cartId);

    const product = carts.products.findIndex(products => {product.id == productId})

    if (product) {
        product.quantity++
    } else {
        carts.products.push(
            {
                "id": productId,
                "quantity": 1
            }
        )
    }
    return carts;
}
}

export default CartManager;