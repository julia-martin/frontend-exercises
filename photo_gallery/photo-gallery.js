document.addEventListener('DOMContentLoaded', () => {
  function handleClick(e) {
    e.preventDefault();
    // Switch active class
    document.querySelector('.active').classList.remove('active');
    let image = e.target;
    e.target.classList.add('active');

    // Remove photo
    let current = document.querySelector('.current');
    current.remove();

    // Insert photo
    let newImg = document.createElement('img');
    newImg.setAttribute('src', image.src);
    newImg.classList.add('current');
    document.querySelector('figure').insertBefore(newImg, document.querySelector('figcaption'));
  }

  document.querySelectorAll('li a').forEach(elem => elem.addEventListener('click', handleClick));
});