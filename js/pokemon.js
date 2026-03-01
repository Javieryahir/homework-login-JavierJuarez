
(function () {
  var API_BASE = 'https://pokeapi.co/api/v2';

  var cardEl = document.getElementById('pokemon-card');
  var inputEl = document.getElementById('pokemon-input');
  var btnEl = document.getElementById('pokemon-btn');

  if (!cardEl) return;

  function capitalize(s) {
    return (s || '').charAt(0).toUpperCase() + (s || '').slice(1).toLowerCase();
  }

  function setLoading() {
    cardEl.innerHTML = '<p class="pokemon-loading">Cargando…</p>';
  }

  function setError(msg) {
    cardEl.innerHTML = '<p class="pokemon-error">' + (msg || 'No se encontró el Pokémon.') + '</p>';
  }

  function renderPokemon(data) {
    var imgUrl = (data.sprites && data.sprites.other && data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) ||
      (data.sprites && data.sprites.front_default) ||
      '';
    var name = capitalize(data.name);
    var id = data.id;

    cardEl.innerHTML =
      '<img class="pokemon-img" src="' + (imgUrl || '') + '" alt="Imagen de ' + name + '" onerror="this.style.display=\'none\'">' +
      '<p class="pokemon-name">' + name + '</p>' +
      '<p class="pokemon-id">#' + String(id).padStart(4, '0') + '</p>';
  }

  function loadPokemon(idOrName) {
    var key = (idOrName || '25').toString().trim().toLowerCase();
    if (!key) return setError('Escribe un ID o nombre.');

    setLoading();

    fetch(API_BASE + '/pokemon/' + encodeURIComponent(key))
      .then(function (res) {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then(renderPokemon)
      .catch(function () {
        setError('No se encontró el Pokémon.');
      });
  }

  function onSearch() {
    loadPokemon(inputEl.value);
  }

  if (btnEl) {
    btnEl.addEventListener('click', onSearch);
  }
  if (inputEl) {
    inputEl.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') onSearch();
    });
  }

  loadPokemon(inputEl ? inputEl.value : '25');
})();
