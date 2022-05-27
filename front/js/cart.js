import FetchApi from "./class/FetchApi.js";
import Products from "./class/Products.js";

const api = new FetchApi("http://localhost:3000/api/products")
const productCart = new Products()
const getBasketProducts = JSON.parse(productCart.getLocalProduct("produit"))

api.getAllProducts().then(data => {
  for(let pdtApi of data){
    for(let pdtBasket of getBasketProducts){
      if(pdtApi._id === pdtBasket.id){

        console.log(`<p>${pdtBasket.color}</p><p>${pdtApi.price}</p>`);
      }
    }
  }
})