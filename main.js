const db = {
  methods: {
    find: (id) => {
      return db.items.find((item) => item.id === id);
    },
    remove: (items) => {
      items.forEach((item) => {
        const produect = db.methods.find(item.id);
        produect.qty = produect.qty - item.qty;
      });
      console.log(db);
    },
  },
  items: [
    {
      id: 0,
      title: "Funko Pop",
      price: 250,
      qty: 5,
    },
    {
      id: 1,
      title: "Harry Poter",
      price: 345,
      qty: 50,
    },
    {
      id: 2,
      title: "Phillips Hue",
      price: 1300,
      qty: 80,
    },
    {
      id: 3,
      title: "iPod",
      price: 6000,
      qty: 8,
    },
  ],
};

const shoppingCart = {
  items: [],
  methods: {
    add: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);

      if (cartItem) {
        if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
          cartItem.qty += qty;
        } else {
          alert("No hay inventario");
        }
      } else {
        shoppingCart.items.push({ id, qty });
      }
    },
    remove: (id, qty) => {
      const cartItem = shoppingCart.methods.get(id);
      if (cartItem.qty - qty > 0) {
        cartItem.qty -= qty;
      } else {
        shoppingCart.items = shoppingCart.items.filter((item) => item.id != id);
      }
    },
    count: () => {
      return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
    },
    get: (id) => {
      const index = shoppingCart.items.findIndex((item) => item.id === id);
      return index >= 0 ? shoppingCart.items[index] : null;
    },
    getTotal: () => {
      //let total = 0;
      const total = shoppingCart.items.reduce((acc, item) => {
        const found = db.methods.find(item.id);
        return (acc += found.price * item.qty);
      }, 0);
      return total;
    },
    hasInventory: (id, qty) => {
      return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    purchase: () => {
      db.methods.remove(shoppingCart.items);
      shoppingCart.items = [];
    },
  },
};

renderStore();

function renderStore() {
  const html = db.items.map((item) => {
    return `
        <div class="item">
            <div class="title">${item.title}</div>
            <div class="price">${numberToCurrency(item.price)}</div>
            <div class="qty">${item.qty}units</div>
            
            <div class="actions">
                <button class="add" data-id="${
                  item.id
                }">Add to Shopping CArt </button>
            </div>
        </div>`;
  });
  document.querySelector("#store-container").innerHTML = html.join("");

  document.querySelectorAll(".item .actions .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      // const id = button.getAttribute('data-id');
      const id = parseInt(button.getAttribute("data-id"));
      const item = db.methods.find(id);

      if (item && item.qty - 1 > 0) {
        //Agregar items a carrito de compras
        shoppingCart.methods.add(id, 1);
        // console.log(shoppingCart);
        rendershoppingCart();
      } else {
        console.log("Ya no hay inventario");
      }
    });
  });
}

function rendershoppingCart() {
  const html = shoppingCart.items.map((item) => {
    const dbItem = db.methods.find(item.id);
    return `
        <div class="item">
            <div class="title">${dbItem.title}</div>
            <div class="price">${numberToCurrency(dbItem.price)}</div>
            <div class="qty">${item.qty} units</div>
            <div class="subtotal">Subtotal: ${numberToCurrency(
              item.qty * dbItem.price
            )} units</div>
            <div class="actions">
                <button class="addOne" data-id="${item.id}"> + </button>
                <button class="removeOne" data-id="${item.id}"> - </button>
            </div>
        </div>
        `;
  });
  const closeButton = `
  <div clase="cat-header">
  <button class="bClose" > Close </button>
  </div>
  `;
  const purchaseButton =
    shoppingCart.items.length > 0
      ? `
  <div clase="cat-actions">
  <button class="bPurchase" id="bPurchase" > Purchase </button>
  </div>
  `
      : "";

  const total = shoppingCart.methods.getTotal();
  const totalContainer = `<div class="total">Total: ${numberToCurrency(
    total
  )}</div>`;

  const shoppingCartContainer = document.querySelector(
    "#shopping-cart-container"
  );

  shoppingCartContainer.classList.remove("hide");
  shoppingCartContainer.classList.add("show");

  shoppingCartContainer.innerHTML =
    closeButton + html.join("") + totalContainer + purchaseButton;

  document.querySelectorAll(".addOne").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      shoppingCart.methods.add(id, 1);
      rendershoppingCart();
    });
  });

  document.querySelectorAll(".removeOne").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      shoppingCart.methods.remove(id, 1);
      rendershoppingCart();
    });
  });

  document.querySelector(".bClose").addEventListener("click", (e) => {
    shoppingCartContainer.classList.remove("show");
    shoppingCartContainer.classList.add("hide");
  });

  //   document.querySelectorAll(".bPurchase").addEventListener("click", (e) => {});
  const bPurchase = document.querySelector(".bPurchase");
  if (bPurchase) {
    bPurchase.addEventListener("click", (e) => {
      shoppingCart.methods.purchase();
      renderStore();
      rendershoppingCart();
    });
  }
}

function numberToCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(n);
}
