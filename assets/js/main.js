'use strict';

const addtocart_btns = document.querySelectorAll('[data-action="add-to-cart"]');
const cart_dom = document.querySelector('.cart-items-dom');
let cart_items = JSON.parse(localStorage.getItem('cart_items')) || [];

/* Add HTML TO CART */
function additemto_cartDOM(cart_item) {
  const { name, image, price, quantity } = cart_item;
  cart_dom.insertAdjacentHTML(
    'beforeend',
    `
    <div class="cart-item">
      <img class="cart-item-image" src="${image}" alt="${name}"/>
      <h3 class="cart-item-name">${name}</h3>
      <h3 class="cart-item-price">Rs ${price}</h3> 
      <div class="cart-item-actions">
        <button class="btn btn-primary" data-action="dec_item">&minus;</button>
        <h3 class="cart-item-quantity">${quantity}</h3>
        <button class="btn btn-primary" data-action="inc_item">&plus;</button>
        <button class="btn btn-danger ml-1" data-action="remove_item">&times;</button>
      </div>
    </div>
  `
  );
  clearcart();
  get_total();
}
/*  Save To Local Strage */
function savestorage() {
  get_total();
  localStorage.setItem('cart_items', JSON.stringify(cart_items));
}
/* Handle Cart Actions */
function handlecartaction(addtocart_btn, product) {
  /* Change  add to cart button text */
  addtocart_btn.innerText = 'In Cart';
  addtocart_btn.disabled = true;
  /* Cart Items Actions */
  const cart_items_dom = cart_dom.querySelectorAll('.cart-item');
  cart_items_dom.forEach(cart_item_dom => {
    if (
      cart_item_dom.querySelector('.cart-item-name').innerText === product.name
    ) {
      const cart_inc_btn = cart_item_dom.querySelector(
        '[data-action="inc_item"]'
      );
      const cart_dec_btn = cart_item_dom.querySelector(
        '[data-action="dec_item"]'
      );
      const cart_remove_btn = cart_item_dom.querySelector(
        '[data-action="remove_item"]'
      );
      /* Increase quantity */
      cart_inc_btn.addEventListener('click', function() {
        cart_items.forEach(cart_item => {
          if (cart_item.name === product.name) {
            cart_item_dom.querySelector(
              '.cart-item-quantity'
            ).innerText = ++cart_item.quantity;
            /* Save to LocalStorage */
            savestorage();
          }
        });
      });
      /* Decrease quantity */
      cart_dec_btn.addEventListener('click', function() {
        cart_items.forEach(cart_item => {
          if (cart_item.name === product.name) {
            if (cart_item.quantity > 1) {
              cart_item_dom.querySelector(
                '.cart-item-quantity'
              ).innerText = --cart_item.quantity;
              /* Save to LocalStorage */
              savestorage();
            }
          }
        });
      });
      /** Remove Item */
      cart_remove_btn.addEventListener('click', function() {
        cart_items.forEach(cart_item => {
          if (cart_item.name === product.name) {
            cart_item_dom.remove();
            cart_items = cart_items.filter(
              cart_item => cart_item.name !== product.name
            );
            addtocart_btn.innerText = 'Add To Cart';
            addtocart_btn.disabled = false;
            /* Remove Cart Footer */
            if (cart_items.length < 1) {
              document.querySelector('.cart-footer--cart').remove();
              document.querySelector('.items-total').remove();
            }
            /* Save to LocalStorage */
            savestorage();
          }
        });
      });
    }
  });
}
/* Clear Cart */
function clearcart() {
  if (document.querySelector('.cart-footer--cart') === null) {
    cart_dom.insertAdjacentHTML(
      'afterend',
      `<div class="cart-footer--cart">
         <button type="button" class="btn btn-danger" data-action="clear_cart" >Clear Cart</button>
         <button type="button" class="btn btn-primary" data-action="go_checkout" >Go Checkout</button>
      </div>`
    );
    /* Clear Cart */
    document
      .querySelector('[data-action="clear_cart"]')
      .addEventListener('click', function() {
        cart_dom.querySelectorAll('.cart-item').forEach(function(cartDOM) {
          cartDOM.remove();
        });
        cart_items = [];
        /* Remove Save Storage */
        localStorage.removeItem('cart_items');
        /* Remove Cart Footer */
        document.querySelector('.cart-footer--cart').remove();
        document.querySelector('.items-total').innerText = '';
        document.querySelector('.items-total').classList.remove('badge');
        /* Set Add To Cart Button */
        addtocart_btns.forEach(addtocart_btn => {
          addtocart_btn.innerText = 'Add To Cart';
          addtocart_btn.disabled = false;
        });
      });
    /* GO Checkout */
    document
      .querySelector('[data-action="go_checkout"]')
      .addEventListener('click', function() {});
  }
}
/* Get Total */
function get_total() {
  let cartTotal = 0;
  let cartTotalQuantity = 0;
  if (cart_items.length > 0) {
    cart_items.forEach(cart_item => {
      cartTotal += cart_item.quantity * cart_item.price;
      cartTotalQuantity += cart_item.quantity;
    });
    console.log(cartTotalQuantity);
    document.querySelector(
      '[data-action="go_checkout"]'
    ).innerText = `Total: RS ${cartTotal} Checkout`;
    document.querySelector('.items-total').innerText = `${cartTotalQuantity}`;
    document.querySelector('.items-total').classList.add('badge');
  }
}

/* Go Checkout */
function go_checkout() {}
/* Display from LocalStorage */
if (cart_items.length > 0) {
  cart_items.forEach(cart_item => {
    /* Add HTML TO CART */
    additemto_cartDOM(cart_item);
    addtocart_btns.forEach(function(addtocart_btn) {
      const productDOM = addtocart_btn.parentNode.parentNode;
      if (
        productDOM.querySelector('.product-name').innerText === cart_item.name
      ) {
        /* Handle Cart Actions */
        handlecartaction(addtocart_btn, cart_item);
      }
    });
  });
}
/* Add To Cart Items */
addtocart_btns.forEach(function(addtocart_btn) {
  addtocart_btn.addEventListener('click', () => {
    const productDOM = addtocart_btn.parentNode.parentNode;
    const product = {
      name: productDOM.querySelector('.product-name').innerText,
      price: productDOM.querySelector('.product-amount').innerText,
      image: productDOM.querySelector('.product-img').src,
      quantity: 1
    };
    const { name } = product;
    /* Checks Duplicate Item On Cart */
    const is_in_cart =
      cart_items.filter(cart_item => cart_item.name === name).length > 0;
    if (!is_in_cart) {
      /* Insert Element to Cart */
      additemto_cartDOM(product);
      /* Push to an Array */
      cart_items.push(product);
      savestorage();
      /* Handle Cart Actions */
      handlecartaction(addtocart_btn, product);
    }
  });
});
