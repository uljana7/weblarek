import './scss/styles.scss';
import { item, buyer } from './types';
import { Basket } from './components/model/Basket';
import { Buyer } from './components/model/Buyer';
import { Catalogue } from './components/model/Catalogue';
import { apiProducts } from './utils/data';
import {ApiInteraction} from './components/model/ApiInteraction.ts';
import { API_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';

//фейковые данные для тестирования класса покупателя
const testBuyerData: buyer = {
  payment: 'card',
  address: 'Москва, ул. Ленина, д. 10, кв. 5',
  email: 'example@mail.com',
  phone: '+79001234567'
};


//тестирование класса корзины
const testBasket = new Basket(apiProducts.items);
console.log('Изначально заполненная корзина', testBasket.Items.slice());
testBasket.addItem(apiProducts.items[0]);
console.log('После добавления часа в сутках', testBasket.Items.slice());
testBasket.deleteItem(apiProducts.items[1])
console.log('После удаления леденца', testBasket.Items.slice());
console.log('Есть ли час в сутках в корзине', testBasket.isItemInBasket(apiProducts.items[0].id));
console.log('Сумарная стоимость товаров',testBasket.getFullPrice())
console.log('колличество товаров в корзине ', testBasket.getTotalItemsCount())
console.log('поиск товара по реальному айди', testBasket.isItemInBasket(apiProducts.items[0].id))
console.log('поиск товара по несуществующему айди', testBasket.isItemInBasket('12345'))


//тестирование класса покупателя
const testBuyer = new Buyer(testBuyerData.payment, testBuyerData.address, testBuyerData.email, testBuyerData.phone);
console.log('созданный покупатель',testBuyer.getAllData())
console.log('ошибки валидации полей: ',testBuyer.validateAdress(), ',', testBuyer.validateEmail(), ',', testBuyer.validatePayment(), ',', testBuyer.validatePhone())
testBuyer.saveData('', '', 'неправильный@мейл', 'телефон')
console.log('попытались записать данные с ошибками:', testBuyer.getAllData())
console.log('ошибки валидации полей: ',testBuyer.validateAdress(), ',', testBuyer.validateEmail(), ',', testBuyer.validatePayment(), ',', testBuyer.validatePhone())
testBuyer.clearFields();
console.log('очистили поля', testBuyer.getAllData())

//тестирование класса католога
const testCatalogue = new Catalogue(apiProducts.items, apiProducts.items[0]);
console.log('список товаров в каталоге', testCatalogue.Items)
testCatalogue.ChoosenCard = apiProducts.items[2]
console.log('выбранный товар', testCatalogue.ChoosenCard)
console.log('поиск товара по реальному айди', testCatalogue.getItemById(apiProducts.items[0].id))
console.log('поиск товара по несуществующему айди', testCatalogue.getItemById('12345'))

//тестирование работы с сервером
const api = new Api(API_URL);
const testApi = new ApiInteraction(api);
const testApiCatalog = new Catalogue(apiProducts.items, apiProducts.items[0])
testApi.getProducts().then((result) => {
    console.log('Сырые данные с сервера:', result)
    if (result && result.items) {
      try {
        testApiCatalog.Items = result.items;
        console.log( 'извлеченные данные: ',JSON.stringify(testApiCatalog.Items)
        )
      } catch (error) {
        console.error('ошибка извлечения данных', error)
      }
    } else {
      console.error('ошибка в получении данных')
    }
  })
  .catch((error) => {
    console.error('ошибка в работе сервера',error)
  })