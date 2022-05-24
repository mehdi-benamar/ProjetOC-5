export default class Products {
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

      for (let data of datas) {
        allProducts.push(data)
      }

    } catch (error) {
      console.log(error.message)
    }
    return allProducts
  }

  /**
   * 
   * @returns Promise
   */

  async getOneProduct() {
    try {
      const fetchApi = await fetch(this.uriApi)
      const response = await fetchApi.json()
      const data = response
      return data

    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * 
   * @param {array} productsTab 
   * @returns documentFragment
   */

  HTMLallProducts(productsTab) {
    const fragment = new DocumentFragment()
    for (let product of productsTab) {
      const a = document.createElement("a")
      const article = document.createElement("article")
      const h3 = this.createElementTag("h3", product.name)
      const img = this.createImageTag("img", product.imageUrl, product.altTxt)
      const p = this.createElementTag("p", product.description)

      a.href = `./product.html?id=${product._id}`

      h3.classList.add("productName")
      p.classList.add("productDescription")

      article.appendChild(img)
      article.appendChild(h3)
      article.appendChild(p)

      a.appendChild(article)
      fragment.appendChild(a)

    }

    return fragment
  }

  /**
   * 
   * @param {string} elementTag 
   * @param {string} source 
   * @param {string} altTexte 
   * @returns HTMLElement
   */
  createImageTag(elementTag, source, altTexte) {
    const tag = document.createElement(elementTag)
    tag.src = source
    tag.alt = altTexte
    return tag
  }

  /**
    * 
    * @param {string} elementTag 
    * @param {string} content 
    * @returns HTMLElement
    */
  createElementTag(elementTag, content) {
    const tag = document.createElement(elementTag)
    tag.textContent = content
    return tag
  }

  /**
   * 
   * @param {string} elementTag 
   * @param {string} value 
   * @param {string} text 
   * @returns HTMLElement
   */
  createOptionTag(elementTag, value, text) {
    const tag = document.createElement(elementTag)
    tag.value = value
    tag.textContent = text
    return tag
  }

  /**
   * 
   * @param {array} listOption 
   * @returns array[HTMLElements]
   */
  insertOption(listOption) {
    let list = []
    for (let option of listOption) {
      list.push(this.createOptionTag("option", option, option))
    }
    return list
  }
}

