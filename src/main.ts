import './scss/styles.scss';
import { BuyerInterface } from './types';
import { Basket } from './components/model/Basket';
import { Buyer } from './components/model/Buyer';
import { Catalogue } from './components/model/Catalogue';
import { apiProducts } from './utils/data';
import {ApiInteraction} from './components/model/ApiInteraction.ts';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';
import { EventEmitter, IEvents } from './components/base/Events.ts';
import { CardBasket } from './components/views/CardBasket.ts';
import { CardCatalog } from './components/views/CardCatalog.ts';
import { CardPreview } from './components/views/CardPreview.ts';
import { Form } from './components/views/Form.ts';
import { FormOrder } from './components/views/FormOrder.ts';
import { Gallery } from './components/views/Gallery.ts';
import { Header } from './components/views/Header.ts';
import { ModalContainer } from './components/views/ModalContainer.ts';
import { Success } from './components/views/Success.ts';
import { Basket as BasketView} from './components/views/Basket.ts';
import { ensureElement, cloneTemplate } from './utils/utils.ts';
import { FormContact } from './components/views/FormContact.ts';
import { EventList } from './components/base/Events.ts';
import { Item, Payment } from './types';


//class Presenter{

  /*private basketView: BasketView;
  private cardPreview: CardPreview;
  private formOrder: FormOrder;
  private formContact: FormContact;
  private gallery: Gallery;
  private header: Header;
  private modalContainer: ModalContainer;
  private success: Success;

  private basket: Basket;
  private buyer: Buyer;
  private catalog: Catalogue;
  private apiInteraction: ApiInteraction;
  private api: Api;
  private events: EventEmitter;

  constructor(){*/
    const events = new EventEmitter();
    const basketContainer = cloneTemplate('#basket')
    const basketView = new BasketView(events, basketContainer);    
    const cardPreviewContainer = cloneTemplate('#card-preview')
    const cardPreview = new CardPreview(events, cardPreviewContainer);
    const formOrderContainer = cloneTemplate('#order')
    const formOrder = new FormOrder(events, formOrderContainer);
    const formContactContainer = cloneTemplate('#contacts')
    const formContact = new FormContact(events, formContactContainer);
    const headerContainer = ensureElement<HTMLElement>('.header')
    const header = new Header(events, headerContainer);
    
    const modalContainerContainer = ensureElement<HTMLElement>('.modal')
    const modalContainer = new ModalContainer(events, modalContainerContainer);
    const successContainer = cloneTemplate('#success')
    const success = new Success(events, successContainer);
    const galleryContainer = ensureElement<HTMLElement>('.gallery')
    const gallery = new Gallery(events, galleryContainer);
    
    const basket = new Basket(events);
    const buyer = new Buyer(events);
    const catalog = new Catalogue(events);
    const api = new Api(API_URL);
    const apiInteraction = new ApiInteraction(api)

    getServerData()
    header.render();
    gallery.render();
    onEvents()
    
  //}

  function onEvents(){
    events.on('catalog:changed', () => {
      gallery.catalog = catalog.getItems().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(events, cardTemplate, {onClick: () => events.emit(EventList.CatalogSaveChoosenCard, item)}).render({
          category: item.category,
          title: item.title,
          price: item.price,
          image: CDN_URL + item.image,
        })
      })
      console.log('событие изменения каталога произошло')
    })

    events.on('catalog:chooseCard', (item: Item) => {
      catalog.setChoosenCard(item)
      console.log('событие сохранения карточки произошло', catalog.getChoosenCard(), basket.getItems())
    })

    events.on('catalogue:savedItemChanged', () => {
      const item = catalog.getChoosenCard();
      if(item === null) { return;}
      const productCardToShow = cardPreview.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: CDN_URL + item.image,
        description: item.description,
      })
      const isAddedToCart = basket.isItemInBasket(item.id)
      const priceLess = item.price
      console.log(isAddedToCart)
      cardPreview.activateBuyButton(priceLess, isAddedToCart)
      modalContainer.open()
      modalContainer.render({content: productCardToShow})
      console.log('событие открытия карточки произошло', catalog.getChoosenCard(), basket.getItems())
    })

    events.on('modal:close', () => {
      modalContainer.close();
      console.log('событие закрытия модалки произошло', catalog.getChoosenCard(), basket.getItems())
    })

    events.on('item:addToCard', ()=>{
      const item = catalog.getChoosenCard();
      if(item===null){return};
      const isAddedToCart = basket.isItemInBasket(item.id);
      if(isAddedToCart){
        basket.deleteItem(item.id)
      }
      else{
        basket.addItem(item)
      }
      console.log('событие добавления в корзину произошло', catalog.getChoosenCard(), basket.getItems())
    })

    events.on('basket:deleteItem', ()=>{
      rerenderItemComponents()
    })
    events.on('basket:addItem', ()=>{
      rerenderItemComponents()
    })

    events.on('basket:open', ()=>{
      modalContainer.open()
      modalContainer.render({content: basketView.render({price: basket.getFullPrice()})})
      console.log('событие открытия козины произошло', catalog.getChoosenCard(), basket.getItems())
    })

    events.on('item:deleteFromCard', (itemToRemove: Item)=>{
      basket.deleteItem(itemToRemove.id);
      console.log('событие удаления товара из корзины произошло', basket.getItems())
    })

    events.on('order:make', ()=>{
      modalContainer.render({content: formOrder.render({address: buyer.getAllData().address})})
      console.log('событие открытия формы оформления заказа произошло')
    })

    events.on('form:paymentChoosen', ({ payment }: { payment: string })=>{
      const pay = payment as Payment
      buyer.saveData({payment: pay})
      formOrder.errors = buyer.validatePayment() + buyer.validateAdress()
      console.log('событие выбора способа оплаты произошло', buyer)
      
      
    })

    events.on('form:input', ({vieldName, vieldValue }: {vieldName:string, vieldValue: string})=>{//(input: HTMLInputElement)=>{
      console.log('событие ввода поля произошло', buyer)
      if(vieldName === 'address'){
        formOrder.errors = buyer.validateAdress() + buyer.validatePayment()
      }
      else if(vieldName === 'phone' || vieldName === 'email'){
        formContact.errors = buyer.validatePhone() + buyer.validateEmail()
      }
      buyer.saveData({[vieldName]: vieldValue})
      
    })

    events.on('formOrder:validate', ()=>{
      if(buyer.getAllData().payment && buyer.getAllData().address 
        && (formOrder.errors === '' 
        || formOrder.errors === undefined)){
        formOrder.activateNextButton(true)
      }
      else{
        formOrder.activateNextButton(false)       
      }
      console.log('событие валидации заказа произошло')
    })

    events.on('formContact:validate', ()=>{
      if(buyer.getAllData().phone && buyer.getAllData().email 
        && (formContact.errors === '' 
        || formContact.errors === undefined)){
        formContact.activateNextButton(true)
      }
      else{
        formContact.activateNextButton(false)       
      }
      console.log('событие валидации контактов произошло')

    })

    events.on('formContact:show', ()=>{
      modalContainer.render({content: formContact.render({email: buyer.getAllData().email, phone: buyer.getAllData().phone})})
      console.log('событие открытия формы заполнения контактов произошло')
    })
    
    events.on('order:finish', ()=>{
      apiInteraction.postOrder({
         ...buyer.getAllData(), total: basket.getFullPrice(), 
         items: basket.getItems().map((item) => item.id)}).then((result) => {
          console.log('Заказ оформлен')
          success.count = basket.getFullPrice()
          modalContainer.render({content: success.render()});
          buyer.clearFields();
          basket.clearBasket()
        })
        .catch((error) => {
          formContact.errors = String(error)
        })
      
      console.log('событие завершения заказа произошло', basket, buyer)
    })

    
    events.on('succes:close',()=>{
      modalContainer.close();
    })
  }
  function rerenderItemComponents(){
    header.render({counter: basket.getItems().length})//ререндер хэдэра
    //ререндер корзины
    basketView.basketItems = basket.getItems().map((item, index) => {
      const cardTemplate = cloneTemplate('#card-basket')
      return new CardBasket(events, cardTemplate, {onClick: () => events.emit(EventList.DeleteItemFromCard, item)}).render({
        title: item.title,
        price: item.price,
        index: String(index+1),
      })
    })
    basketView.buttonActivate(basket.getItems().length)
    //this.modalContainer.render({content: this.basketView.render({price: this.basket.getFullPrice()})})
    //ререндер карточки товара
    const item = catalog.getChoosenCard()
    if(item === null){return;}
    const isAddedToCart = basket.isItemInBasket(item.id)
    const priceLess = item.price
    cardPreview.activateBuyButton(priceLess, isAddedToCart)
    //this.modalContainer.render({content: productCardToShow})
  }

  function getServerData(){
    
    apiInteraction.getProducts().then((result) => {
      console.log('Сырые данные с сервера:', result)
      if (result && result.items) {
        try {
          catalog.setItems(result.items);
          console.log( 'извлеченные данные: ',JSON.stringify(catalog.getItems())
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
  }

//}


//const presenter = new Presenter();