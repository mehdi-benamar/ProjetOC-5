import FetchApi from "./class/FetchApi.js";
import Products from "./class/Products.js";

const api = new FetchApi("http://localhost:3000/api/products")
const productCart = new Products()
const getBasketProducts = productCart.getLocalProduct("product")

const cart_items = document.querySelector("#cart__items")
const nbArticles = document.querySelector("#totalQuantity")
const totalPrice = document.querySelector("#totalPrice")

if (getBasketProducts) {
  for (let pdtBasket of getBasketProducts) {
    api.getAllProducts().then(allProductsApi => {

      for (let pdtApi of allProductsApi) {
        if (pdtBasket.id === pdtApi._id) {
          cart_items.innerHTML += `<article class="cart__item" data-id="${pdtBasket.id}" data-color="${pdtBasket.color}">
          <div class="cart__item__img">
            <img src="${pdtApi.imageUrl}" alt="${pdtApi.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${pdtApi.name}</h2>
              <p>${pdtBasket.color}</p>
              <p>${pdtApi.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${pdtBasket.qtt}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`
        }
      }
    })
  }
}
nbArticles.textContent = totalQuantityArticles(getBasketProducts)

function totalQuantityArticles(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.qtt).reduce((total, qtt) => total += qtt)
  } else {
    return 0
  }
}

function totalPriceArticles(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.price).reduce((total, qtt) => total += qtt)
  } else {
    return 0
  }
}

