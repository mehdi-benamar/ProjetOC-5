import FetchApi from "./class/FetchApi.js"
import Products from "./class/Products.js"


const section = document.querySelector("#items")
const api = new FetchApi("http://localhost:3000/api/products")
const products = new Products()

api.getAllProducts()
.then(data => {
  const mainProducts = products.HTMLallProducts(data)
  section.appendChild(mainProducts)
})
