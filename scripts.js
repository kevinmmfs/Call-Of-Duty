
$( document ).ready(function(){

  const swiper = new Swiper('.swiper', {

    direction: 'horizontal',
    loop: true,

    pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'bullets',
    renderBullet: function (index, className) {
      return `<div class="box ${className}"></div>`;
    },
    },

    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    },

});

})
