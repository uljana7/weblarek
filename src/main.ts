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


class Presenter{

  private basketView: BasketView;
  private cardBasket: CardBasket;
  private cardCatalog: CardCatalog;
  private cardPreview: CardPreview;
  //private form: Form;
  private formOrder: FormOrder;
  private formContact: FormContact;
  private gallery: Gallery;
  private header: Header;
  private modalContainer: ModalContainer;
  private success: Success;

  private basket: Basket;
  private buyer: Buyer;
  private catalog: Catalogue;
  private api: Api;
  private events: EventEmitter;

  constructor(){
    this.events = new EventEmitter();
    const basketContainer = cloneTemplate('#basket')
    this.basketView = new BasketView(this.events, basketContainer);
    const cardBacketContainer = cloneTemplate('#card-basket')
    this.cardBasket = new CardBasket(this.events, cardBacketContainer);
    const cardCatalogContainer = cloneTemplate('#card-catalog')
    this.cardCatalog = new CardCatalog(this.events, cardCatalogContainer);
    const cardPreviewContainer = cloneTemplate('#card-preview')
    this.cardPreview = new CardPreview(this.events, cardPreviewContainer);
    //const backetContainer = cloneTemplate('#basket')
    //this.form = new Form(this.events);
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

    this.getServerData()
    this.header.render();
    this.gallery.render();
    this.events.on('catalog:change', () => {
      this.gallery.catalog = this.catalog.getItems().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(this.events, cardTemplate).render({
          category: item.category,
          title: item.title,
          price: item.price,
          image: CDN_URL + item.image,
        })
      })
    })
 //this.onLoadProducts.bind(this));

  }

  getServerData(){
    const testApi = new ApiInteraction(this.api);
    testApi.getProducts().then((result) => {
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

  onLoadProducts() {
    // 1. Получить массив товаров из модели
    /*const products = this.catalog.getItems(); 
    const cardCatalogContainer = cloneTemplate('#card-catalog')
    // 2. Создать карточки
    const cards = products.map(product => {
      // создаем экземпляр карточки
      const card = new CardCatalog(this.events, cardCatalogContainer );
      // получаем DOM-элемент карточки
      return card.render();
    });
    this.gallery.catalog = cards;//this.gallery.render(cards);
    this.gallery.render();*/
  }
}


const presenter = new Presenter();