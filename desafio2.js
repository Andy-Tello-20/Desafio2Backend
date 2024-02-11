const fs = require("fs")



class ProductManager {



    constructor(path) {
        this.path = path



    }
    //Metodos de la clase: Éstos debe poder agregar, consultar, modificar y eliminar un producto


    //Debe guardar objetos con el siguiente formato:
    // id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
    // title (nombre del producto)
    // description (descripción del producto)
    // price (precio)
    // thumbnail (ruta de imagen)
    // code (código identificador)
    // stock (número de piezas disponibles


    async addProduct(data) {

        const { title, description, price, thumbnail, code, stock } = data
        //validamos (por las dudas)
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios')
            return
        }

        //Antes de adherir un nuevo producto necesito saber si ya existe un archivo 

        const existFile = await request(this.path)
        const newProduct = {
            id: existFile.length + 1, //cuenta la cantidad de elementos o "productos" dentro del archivo y añade 1 unidad en el id
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }


        //el archivo ya tendria el nuevo contenido disponible pára ingresar
        existFile.push(newProduct)

        //guardar el archivo

        await saveinFile(this.path, existFile)



    }

    async getProducts() {
        // si request es una promesa debemos llamar a (getProducts) como una funcion asincrona utilizando "await" para esperar 

        const mostrarProductos = await request(this.path)
        return console.log(mostrarProductos)
    }


    async getProductById(id) {

        const lectura = await request(this.path)
        const buscarPorID = lectura.find((i) => {
            return i.id === id
        })

        if (buscarPorID) {
            console.log("el producto encontrado fue:", buscarPorID)

        } else {
            console.log("no se encontro ningun producto")
        }

    }

    async updateProduct(id, campo) {
        const lectura = await request(this.path)

        const buscarIndice = lectura.findIndex((i) => {
            return i.id === id
        })


        const { title } = lectura[buscarIndice]
        if (title) {
            lectura[buscarIndice].title = campo
            console.log("se ha cambiado el titulo del producto")
        }

        await saveinFile(this.path, lectura)


    }


    async deleteProduct(id) {

        const lectura = await request(this.path)
        const buscarIndicePorID = lectura.findIndex((i) => {
            return i.id === id
        })
        if (buscarIndicePorID) {
            lectura.splice([buscarIndicePorID], 1)
            console.log("se ha eliminado un producto")
        }
        await saveinFile(this.path, lectura)


    }
}

// para comprender el resultado de "request". El valor de request puede ser un array vacío [] si el archivo no existe, o una promesa que se resolverá con el contenido del archivo en formato JSON si el archivo existe.

const request = async (path) => {
    //si no existe retorna un array vacio
    if (!fs.existsSync(path)) {
        return []

    } else {
        // si existe, lee el archivo existente y retorna su contenido en formato JSON (parse= un objeto dentro de un array)
        try {
            const content = await fs.promises.readFile(path, 'utf-8')
            return JSON.parse(content)
        } catch (error) {
            console.log("ha ocurrido un error", error)
        }
    }
}



const saveinFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t')
    try {
        await fs.promises.writeFile(path, content, 'utf-8')
        console.log("Se han guardado los cambios")
    } catch (error) {
        console.log("ha ocurrido un error", error)
    }

}



async function test() {
    const product1 = new ProductManager("./products.json")

    const data = {
        title: "mesa",
        description: "de madera",
        price: 5000,
        thumbnail: "img1",
        code: 1234,
        stock: 5,
    }

    await product1.addProduct(data)
    await product1.getProducts()
    await product1.getProductById(5)
    await product1.updateProduct(7, "cama")
    await product1.deleteProduct(3)
}

test()