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


class Presenter{

  private basketView: BasketView;
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

  constructor(){
    this.events = new EventEmitter();
    const basketContainer = cloneTemplate('#basket')
    this.basketView = new BasketView(this.events, basketContainer);    
    const cardPreviewContainer = cloneTemplate('#card-preview')
    this.cardPreview = new CardPreview(this.events, cardPreviewContainer);
    const formOrderContainer = cloneTemplate('#order')
    this.formOrder = new FormOrder(this.events, formOrderContainer);
    const formContactContainer = cloneTemplate('#contacts')
    this.formContact = new FormContact(this.events, formContactContainer);
    const headerContainer = ensureElement<HTMLElement>('.header')
    this.header = new Header(this.events, headerContainer);
    
    const modalContainerContainer = ensureElement<HTMLElement>('.modal')
    this.modalContainer = new ModalContainer(this.events, modalContainerContainer);
    const successContainer = cloneTemplate('#success')
    this.success = new Success(this.events, successContainer);
    const galleryContainer = ensureElement<HTMLElement>('.gallery')
    this.gallery = new Gallery(this.events, galleryContainer);
    
    this.basket = new Basket(this.events);
    this.buyer = new Buyer(this.events);
    this.catalog = new Catalogue(this.events);
    this.api = new Api(API_URL);
    this.apiInteraction = new ApiInteraction(this.api)

    this.getServerData()
    this.header.render();
    this.gallery.render();
    this.onEvents()
    
  }

  onEvents(){
    this.events.on('catalog:changed', () => {
      this.gallery.catalog = this.catalog.getItems().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(this.events, cardTemplate, {onClick: () => this.events.emit(EventList.CatalogSaveChoosenCard, item)}).render({
          category: item.category,
          title: item.title,
          price: item.price,
          image: CDN_URL + item.image,
        })
      })
      console.log('событие изменения каталога произошло')
    })

    this.events.on('catalog:chooseCard', (item: Item) => {
      this.catalog.setChoosenCard(item)
      console.log('событие сохранения карточки произошло', this.catalog.getChoosenCard(), this.basket.getItems())
    })

    this.events.on('catalogue:savedItemChanged', () => {
      const item = this.catalog.getChoosenCard();
      if(item === null) { return;}
      const productCardToShow = this.cardPreview.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: CDN_URL + item.image,
        description: item.description,
      })
      const isAddedToCart = this.basket.isItemInBasket(item.id)
      const priceLess = item.price
      console.log(isAddedToCart)
      this.cardPreview.activateBuyButton(priceLess, isAddedToCart)
      this.modalContainer.open()
      this.modalContainer.render({content: productCardToShow})
      console.log('событие открытия карточки произошло', this.catalog.getChoosenCard(), this.basket.getItems())
    })

    this.events.on('modal:close', () => {
      this.modalContainer.close();
      console.log('событие закрытия модалки произошло', this.catalog.getChoosenCard(), this.basket.getItems())
    })

    this.events.on('item:addToCard', ()=>{
      const item = this.catalog.getChoosenCard();
      if(item===null){return};
      const isAddedToCart = this.basket.isItemInBasket(item.id);
      if(isAddedToCart){
        this.basket.deleteItem(item.id)
      }
      else{
        this.basket.addItem(item)
      }
      console.log('событие добавления в корзину произошло', this.catalog.getChoosenCard(), this.basket.getItems())
    })

    this.events.on('basket:deleteItem', ()=>{
      this.rerenderItemComponents()
    })
    this.events.on('basket:addItem', ()=>{
      this.rerenderItemComponents()
    })

    this.events.on('basket:open', ()=>{
      this.modalContainer.open()
      this.modalContainer.render({content: this.basketView.render({price: this.basket.getFullPrice()})})
      console.log('событие открытия козины произошло', this.catalog.getChoosenCard(), this.basket.getItems())
    })

    this.events.on('item:deleteFromCard', (itemToRemove: Item)=>{
      this.basket.deleteItem(itemToRemove.id);
      console.log('событие удаления товара из корзины произошло', this.basket.getItems())
    })

    this.events.on('order:make', ()=>{
      this.modalContainer.render({content: this.formOrder.render({address: this.buyer.getAllData().address})})
      console.log('событие открытия формы оформления заказа произошло')
    })

    this.events.on('form:paymentChoosen', ({ payment }: { payment: string })=>{
      const pay = payment as Payment
      this.buyer.saveData({payment: pay})
      this.formOrder.errors = this.buyer.validatePayment() + this.buyer.validateAdress()
      console.log('событие выбора способа оплаты произошло', this.buyer)
      
      
    })

    this.events.on('form:input', ({vieldName, vieldValue }: {vieldName:string, vieldValue: string})=>{//(input: HTMLInputElement)=>{
      console.log('событие ввода поля произошло', this.buyer)
      if(vieldName === 'address'){
        this.formOrder.errors = this.buyer.validateAdress() + this.buyer.validatePayment()
      }
      else if(vieldName === 'phone' || vieldName === 'email'){
        this.formContact.errors = this.buyer.validatePhone() + this.buyer.validateEmail()
      }
      this.buyer.saveData({[vieldName]: vieldValue})
      
    })

    this.events.on('formOrder:validate', ()=>{
      if(this.buyer.getAllData().payment && this.buyer.getAllData().address 
        && (this.formOrder.errors === '' 
        || this.formOrder.errors === undefined)){
        this.formOrder.activateNextButton(true)
      }
      else{
        this.formOrder.activateNextButton(false)       
      }
      console.log('событие валидации заказа произошло')
    })

    this.events.on('formContact:validate', ()=>{
      if(this.buyer.getAllData().phone && this.buyer.getAllData().email 
        && (this.formContact.errors === '' 
        || this.formContact.errors === undefined)){
        this.formContact.activateNextButton(true)
      }
      else{
        this.formContact.activateNextButton(false)       
      }
      console.log('событие валидации контактов произошло')

    })

    this.events.on('formContact:show', ()=>{
      this.modalContainer.render({content: this.formContact.render({email: this.buyer.getAllData().email, phone: this.buyer.getAllData().phone})})
      console.log('событие открытия формы заполнения контактов произошло')
    })
    
    this.events.on('order:finish', ()=>{
      this.apiInteraction.postOrder({
         ...this.buyer.getAllData(), total: this.basket.getFullPrice(), 
         items: this.basket.getItems().map((item) => item.id)}).then((result) => {
          console.log('Заказ оформлен')
          this.success.count = this.basket.getFullPrice()
          this.modalContainer.render({content: this.success.render()});
          this.buyer.clearFields();
          this.basket.clearBasket()
        })
        .catch((error) => {
          this.formContact.errors = String(error)
        })
      
      console.log('событие завершения заказа произошло', this.basket, this.buyer)
    })

    
    this.events.on('succes:close',()=>{
      this.modalContainer.close();
    })
  }
  rerenderItemComponents(){
    this.header.render({counter: this.basket.getItems().length})//ререндер хэдэра
    //ререндер корзины
    this.basketView.basketItems = this.basket.getItems().map((item, index) => {
      const cardTemplate = cloneTemplate('#card-basket')
      return new CardBasket(this.events, cardTemplate, {onClick: () => this.events.emit(EventList.DeleteItemFromCard, item)}).render({
        title: item.title,
        price: item.price,
        index: String(index+1),
      })
    })
    this.basketView.buttonActivate(this.basket.getItems().length)
    //this.modalContainer.render({content: this.basketView.render({price: this.basket.getFullPrice()})})
    //ререндер карточки товара
    const item = this.catalog.getChoosenCard()
    if(item === null){return;}
    const isAddedToCart = this.basket.isItemInBasket(item.id)
    const priceLess = item.price
    this.cardPreview.activateBuyButton(priceLess, isAddedToCart)
    //this.modalContainer.render({content: productCardToShow})
  }

  getServerData(){
    
    this.apiInteraction.getProducts().then((result) => {
      console.log('Сырые данные с сервера:', result)
      if (result && result.items) {
        try {
          this.catalog.setItems(result.items);
          console.log( 'извлеченные данные: ',JSON.stringify(this.catalog.getItems())
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

}


const presenter = new Presenter();