import FetchApi from "./class/FetchApi.js";
import Products from "./class/Products.js";

const api = new FetchApi("http://localhost:3000/api/products")
const productCart = new Products()
const getBasketProducts = productCart.getLocalProduct("product")

//constante pour le panier
const cart_items = document.querySelector("#cart__items")
const cart_item = document.querySelectorAll(".cart__item")
const nbArticles = document.querySelector("#totalQuantity")
const totalBill = document.querySelector("#totalPrice")


//constante pour le formulaire
const validateForm = document.querySelector(".cart__order")
const form = document.querySelector(".cart__order__form")
const firstName = document.querySelector("#firstName")
const lastName = document.querySelector("#lastName")
const address = document.querySelector("#address")
const city = document.querySelector("#city")
const email = document.querySelector("#email")

//constante pour les erreurs de formulaire
const errorFirstName = document.querySelector("#firstNameErrorMsg")
const errorLastName = document.querySelector("#lastNameErrorMsg")
const errorAddress = document.querySelector("#addressErrorMsg")
const errorCity = document.querySelector("#cityErrorMsg")
const errorEmail = document.querySelector("#emailErrorMsg")


//************************** controller pour les produits du panier ************************
getBasketApiProducts(api.getAllProducts(), getBasketProducts, cart_items)

getAllArticles(api.getAllProducts(), ".deleteItem").then(deleteElements => {
  for(let deleteElem of deleteElements)
  deleteElem.addEventListener("click", (e) => {
    console.log(e);
    const idArticle = e.path[4]
    const colorArticle = e.path[4]
    removeArticles(getBasketProducts, idArticle.dataset.id, colorArticle.dataset.color)
    nbArticles.textContent = totalQuantityArticles(getBasketProducts)
    idArticle.remove()
  })
});

getAllArticles(api.getAllProducts(), ".itemQuantity").then(deleteElements => {
  for(let deleteElem of deleteElements)
  deleteElem.addEventListener("input", (e) => {
    const id = e.path[4].dataset.id
    const color = e.path[4].dataset.color
    const value = parseInt(e.target.value)
    changeQuantity(getBasketProducts, id, color, value)
    nbArticles.textContent = totalQuantityArticles(getBasketProducts)
  })
});
 
nbArticles.textContent = totalQuantityArticles(getBasketProducts)

async function getBasketApiProducts(api, tabBasket, cartItem){
  const fetchApi = await api
  if(tabBasket){
    for(let dataBasket of tabBasket){
      for(let data of fetchApi){
        if(dataBasket.id === data._id){
          cartItem.innerHTML += cartHTML(dataBasket, data)
        }
      }
    }
  }
}

async function getAllArticles(api, htmlElement) {
  const fetchApi = await api
  return (fetchApi !== null) ? document.querySelectorAll(htmlElement) : console.log("aucun articles disponible !");
}

//************************** controller pour les produits du panier ************************

//************************* controller pour le formulaire **********************************

firstName.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  if (!value) {
    errorFirstName.textContent = "Donnée incorrecte, vous devez saisir un prénom correcte";
  } else {
    errorFirstName.textContent = ""
  }
}))


lastName.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  if(!value){
    errorLastName.textContent = "Donnée incorrecte, vous devez saisir un nom correcte";
  }else{
    errorLastName.textContent = ""
  }
}))


address.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z0-9 ]+$/
  const value = e.target.value.match(re)
  if(!value){
    errorAddress.textContent = "Donnée incorrecte, vous devez saisir une adresse correcte";
  }else{
    errorAddress.textContent = ""
  }
}))

city.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z]{3,}$/
  const value = e.target.value.match(re)
  if (!value) {
    errorCity.textContent = "Donnée incorrecte, vous devez saisir une ville correcte";
    return
  } else {
    errorCity.textContent = ""
  }
}))


email.addEventListener("input", debounce((e) => {
  const re = /^[a-zA-Z0-9_\-.]+@[a-z]{3,}\.[a-z]{2,5}$/
  const value = e.target.value.match(re)
  if (!value) {
    emailErrorMsg.textContent = "Donnée incorrecte, vous devez saisir un email correct";
  } else {
    emailErrorMsg.textContent = ""
  }
}))

//création de l'ID de la commande et redirection vers la page confirmation
validateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const contact = {}
  const dataPost = {}
  const formData = new FormData(form)
  const idListApi = listId(getBasketProducts)
  if(!getBasketProducts){
    alert("panier vide !")
    return
  }

    for(let [key, value] of formData.entries()){
      contact[key] = value
    }
  
    dataPost.contact = contact
    dataPost.products = idListApi
  
    const objFetch = {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(dataPost)
    }
  
    fetch("http://localhost:3000/api/products/order", objFetch).then(res => res.json())
    .then(data => {
        localStorage.clear()
        document.location.href = `./../html/confirmation.html?idCommand=${data.orderId}`
    })
    .catch(e => console.log(e))
    
    
})

// ************************ controller formulaire ************************************



// liste des fonctions
function totalQuantityArticles(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.qtt).reduce((total, qtt) => total += qtt)
  } else {
    return 0
  }
}

function changeQuantity(basket, dataSetId, dataSetColor, quantity) {
  if (basket.length >= 1) {
    const updateItems = basket.find(obj => obj.id === dataSetId && obj.color === dataSetColor)
    if(updateItems != null && updateItems.id === dataSetId){
      updateItems.qtt = quantity
    }
  } else {
    return []
  }
}

function listId(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.id)
  } else {
    return []
  }
}

function priceTotalQtt(price) {
  totalPrice = 0
  if (price >= 1) {
    totalPrice += price
  } else {
    return 0
  }
  return totalPrice
}

function removeArticles(basket, dataSetId) {
  if (basket.length >= 1) {
    const updateItems = basket.filter(obj => obj.id !== dataSetId)
    productCart.setLocalProduct("product", updateItems)
  } else {
    return []
  }
}

function cartHTML(basket, api) {


  return `<article class="cart__item" data-id="${basket.id}" data-color="${basket.color}">
    <div class="cart__item__img">
      <img src="${api.imageUrl}" alt="${api.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${api.name}</h2>
        <p>${basket.color}</p>
        <p>${api.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket.qtt}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

function itemArticle({id, color}){
  const article = document.createElement("article")
  article.setAttribute("data-id", id)
  article.setAttribute("data-color", color)
  article.classList.add("cart__item")
  article.appendChild(itemImg())
  article.appendChild(itemContent())
  return article
}

function itemImg(){
  const div = document.createElement("div")
  const img = document.createElement("img")
  div.classList.add("cart__item__img")
  div.appendChild(img)
  return div

}

function itemContent(){
  const div = document.createElement("div")
  div.classList.add("cart__item__content")
  div.appendChild(itemContentDescription())
  div.appendChild(itemContentSettings())
  return div
}

function itemContentDescription(){
  const div = document.createElement("div")
  const h2 = document.createElement("h2")
  const p = document.createElement("p")
  const p2 = document.createElement("p")

  div.classList.add("cart__item__content__description")
  p.textContent = ""

  div.appendChild(h2)
  div.appendChild(p)
  div.appendChild(p2)

 return div
}

function itemContentSettings(){
  const div = document.createElement("div")
  div.classList.add("cart__item__content__settings")
  div.appendChild(itemQuantity())
  div.appendChild(itemDelete())

  return div
}

function itemQuantity(){
  const div = document.createElement("div")
  const p = document.createElement("p")
  div.classList.add("cart__item__content__settings__quantity")

  p.textContent = "Qté : "

  div.appendChild(p)
  div.appendChild(createInput())

  return div
}

function itemDelete(){
  const div = document.createElement("div")
  const p = document.createElement("p")
  div.classList.add("cart__item__content__settings__delete")
  p.classList.add("deleteItem")
  p.textContent = "Supprimer"

  div.appendChild(p)

  return div

}

function createInput() {
  const input = document.createElement("input")
  input.type = "number"
  input.classList.add("itemQuantity")
  input.name = "itemQuantity"
  input.min = "1"
  input.max = "100"
  input.value = ""
  return input
}

//fonction spéciale pour le debouncing
function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}