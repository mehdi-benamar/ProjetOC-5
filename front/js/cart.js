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
htmlProducts(getBasketApiProducts(api.getAllProducts(), getBasketProducts), cart_items)

getTotalPrice(getBasketApiProducts(api.getAllProducts(), getBasketProducts)).then(price => {
  totalBill.textContent = price * totalQuantityArticles(getBasketProducts)
})

nbArticles.textContent = totalQuantityArticles(getBasketProducts)

window.addEventListener("load", () => {
  getAllArticles(api.getAllProducts(), ".cart__item").then(articleElements => {
    for (let article of articleElements) {
      let getNewBasketDelete
      let getNewBasketChange
      const idArticle = article.dataset.id
      const colorArticle = article.dataset.color
      const deleteButton = article.children[1].lastElementChild.lastElementChild.children[0]
      const inputElem = article.children[1].lastElementChild.firstElementChild.children[1]

      inputElem.addEventListener("change", (e) => {
        getNewBasketChange = productCart.getLocalProduct("product")
        changeQuantity(getNewBasketChange, idArticle, colorArticle, parseInt(e.target.value))
        nbArticles.textContent = totalQuantityArticles(getNewBasketChange)
        getTotalPrice(getBasketApiProducts(api.getAllProducts(), getNewBasketChange)).then(price => {
          totalBill.textContent = price * totalQuantityArticles(getNewBasketChange)
        })
      })

      deleteButton.addEventListener("click", (e) => {
        removeArticles(getBasketProducts, idArticle, colorArticle)
        document.location.reload()
      })
    }
  })
})

//************************** controller pour les produits du panier ************************


//************************** controller asynchrone ************************

//récupère a la fois les éléments du localstorage et de l'api dont l'ID est le même
async function getBasketApiProducts(api, tabBasket) {
  const fetchApi = await api
  const tab = []
  if (tabBasket) {
    for (let dataBasket of tabBasket) {
      for (let data of fetchApi) {
        if (dataBasket.id === data._id) {
          tab.push({ ...dataBasket, data })
        }
      }
    }
  }
  return tab
}

//affiche les éléments HTML de chaque articles
async function htmlProducts(cb, htmlElem) {
  const res = await cb
  const datas = await res
  for (let data of datas) {
    htmlElem.innerHTML += cartHTML(data)
  }
}

//permet d'obtenir le prix total du panier
async function getTotalPrice(cb) {
  const res = await cb
  const datas = await res
  return totalPrice(datas);
}

//parcours tous éléments HTML crées une fois que l'appel à l'api soit chargé
async function getAllArticles(api, htmlElement) {
  const fetchApi = await api
  return (fetchApi != null) ? document.querySelectorAll(htmlElement) : console.log("aucun articles disponible !");
}
//************************** controller asynchrone ************************



//************************* controller pour le formulaire **********************************


firstName.addEventListener("input", debounce((e) => inputEventMessage(/^[a-zA-Z]{3,}$/, e, errorFirstName, "Prénom incorrecte")))
lastName.addEventListener("input", debounce((e) => inputEventMessage(/^[a-zA-Z]{3,}$/, e, errorLastName ,"Nom incorrecte")))
address.addEventListener("input", debounce((e) => inputEventMessage(/^[a-zA-Z0-9 ]+$/, e, errorAddress ,"Adresse incorrecte")))
city.addEventListener("input", debounce((e) => inputEventMessage(/^[a-zA-Z]{3,}$/, e, errorCity ,"Ville incorrecte")))
email.addEventListener("input", debounce((e) => inputEventMessage(/^[a-zA-Z0-9_\-.]+@[a-z]{3,}\.[a-z]{2,5}$/, e, errorEmail ,"Email incorrecte")))



//création de l'ID de la commande et redirection vers la page confirmation
validateForm.addEventListener("submit", (e) => {

  e.preventDefault()
  const contact = {}
  const dataPost = {}
  const formData = new FormData(form)
  const idListApi = listId(productCart.getLocalProduct("product"))

  if (idListApi >= 1) {
    for (let [key, value] of formData.entries()) {
      contact[key] = value
    }

    dataPost.contact = contact
    dataPost.products = idListApi

    const objFetch = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(dataPost)
    }

    fetch("http://localhost:3000/api/products/order", objFetch).then(res => res.json())
      .then(data => {
        localStorage.clear()
        document.location.href = `${document.location.origin}/front/html/confirmation.html?idCommand=${data.orderId}`
      })
      .catch(e => console.log(e))
  } else {
    alert("Panier vide !")
    return
  }
})

// ************************ controller formulaire ************************************



// liste des fonctions

//vérifie la validité de la saisie utilisateur en envoyant un message d'erreur
function inputEventMessage(regex, event, errorElement, message){
  const re = regex
  const value = event.target.value.match(re)
  if (!value) {
    errorElement.textContent = message;
  } else {
    errorElement.textContent = ""
  }
}

//calcule la quantité totale des articles dans le panier
function totalQuantityArticles(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.qtt).reduce((total, qtt) => total += qtt, 0)
  } else {
    return 0
  }
}

//permet d'obtenir le prix total
function totalPrice(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.data.price).reduce((total, price) => total += price, 0)
  } else {
    return 0
  }
}

//permet de changer la quantité et de la mettre à jour pour l'article en question
function changeQuantity(basket, dataSetId, dataSetColor, quantity) {
  let updateItems
  if (basket.length >= 1) {
    updateItems = basket.find(obj => obj.id === dataSetId && obj.color === dataSetColor)
    if (updateItems !== null && updateItems.id === dataSetId) {
      updateItems.qtt = quantity
    }
  } else {
    return 0
  }
}

//liste des ID des articles
function listId(listBasket) {
  if (listBasket.length >= 1) {
    return listBasket.map(product => product.id)
  } else {
    return []
  }
}

//suppression de ou des articles
function removeArticles(basket, dataSetId, dataSetColor) {
  if (basket.length >= 1) {
    const updateItems = basket.filter(obj => obj.id !== dataSetId || obj.color !== dataSetColor)
    productCart.setLocalProduct("product", updateItems)
  } else {
    return []
  }
}

//insertion des articles en générant le code HTML
function cartHTML(datas) {

  return `<article class="cart__item" data-id="${datas.id}" data-color="${datas.color}">
    <div class="cart__item__img">
      <img src="${datas.data.imageUrl}" alt="${datas.data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${datas.data.name}</h2>
        <p>${datas.color}</p>
        <p>${datas.data.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${datas.qtt}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

//fonction spéciale pour le debouncing (permet d'alleger les ressources via les événements)
function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}