import {ViewManager} from './viewManager.js';

const addContactPage = document.querySelector('.add-contact');
const editContactPage = document.querySelector('.edit-contact');

export const Controller = {
  getCurrentVals: async function(e) {
    let id = e.target.parentElement.dataset.id;
    let response = await fetch(`api/contacts/${id}`);
    let json = await response.json();
    return json;
  },

  deleteContact: async function(id) {
    let response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (response.ok) {
      ViewManager.removeFromView(id);
    } else {
      alert("Error: Cannot find contact.");
    }
  },

  addContact: async function(e) {
    e.preventDefault();

    let data = Controller._encodeFormInputs(e.target);
    let response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })
    if (!response.ok) {
      alert("Error adding contact.");
      return;
    }

    let contact = await response.json();
    ViewManager.addToView(contact);

    let buttons = document.querySelectorAll('.contact-card:last-child button');
    buttons.forEach(btn => ViewManager.addContactEventListeners(btn));
    addContactPage.style.display = 'none';
  },

  editContact: async function(e) {
    e.preventDefault();

    let data = Controller._encodeFormInputs(e.target);
    let id = e.target.parentElement.dataset.id;
    data += `&id=${id}`;

    let response = await fetch(`api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });
    if (!response.ok) {
      alert("Error editing contact");
      return;
    }

    let contact = await response.json();
    ViewManager.removeFromView(id);
    ViewManager.addToView(contact);

    let buttons = document.querySelectorAll('.contact-card:last-child button');
    buttons.forEach(btn => ViewManager.addContactEventListeners(btn));
    editContactPage.style.display = 'none';
  },

  _encodeFormInputs: function(form) {
    let params = [];
    let tags = [];
    for (let idx = 0; idx < form.elements.length; idx++) {
      let element = form.elements[idx];
      if (element.type !== 'submit' && element.type !== 'checkbox') {
        let key = encodeURIComponent(element.name);
        let val = encodeURIComponent(element.value);
        params.push(`${key}=${val}`);
      } else if (element.type === 'checkbox' && element.checked) {
        tags.push(element.value);
      }
    }
    let tagsVal = encodeURIComponent(tags.join(','));
    params.push(`tags=${tagsVal}`);
    return params.join('&');
  }
};