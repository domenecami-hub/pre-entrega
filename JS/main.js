const productosIniciales = [
    {
        id: 1, 
        nombre: "Pulsera", 
        precio: 6000, 
        categoria: "Accesorios", 
        stock: 15,
        img: "./assets/Pulsera-pasador-publi.png"
    },
    {
        id: 2, 
        nombre: "Cartera Boho",
        precio: 80000, 
        categoria: "Bags",
        stock: 4,
        img: "./assets/cartera-boho-beige.jpg.jpeg"
    },
    {
        id: 3,
        nombre: "Billetera tipo sobre", 
        precio: 30000, categoria: "Accesorios", 
        stock: 1, 
        img: "./assets/Billetera-Publi.jpeg"
    },
    {
        id: 4, 
        nombre: "Top Preta", 
        precio: 55000, 
        categoria: "Indumentaria", 
        stock: 3, 
        img: "./assets/Top-preta-publi.jpg.jpeg"
    },
    {
        id: 5,
        nombre: "Top Musa",
        precio: 60000,
        categoria: "Indumentaria",
        stock: 5,
        img: "./assets/top-musa-publi.jpg.jpeg"
    },
    {
        id: 6,
        nombre: "Top Duna",
        precio: 65000,
        categoria: "Indumentaria",
        stock: 2,
        img: "./assets/top-duna-publi.jpg.jpeg"
    },
    {
        id: 8,
        nombre: "Top Sia",
        precio: 60000,
        categoria: "Indumentaria",
        stock: 2,
        img: "./assets/top-sia-publi.jpg.jpeg"
    },
    {
        id: 9,
        nombre: "Mini falda",
        precio: 65000,
        categoria: "Indumentaria",
        stock: 2,
        img: "./assets/falda-publi.jpg.jpeg"
    },
    {
        id: 10,
        nombre: "Cartera Milan",
        precio: 80000,
        categoria: "Bags", 
        stock: 3,
        img: "./assets/carteraMilanpubli.jpg.jpeg"
    }
];

const productos = JSON.parse(localStorage.getItem("productos")) ?? productosIniciales;

const carrito = JSON.parse(localStorage.getItem("misProductos")) ?? [];

const vaciarCarrito = document.getElementById("vaciar-carrito");
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensajeCarrito");
const inputBuscar = document.querySelector("#formulario input");
const formularioAgregar = document.getElementById("form-agregar");

function imprimirElementosEnHTML(productos) {
  const productosDOM = document.getElementById("productos");
  productosDOM.innerHTML = "";

  for (const producto of productos) {
    const card = document.createElement("div");
    card.classList.add("card");

    const estadoStock = producto.stock > 0 ? "Disponible" : "Sin stock";

    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Categoría: ${producto.categoria}</p>
      <p>Precio: $${producto.precio}</p>
      <p>Stock: ${producto.stock}</p>
      <p>Estado: ${estadoStock}</p>
      <button class="card-boton" id="${producto.nombre}${producto.id}">Comprar</button>
    `;

    productosDOM.appendChild(card);

    const btnComprar = document.getElementById(
      `${producto.nombre}${producto.id}`
    );

    btnComprar.addEventListener("click", () =>
      agregarProductoAlCarrito(producto)
    );
  }
}

//Agregar productos al carrito

function agregarProductoAlCarrito(producto) {
  carrito.push(producto);

  localStorage.setItem("misProductos", JSON.stringify(carrito));

  mensaje.textContent = `Agregaste ${producto.nombre} al carrito`;

  imprimirCarritoEnHTML();
}


function imprimirCarritoEnHTML() {
  const listaCarrito = document.getElementById("listaDeCarrito");
  listaCarrito.innerHTML = "";

  for (const [index, producto] of carrito.entries()) {
    const { nombre, precio } = producto;
    const item = document.createElement("li");

    item.innerHTML = `
        ${nombre}: $${precio}
        <button class="btn-eliminar" data-index="${index}"> Eliminar </button>
    `;

    listaCarrito.appendChild(item);
  }

  agregarEventosEliminar();

}

function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach((boton) => {

    boton.addEventListener("click", () => {

        const index = Number(boton.dataset.index);

        carrito.splice(index, 1);

        localStorage.setItem("misProductos", JSON.stringify(carrito));

        imprimirCarritoEnHTML();

        mensaje.textContent = "Producto eliminado del carrito";
    });
  });
}

vaciarCarrito.addEventListener("click", () => {
  carrito.length = 0;
  localStorage.setItem( "misProductos", JSON.stringify(carrito) );

  imprimirCarritoEnHTML();

  mensaje.textContent = "Carrito vaciado";
});

formulario.addEventListener("submit", tomarDatosForm);

inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(texto)
  );

  imprimirElementosEnHTML(productosFiltrados);
});

function tomarDatosForm(e) {
  e.preventDefault();
  const textoBuscar = e.target[0].value;
  const productosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(textoBuscar.toLowerCase()));

  imprimirElementosEnHTML(productosFiltrados);

}

formularioAgregar.addEventListener("submit", agregarProducto);

function agregarProducto(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre-producto").value;
  const precio = Number(document.getElementById("precio-producto").value);
  const categoria = document.getElementById("categoria-producto").value;
  const stock = Number(document.getElementById("stock-producto").value);
  const imagen = document.getElementById("imagen-producto").value;
  

  const nuevoProducto = {
    id: Math.max(...productos.map(producto => producto.id)) + 1,
    nombre: nombre,
    precio: precio,
    categoria: categoria,
    stock: stock,
    img: imagen     
  };

  productos.push(nuevoProducto);
  localStorage.setItem( "productos", JSON.stringify(productos));

  imprimirElementosEnHTML(productos);

  formularioAgregar.reset();
}

imprimirElementosEnHTML(productos);

imprimirCarritoEnHTML();
