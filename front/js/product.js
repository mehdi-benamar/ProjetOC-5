import FetchApi from "./class/FetchApi.js"
import Products from "./class/Products.js"

const item__img = document.querySelector(".item__img")
const title = document.querySelector("#title")
const prix = document.querySelector("#price")
const descript = document.querySelector("#description")
const selectOptions = document.querySelector("#colors")
const addButton = document.querySelector("#addToCart")
const qtt = document.querySelector("#quantity")

// let productList = []

const parametresList = new URLSearchParams(document.location.search)
const idParametre = parametresList.get("id")

if (!idParametre) {
  document.location.href = "./../html/index.html"
}

const api = new FetchApi(`http://localhost:3000/api/products/${idParametre}`)
const oneProduct = new Products()

api.getOneProduct().then(dataProduct => {
  const { _id, altTxt, colors, description, imageUrl, name, price } = dataProduct

  if(idParametre !== _id){
    document.location.href = "./../html/index.html"
    return
  }

  //ajout de l'image du produit
  
  const imageProduct = oneProduct.createImageTag("img", imageUrl, altTxt)
  item__img.appendChild(imageProduct)

  //ajout du titre et le prix du produit
  
  title.textContent = name
  prix.textContent = price

  //ajout de la description du produit
  
  descript.textContent = description

  //ajout des options de couleur
  
  const colorList = oneProduct.insertOption(colors)
  for (let color of colorList) {
    selectOptions.appendChild(color)
  }
})

addButton.addEventListener("click", () => oneProduct.addToBasket(idParametre, selectOptions.value, qtt.value))
