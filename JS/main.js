async function cargarProductos() {
  try {
    const respuesta = await fetch("./data/data.json");

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    const productosJSON = await respuesta.json();

    if (productos.length === 0) {
      productos.push(...productosJSON);

      localStorage.setItem("productos", JSON.stringify(productos));

      imprimirElementosEnHTML(productos);
    }

    console.log(productosJSON);

  } catch (error) {
    console.error(error);
  }
}

const productos = JSON.parse(localStorage.getItem("productos")) ?? [];

function obtenerCarritoDelStorage() {
  try {
    const carrito = localStorage.getItem("misProductos");

      if (carrito == null) {
        return [];
      } else {
          return JSON.parse(carrito);
       }

  } catch (error) {
      Toastify({
        text: "No se pudieron obtener los datos del carrito",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast()
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

    Toastify({
      text: `${producto.nombre} agregado al carrito 👜`,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
      background: "linear-gradient(to right, #8d726e, #efd8de)",
      },
    }).showToast();

    imprimirCarritoEnHTML();
    imprimirElementosEnHTML(productos);

  } else {
    Toastify({
      text: `${producto.nombre} sin stock 😔`,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
      background: "linear-gradient(to right, #8d726e)",
      },
    }).showToast();
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

cargarProductos();

imprimirElementosEnHTML(productos);

imprimirCarritoEnHTML();


setTimeout(() => {
  Swal.fire({
    title: "¡Bienvenido a Zadira! 👜",
    text: "Envío gratis en compras superiores a $100.000.",
    timer: 3000,
    showConfirmButton: false
  });
}, 3000);