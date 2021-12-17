document.addEventListener('DOMContentLoaded', () => {
  function exitModal() {
    document.getElementById('modal').remove();
    document.getElementById('overlay').remove();
  }

  function handleClickEvent(e) {
    e.preventDefault();
    console.log("Click handled");
    // Create overlay
    let overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');
    document.body.append(overlay);

    // Create modal
    let name = e.target.closest('a').dataset.person;
    let image;
    if (e.target.tagName === 'IMG') {
      image = e.target.cloneNode(true);
    } else {
      image = e.target.querySelector('img').cloneNode(true);
    }

    let modal = document.createElement('div');
    modal.setAttribute('id', 'modal');

    // Create close icon
    let closeLink = document.createElement('a');
    closeLink.setAttribute('href', '#');
    let closeIcon = document.createElement('img');
    closeIcon.setAttribute('src', 'images/icon_close.png');
    closeIcon.setAttribute('id', 'closeIcon');
    closeLink.appendChild(closeIcon);
    modal.appendChild(closeLink);

    // Image and name
    let modalHeading = document.createElement('div');
    modalHeading.setAttribute('id', 'modalHeading');
    modal.appendChild(modalHeading);

    let nameElem = document.createElement('p');
    nameElem.setAttribute('id', 'inModalName');
    nameElem.append(name);
    nameElem.style.color = '#3e59b2';

    modalHeading.appendChild(image);
    modalHeading.appendChild(nameElem);

    // Text
    let text = document.createElement('p');
    text.append('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    modal.appendChild(text);

    document.body.append(modal);

    // Listeners for exiting
    document.querySelector('#modal a').addEventListener('click', e => {
      e.preventDefault();
      exitModal();
    });

    document.querySelector('#overlay').addEventListener('click', e => {
      e.preventDefault();
      if (e.target !== document.querySelector('#modal')) {
        exitModal();
      }
    });

    document.addEventListener('keyup', e => {
      if (event.keyCode === 27 && document.getElementById('modal')) {
        exitModal();
      }
    });
  }
  // Add event listeners to every anchor element
  document.querySelectorAll('a').forEach(curr => curr.addEventListener('click', handleClickEvent));
});