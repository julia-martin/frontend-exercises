document.addEventListener('DOMContentLoaded', () => {
  const contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
  const addBtn = document.querySelector('button.add');
  const addContactPage = document.querySelector('.add-contact');
  const editContactPage = document.querySelector('.edit-contact');
  const cancelBtn = document.querySelectorAll('.cancel');
  const addForm = document.querySelector('.add-contact form');
  const editForm = document.querySelector('.edit-contact form');
  const searchBar = document.querySelector('.search');
  const tagFilter = document.querySelector('select');

  const ViewManager = {
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

  const Search = {
    searchContacts: function(e) {
      let text = e.target.value;
      let nameElems = document.querySelectorAll('h2.full_name');
      nameElems.forEach(elem => {
        if (!Search._stringMatch(elem.textContent, text)) {
          elem.parentElement.style.display = 'none';
        } else {
          elem.parentElement.style.display = 'inline-block';
        }
      });
    },

    _stringMatch: function(nameText, str) {
      return nameText.toLowerCase().includes(str.toLowerCase());
    }
  };

  const Controller = {
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

  const EventManager = {
    init: function() {
      addBtn.addEventListener('click', () => addContactPage.style.display = 'block');
      searchBar.addEventListener('keyup', Search.searchContacts);
      tagFilter.addEventListener('change', ViewManager.filterByTag);
      cancelBtn.forEach(cancelBtn => cancelBtn.addEventListener('click', ViewManager.cancelAction));
      addForm.addEventListener('submit', Controller.addContact);
      editForm.addEventListener('submit', Controller.editContact);
    }
  };

  ViewManager.loadContacts();
  EventManager.init();
});