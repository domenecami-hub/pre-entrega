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

    return [];
  }
}

const carrito = obtenerCarritoDelStorage();

function calcularTotal() {
  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.precio;
    }, 0);

  return total;
}

function imprimirTotal() {
  const totalCarrito = document.getElementById("total-carrito");

  totalCarrito.textContent = `Total: $${calcularTotal()}`;
}

function imprimirCarritoEnHTML() {
  const listaCarrito = document.getElementById("listaDeCarrito");
  listaCarrito.innerHTML = "";

  for (const [index, producto] of carrito.entries()) {
    const { nombre, precio } = producto;

    const item = document.createElement("li");

    item.innerHTML = `
      ${nombre}: $${precio}
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;

    listaCarrito.appendChild(item);
  }

  agregarEventosEliminar();
  imprimirTotal();
}

function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const index = Number(boton.dataset.index);

      carrito.splice(index, 1);

      localStorage.setItem("misProductos", JSON.stringify(carrito));

      imprimirCarritoEnHTML();
    });
  });
}

const vaciarCarrito = document.getElementById("vaciar-carrito");

const continuarCompra = document.getElementById("continuar-compra");

continuarCompra.addEventListener("click", () => {
  const total = calcularTotal();

  Swal.fire({
    title: "¿Querés continuar con tu compra?",
    text: `El total de tu compra es $${total}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar"
  }).then((resultado) => {

    if (resultado.isConfirmed) {
      Swal.fire({
        title: "¡Compra realizada! 👜",
        text: "Gracias por comprar en Zadira.",
        icon: "success"
      });
    }

  });
});

vaciarCarrito.addEventListener("click", () => {
    carrito.length = 0;

  localStorage.setItem("misProductos", JSON.stringify(carrito));

  imprimirCarritoEnHTML();
});

imprimirCarritoEnHTML();