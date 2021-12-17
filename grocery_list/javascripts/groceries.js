(function groceryListManager() {
  class GroceryList {
    constructor(listElem) {
      this.list = document.querySelector(listElem);
    }

    addItem(name, quantity) {
      let listItem = document.createElement('li');
      listItem.append(`${quantity} ${name}`);
      this.list.appendChild(listItem);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('form');
    form.addEventListener('submit', e => {
      e.preventDefault();

      let name = document.getElementById('name').value;
      let quantity = document.getElementById('quantity').value || '1';
      let groceryList = new GroceryList('#grocery-list');
      groceryList.addItem(name, quantity);
      form.reset();
    });
  });
})();