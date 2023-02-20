import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path
    }

    getProducts = async() => {
            try {
                if (fs.existsSync(this.path)) {
                    const data = await fs.promises.readFile(this.path, 'utf-8');
                    console.log(data);
                    const users = JSON.parse(data);
                    return users; 
                } else {
                    return [];
                }
            } catch (error) {
                console.log(error);
            }
    }

    
    addProduct = async(prod) => {
        const products = await this.getProducts();
        if (products.length === 0) {
            prod.id = 1;
        } else {
            prod.id = products[products.length -1].id + 1;
        }
        products.push(prod);
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return prod;
    }

    getProduct = async(id) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex(e=>e.id === id);

        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }else{
            let productoB = products.filter((item => item.id == id));
            console.log('Producto encontrado:');
            console.log(productoB);
            return productoB;
        }
    }

    deleteProduct = async(id) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex(e=>e.id === id);
    
            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }else{
                let borrado = products.filter((item => item.id != id));
                await fs.promises.writeFile(this.path, JSON.stringify(borrado, null, '\t'));
                console.log('Producto Borrado');
                console.log(borrado);
                return borrado;
            }
        }

    editProduct = async(id) => {
        const products = await this.getProducts();
        const productIndex = products.find(e=>e.id === id);
        const newProduct = { id: id, ...productIndex }

        const index = products.findIndex(u => u.id === id)

        if (index != -1) {
            products[index-1] = newProduct;
            products.push(products[index-1]);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } else {
            throw new Error("Producto no encontrado");
        }
    }
}

export default ProductManager;