import Products from "./ProductsClass.js"

const parametresList = new URLSearchParams(document.location.search)
const idParametre = parametresList.get("id")

if (!idParametre) {
  alert("aucun produit existant !")
}

const oneProduct = new Products(`http://localhost:3000/api/products/${idParametre}`)

oneProduct.getOneProduct().then(dataProduct => {
  const { _id, altTxt, colors, description, imageUrl, name, price } = dataProduct

  //ajout de l'image du produit
  const item__img = document.querySelector(".item__img")
  const imageProduct = oneProduct.createImageTag("img", imageUrl, altTxt)
  item__img.appendChild(imageProduct)

  //ajout du titre et le prix du produit
  const title = document.querySelector("#title")
  const prix = document.querySelector("#price")
  title.textContent = name
  prix.textContent = price

  //ajout de la description du produit
  const descript = document.querySelector("#description")
  descript.textContent = description

  //ajout des options de couleur
  const selectOptions = document.querySelector("#colors")
  const colorList = oneProduct.insertOption(colors)
  for (let color of colorList) {
    selectOptions.appendChild(color)
  }
})