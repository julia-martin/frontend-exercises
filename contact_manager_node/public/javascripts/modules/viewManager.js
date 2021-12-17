import {Controller} from './controller.js';
const contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
const editContactPage = document.querySelector('.edit-contact');

export const ViewManager = {
  cancelAction: function(e) {
    e.target.closest('.fullpage').style.display = 'none';
  },

  removeFromView: async function(id) {
    document.querySelector(`li[data-id="${id}"]`).remove();
  },

  addToView: function(contactObj) {
    let contactsList = document.querySelector('.contacts-list');
    contactsList.insertAdjacentHTML('beforeend', contactsTemplate(contactObj));
  },

  loadContacts: async function() {
    let response = await fetch('/api/contacts');
    let json = await response.json();
    json.forEach(contact => this.addToView(contact));
    let btns = document.querySelectorAll('.contact-card button');
    btns.forEach(btn => ViewManager.addContactEventListeners(btn));
  },

  addContactEventListeners: function(btn) {
    btn.addEventListener('click', e => {
      if (e.target.classList.contains('edit')) {
        ViewManager.renderEditPage(e);
      } else if (e.target.classList.contains('delete')) {
        if (confirm('Do you want to delete the contact?')) {
          Controller.deleteContact(e.target.parentElement.dataset.id);
        }
      }
    });
  },

  renderEditPage: async function(e) {
    let inputs = editContactPage.querySelectorAll('input[type="text"]');
    let data = await Controller.getCurrentVals(e);
    // Place existing values in the input fields
    for (let idx = 0; idx < inputs.length; idx++) {
      let key = inputs[idx].name;
      inputs[idx].value = data[key];
    }

    if (data.tags) {
      let currTags = data.tags.split(',');
      currTags.forEach(tag => {
        let checkbox = editContactPage.querySelector(`input[name="${tag}"]`);
        checkbox.checked = true;
      });
    }

    let id = e.target.parentElement.dataset.id;
    editContactPage.dataset.id = id;
    editContactPage.style.display = 'block';
  },

  filterByTag: function(e) {
    let selection = e.target.value;
    let contactCards = document.querySelectorAll('.contact-card');
    let contactTags = [...document.querySelectorAll('p.tags')].map(tags => tags.textContent.split(','));
    for (let idx = 0; idx < contactCards.length; idx++) {
      if (selection === 'all' || contactTags[idx].includes(selection)) {
        contactCards[idx].style.display = 'inline-block';
      } else {
        contactCards[idx].style.display = 'none';
      }
    }
  }
};