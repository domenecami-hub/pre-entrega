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
        stock: 0,
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

function obtenerCarritoDelStorage() {
  try {
    const carrito = localStorage.getItem("misProductos");

      if (carrito == null) {
        return [];
      } else {
          return JSON.parse(carrito);
       }

  } catch (error) {
    console.error("No se pudieron obtener los datos del carrito");
    alert("No se pudieron obtener los datos del carrito");
    return [];

  } finally {
    console.log("Fin del bloque try-catch");
  }
}

const carrito = obtenerCarritoDelStorage();

const vaciarCarrito = document.getElementById("vaciar-carrito");
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensajeCarrito");
const inputBuscar = document.querySelector("#formulario input");
const formularioAgregar = document.getElementById("form-agregar");

function imprimirElementosEnHTML(productos) {
  const productosDOM = document.getElementById("productos");
  productosDOM.innerHTML = "";

  for (const producto of productos) {

    const { nombre, precio, categoria, stock, img, id } = producto;

    const card = document.createElement("div");
    card.classList.add("card");

    const estadoStock = stock > 0 ? "Disponible" : "Sin stock";

    card.innerHTML = `
      <img src="${img}" alt="${nombre}">
      <h3>${nombre}</h3>
      <p>Categoría: ${categoria}</p>
      <p>Precio: $${precio}</p>
      <p>Stock: ${stock}</p>
      <p>Estado: ${estadoStock}</p>
      <button class="card-boton" id="${nombre}${id}">Comprar</button>
    `;
    
    productosDOM.appendChild(card);

    const btnComprar = document.getElementById(`${nombre}${id}`);

    btnComprar.addEventListener("click", () =>
      agregarProductoAlCarrito(producto)
    );
  }
}

//Agregar productos al carrito

function agregarProductoAlCarrito(producto) {
  if (producto.stock > 0) {
    const productoCarrito = {
      ...producto,
      stock: 1
    };

    carrito.push(productoCarrito);
    producto.stock--;

    localStorage.setItem("misProductos", JSON.stringify(carrito));
    localStorage.setItem("productos", JSON.stringify(productos));

    mensaje.textContent = `Agregaste ${producto.nombre} al carrito`;

    imprimirCarritoEnHTML();
    imprimirElementosEnHTML(productos);

  } else {
    mensaje.textContent = `${producto.nombre} no tiene stock disponible`;
  }
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
      const producto = carrito[index];

      const productoOriginal = productos.find((item) => item.id === producto.id);

      if (productoOriginal) {
        productoOriginal.stock++;
      }
      carrito.splice(index, 1);

      localStorage.setItem("misProductos", JSON.stringify(carrito));
      localStorage.setItem("productos", JSON.stringify(productos));

      imprimirCarritoEnHTML();
      imprimirElementosEnHTML(productos);

      mensaje.textContent = "Producto eliminado del carrito";
    });
  });
}

vaciarCarrito.addEventListener("click", () => {
  for (const producto of carrito) {
    const productoOriginal = productos.find((item) => item.id === producto.id);

  if (productoOriginal) {
      productoOriginal.stock++;
    }
  }

  carrito.length = 0;

  localStorage.setItem("misProductos", JSON.stringify(carrito));
  localStorage.setItem("productos", JSON.stringify(productos));

  imprimirCarritoEnHTML();
  imprimirElementosEnHTML(productos);

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

setTimeout(() => {
  alert ("Bienvenido a nuestra tienda Zadira 👜. ¡Envío gratis en compras superiores a $100.000!")
}, 3000)

