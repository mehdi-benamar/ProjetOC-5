import Products from "./ProductsClass.js"


const section = document.querySelector("#items")
const products = new Products("http://localhost:3000/api/products")

products.getAllProducts()
.then(data => {
  const mainProducts = products.HTMLallProducts(data)
  section.appendChild(mainProducts)
})
