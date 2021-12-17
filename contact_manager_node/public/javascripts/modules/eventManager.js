import {Search} from './search.js';
import {ViewManager} from './viewManager.js';
import {Controller} from './controller.js';

const addBtn = document.querySelector('button.add');
const searchBar = document.querySelector('.search');
const tagFilter = document.querySelector('select');
const cancelBtn = document.querySelectorAll('.cancel');
const addForm = document.querySelector('.add-contact form');
const editForm = document.querySelector('.edit-contact form');
const addContactPage = document.querySelector('.add-contact');

export const EventManager = {
  init: function() {
    addBtn.addEventListener('click', () => addContactPage.style.display = 'block');
    searchBar.addEventListener('keyup', Search.searchContacts);
    tagFilter.addEventListener('change', ViewManager.filterByTag);
    cancelBtn.forEach(cancelBtn => cancelBtn.addEventListener('click', ViewManager.cancelAction));
    addForm.addEventListener('submit', Controller.addContact);
    editForm.addEventListener('submit', Controller.editContact);
  }
};