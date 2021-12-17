// Move header above main
let headerElem = document.querySelector('body > header');
let mainElem = document.querySelector('main');
document.body.insertBefore(headerElem, mainElem);
// Move 'My Site' into header
let mySite = document.querySelector('main').firstElementChild;
headerElem.insertBefore(mySite, headerElem.firstElementChild);
// Swap pictures
let [img1, img2] = document.querySelectorAll('img');
let [fig1, fig2] = document.querySelectorAll('figure');
fig1.insertBefore(img2, fig1.firstElementChild);
fig2.insertBefore(img1, fig2.firstElementChild);
// Move figs inside article element
let articleElem = document.querySelector('article');
articleElem.insertBefore(fig1, null);
articleElem.insertBefore(fig2, null);
