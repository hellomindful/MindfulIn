document.addEventListener('DOMContentLoaded', function () {
  var search = document.getElementById('airri-search');
  var category = document.getElementById('airri-category');
  var cards = Array.from(document.querySelectorAll('[data-collection]'));
  if (!search || !category) return;
  document.querySelector('.airri-filters').hidden = false;
  function normalize(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function filter() {
    var terms = normalize(search.value).split(' ').filter(Boolean);
    var count = 0;
    cards.forEach(function (card) {
      var matches = (category.value === 'all' || category.value === card.dataset.collection) && terms.every(function (term) { return normalize(card.textContent).includes(term); });
      card.hidden = !matches;
      if (matches) count++;
    });
    document.getElementById('airri-results').textContent = count + (count === 1 ? ' collection to explore' : ' collections to explore');
    document.getElementById('airri-empty').hidden = count !== 0;
  }
  search.addEventListener('input', filter);
  category.addEventListener('change', filter);
  document.getElementById('airri-reset').addEventListener('click', function () { search.value = ''; category.value = 'all'; filter(); search.focus(); });
  document.querySelectorAll('[data-topic], [data-format]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (link.dataset.topic) document.getElementById('airri-topic').value = link.dataset.topic;
      if (link.dataset.format) { document.getElementById('airri-audience').value = link.dataset.format; document.getElementById('airri-format').value = 'Facilitated'; }
    });
  });
});
