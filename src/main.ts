import './scss/styles.scss';

import { Catalog } from './components/base/Models/Catalog';

import { Cart } from './components/base/Models/Cart';

import { Buyer } from './components/base/Models/Buyer';

import { apiProducts } from './utils/data'

import { Communication } from './components/base/Models/Communication';

import { Api } from './components/base/Api';

import { API_URL } from './utils/constants';


const productsModel = new Catalog();

productsModel.setProducts(apiProducts.items);

console.log(productsModel.getProducts());

console.log(productsModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

productsModel.setSelectedProduct(apiProducts.items[1]);

console.log(productsModel.getSelectedProduct());



const cartModel = new Cart();

cartModel.addItem(apiProducts.items[0]);

cartModel.addItem(apiProducts.items[1]);

cartModel.addItem(apiProducts.items[2]);

console.log(cartModel.getItems());

cartModel.deleteItem(apiProducts.items[2]);

console.log(cartModel.getItems());

console.log(cartModel.getTotalPrice());

console.log(cartModel.getItemsCount());

console.log(cartModel.checkHasItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));

cartModel.clearCart();

console.log(cartModel.getItems());



const buyerModel = new Buyer();


buyerModel.setPayment('card');

buyerModel.setAddress('Ленина,20');

buyerModel.setEmail('example@gmail.com');

buyerModel.setPhone('');

console.log(buyerModel.getData());

console.log(buyerModel.checkForm());

buyerModel.clearData();

console.log(buyerModel.getData());



const api = new Api (API_URL);

const communication = new Communication(api);

communication.getProducts()
  .then(products => {
    productsModel.setProducts(products);
    console.log('Каталог товаров:', productsModel.getProducts());
  })
  .catch (error => {
    console.log('Ошибка получения списка товаров', error)
  })

