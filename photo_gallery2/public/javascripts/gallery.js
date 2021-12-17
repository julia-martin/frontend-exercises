document.addEventListener('DOMContentLoaded', () => {
  let templates = {};
  let photos;
  let currIdx = 0;

  fetch('/photos').then(response => response.json())
    .then(json => {
      photos = json;
      renderPhotos();
      renderPhotoInformation(photos[currIdx].id);
      renderComments();
  });

  document.querySelectorAll("script[type='text/x-handlebars']").forEach(tmpl => {
    templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
  });

  document.querySelectorAll("script[data-type='partial']").forEach(tmpl => {
    Handlebars.registerPartial(tmpl.id, tmpl.innerHTML);
  });

  function renderPhotos() {
    let slides = document.getElementById('slides');
    slides.insertAdjacentHTML('beforeend', templates.photos({photos: photos}));
  }

  function renderPhotoInformation(id) {
    let photo = photos.filter(item => item.id === id)[0];
    let header = document.querySelector('section > header');
    header.replaceChildren();
    header.insertAdjacentHTML('beforeend', templates.photo_information(photo));

    document.querySelector('.actions').addEventListener('click', e => {
      e.preventDefault();
      let type = e.target.getAttribute("data-property");
      if (type) {
        let photoId = e.target.getAttribute("data-id");
        fetch(e.target.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'photo_id=' + photoId
          })
          .then(response => response.json())
          .then(json => e.target.textContent = e.target.textContent.replace(/\d+/, json.total));
      }
    });
  }

  function renderComments() {
    let commentList = document.querySelector('#comments ul');
    commentList.replaceChildren();

    fetch('/comments?photo_id=' + photos[currIdx].id)
      .then(response => response.json())
      .then(json => {
        let commentsTempl = templates['photo_comments']({comments: json});
        commentList.insertAdjacentHTML('beforeend', commentsTempl);
      });
  }

  function switchPhoto(direction) {
    let currId = photos[currIdx]["id"];
    let currFig = document.querySelector(`figure[data-id='${currId}']`);
    currFig.className = 'fade-out';

    if (direction === 'prev') {
      currIdx = (currIdx - 1 < 0) ? currIdx - 1 + photos.length : currIdx - 1;
    } else if (direction === 'next') {
      currIdx = (currIdx - 1 < 0) ? currIdx - 1 + photos.length : currIdx - 1;
    }

    currId = photos[currIdx]["id"];
    document.querySelector('section > header').replaceChildren();
    renderPhotoInformation(currId);
    document.querySelector(`figure[data-id='${currId}']`).className = 'fade-in';
    renderComments();
  }

  document.querySelector('.prev').addEventListener('click', e => {
    switchPhoto('prev');
  });

  document.querySelector('.next').addEventListener('click', e => {
    switchPhoto('next');
  });

  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    formData.set('photo_id', photos[currIdx].id);
    let data = new URLSearchParams([...formData]);

    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: data,
    })
    .then(response => response.json())
    .then(json => {
      let commentList = document.querySelector('#comments ul');
      commentList.insertAdjacentHTML('beforeend', templates.photo_comment(json));
      form.reset();
    });
  });
});