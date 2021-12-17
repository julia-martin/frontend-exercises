export const Search = {
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