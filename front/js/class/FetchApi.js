export default class FetchApi {

  constructor(uriApi) {
    this.uriApi = uriApi
  }

  /**
   * 
   * @returns Promise
   */

  //Obtention de tous les articles de l'api
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

  //obtention d'un article de l'api
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
}

