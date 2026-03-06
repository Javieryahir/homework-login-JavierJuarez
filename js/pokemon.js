/**
 * Carga 151 Pokemon (Gen 1), los muestra en tarjetas y permite filtrar por ID, tipo y nombre.
 */
(function () {
  var API_BASE = 'https://pokeapi.co/api/v2';
  var LIMIT = 151;

  var gridEl = document.getElementById('pokemon-grid');
  var filterIdEl = document.getElementById('filter-id');
  var filterNombreEl = document.getElementById('filter-nombre');
  var filterTipoEl = document.getElementById('filter-tipo');

  if (!gridEl) return;

  var allPokemons = [];  // lista completa cargada desde la API
  var typesSet = {};      // tipos unicos para llenar el select

  function capitalize(s) {
    return (s || '').charAt(0).toUpperCase() + (s || '').slice(1).toLowerCase();
  }

  function setLoading() {
    gridEl.innerHTML = '<p class="pokemon-loading">Cargando Pokémon…</p>';
  }

  function fetchJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Error');
      return r.json();
    });
  }

  // pide el detalle de cada pokemon en paralelo
  function fetchDetails(names) {
    return Promise.all(names.map(function (name) {
      return fetchJson(API_BASE + '/pokemon/' + name);
    }));
  }

  // genera el HTML de una tarjeta (imagen, nombre, id, tipos)
  function buildCard(p) {
    var imgUrl = (p.sprites && p.sprites.other && p.sprites.other['official-artwork'] && p.sprites.other['official-artwork'].front_default) ||
      (p.sprites && p.sprites.front_default) || '';
    var name = capitalize(p.name);
    var types = (p.types || []).map(function (t) {
      return '<span class="type-chip type-chip--' + t.type.name + '">' + capitalize(t.type.name) + '</span>';
    }).join('');

    return '<div class="pokemon-card">' +
      '<img class="pokemon-img" src="' + imgUrl + '" alt="' + name + '" onerror="this.style.display=\'none\'">' +
      '<p class="pokemon-name">' + name + '</p>' +
      '<p class="pokemon-id">#' + String(p.id).padStart(4, '0') + '</p>' +
      '<div class="pokemon-types">' + types + '</div>' +
      '</div>';
  }

  // dibuja la lista de pokemon en el grid
  function render(list) {
    if (!list.length) {
      gridEl.innerHTML = '<p class="pokemon-empty">Sin resultados.</p>';
      return;
    }
    gridEl.innerHTML = list.map(buildCard).join('');
  }

  // lee los filtros y filtra allPokemons, luego llama a render
  function applyFilters() {
    var idVal = (filterIdEl && filterIdEl.value || '').trim();
    var nombreVal = (filterNombreEl && filterNombreEl.value || '').trim().toLowerCase();
    var tipoVal = (filterTipoEl && filterTipoEl.value || '').trim().toLowerCase();

    var list = allPokemons.filter(function (p) {
      if (idVal && !String(p.id).includes(idVal)) return false;
      if (nombreVal && !p.name.toLowerCase().includes(nombreVal)) return false;
      if (tipoVal && !p.types.some(function (t) {
        return t.type.name.toLowerCase() === tipoVal;
      })) return false;
      return true;
    });
    render(list);
  }

  // llena el select de tipos con los tipos unicos encontrados
  function fillTypesSelect() {
    if (!filterTipoEl) return;
    var types = Object.keys(typesSet).sort();
    types.forEach(function (t) {
      var opt = document.createElement('option');
      opt.value = t;
      opt.textContent = capitalize(t);
      filterTipoEl.appendChild(opt);
    });
  }

  // flujo principal: pide lista, luego detalles, llena filtros y pinta
  function init() {
    setLoading();

    fetchJson(API_BASE + '/pokemon?limit=' + LIMIT + '&offset=0')
      .then(function (data) {
        var names = (data.results || []).map(function (r) { return r.name; });
        return fetchDetails(names);
      })
      .then(function (list) {
        allPokemons = list.filter(Boolean);
        typesSet = {};
        allPokemons.forEach(function (p) {
          (p.types || []).forEach(function (t) {
            typesSet[t.type.name] = true;
          });
        });
        fillTypesSelect();
        applyFilters();
      })
      .catch(function () {
        gridEl.innerHTML = '<p class="pokemon-error">Error al cargar los Pokémon.</p>';
      });
  }

  // los filtros ejecutan applyFilters al cambiar
  if (filterIdEl) filterIdEl.addEventListener('input', applyFilters);
  if (filterNombreEl) filterNombreEl.addEventListener('input', applyFilters);
  if (filterTipoEl) filterTipoEl.addEventListener('change', applyFilters);

  init();
})();
