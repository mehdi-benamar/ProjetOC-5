class Products {
  constructor(uriApi) {
    this.uriApi = uriApi
  }

  /**
   * 
   * @returns Promise
   */
  async getAllProducts() {
    let allProducts = []
    try {
      const fetchApi = await fetch(this.uriApi)
      const response = await fetchApi.json()
      const datas = response

      for(let data of datas){
      allProducts.push(data)
      }
      
    } catch (error) {
      console.log(error.message)
    }
    return allProducts
  }
  
  /**
   * 
   * @param {array} productsTab 
   * @returns documentFragment
   */

  HTMLallProducts(productsTab){
    const fragment = new DocumentFragment()
    for(let product of productsTab){
      const a = document.createElement("a")
      const article = document.createElement("article")
      const h3 = document.createElement("h3")
      const img = document.createElement("img")
      const p = document.createElement("p")

      a.href = `./product.html?id=${product._id}`

      img.src = product.imageUrl
      img.alt = product.altTxt
      h3.textContent = product.name
      h3.classList.add("productName")
      p.textContent = product.description
      p.classList.add("productDescription")

      article.appendChild(img)
      article.appendChild(h3)
      article.appendChild(p)

      a.appendChild(article)
      fragment.appendChild(a)

    }

     return fragment
  }
}


const section = document.querySelector("#items")
const products = new Products("http://localhost:3000/api/products")

products.getAllProducts()
.then(data => {
  const mainProducts = products.HTMLallProducts(data)
  section.appendChild(mainProducts)
})
