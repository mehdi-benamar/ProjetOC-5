export default class Products {
  /**
  * 
  * @param {array} productsTab 
  * @returns documentFragment
  */

  //création des éléments HTML de tous les produits pour la page d'accueil
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
    //création d'une image HTML
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
   // création d'un élément HTML
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
  //création d'un élément HTML "option"
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
  //création d'une liste de balise "option"
  insertOption(listOption) {
    let list = []
    for (let option of listOption) {
      list.push(this.createOptionTag("option", option, option))
    }
    return list
  }

  /**
   * 
   * @param {string} idParametre 
   * @param {string} color 
   * @param {string} quantity 
   * @returns void
   */
  //ajout d'un article dans le localstorage si celui-ci n'existe pas ou mise à jour de sa quantité
  addToBasket(idParametre, color, quantity) {
    const qtt = parseInt(quantity)
    let product = {}
    const getItem = this.getLocalProduct("product")
    let findProduct

    if (!color && (qtt <= 0 || qtt > 100)) {
      alert("Vous devez choisir une couleur et une quantité")
      return
    }

    if (!color) {
      alert("Vous devez choisir une couleur")
      return
    }
    if (qtt <= 0 || qtt > 100) {
      alert("Vous devez saisir une quantité selon l'intervalle indiqué")
      return
    }

    product = { id: idParametre, color, qtt }

    if (getItem) {
      findProduct = getItem.find(obj => obj.id === idParametre && obj.color === color)
      if (findProduct != null && findProduct.id === idParametre) {
        findProduct.qtt += qtt

      } else {
        getItem.push(product)
      }
    }
    this.setLocalProduct("product", getItem)
    document.location.href = `${document.location.origin}/front/html/cart.html`
  }


  /**
   * 
   * @param {string} key 
   * @returns mixed
   */
  //obtenir les produits du localstorage
  getLocalProduct(key) {
    let basket = localStorage.getItem(key)
    return (basket != null) ? JSON.parse(basket) : []
  }

  /**
   * 
   * @param {string} key 
   * @param {mixed} tab 
   * @returns void
   */
  //insérer les produits dans le localstorage
  setLocalProduct(key, tab) {
    return localStorage.setItem(key, JSON.stringify(tab))
  }
}