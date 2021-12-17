import {ViewManager} from './modules/viewManager.js';
import {EventManager} from './modules/eventManager.js';

document.addEventListener('DOMContentLoaded', () => {
  ViewManager.loadContacts();
  EventManager.init();
});