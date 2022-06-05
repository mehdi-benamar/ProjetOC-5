const paramaters = new URLSearchParams(document.location.search)
const idCommand = paramaters.get("idCommand")
const orderId = document.querySelector("#orderId")

if(idCommand){
  orderId.textContent = idCommand
}