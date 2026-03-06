/**
 * Layout compartido para paginas interiores: header, footer y proteccion por sesion.
 * Inyecta el mismo header y footer; las paginas solo son accesibles con sesion iniciada.
 */
(function () {
  if (typeof getCurrentUser !== 'function') {
    console.error('layout-inner.js requiere auth.js');
    return;
  }

  var user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';  // sin sesion, redirige al login
    return;
  }

  var headerHtml = '<header class="site-header site-header-inner">' +
    '<a href="interior.html" class="logo">Mi App</a>' +
    '<nav>' +
    '<span class="header-user">Usuario: <strong id="header-user"></strong></span>' +
    '<a href="interior.html">Inicio</a>' +
    '<a href="perfil.html">Perfil</a>' +
    '<a href="configuracion.html">Configuración</a>' +
    '<a href="index.html" class="salir" id="btn-logout">Cerrar sesión</a>' +
    '</nav>' +
    '</header>';

  var footerHtml = '<footer class="site-footer">' +
    '<p>&copy; 2026 Mi Proyecto Javier Yahir Juarez Arroyo</p>' +
    '</footer>';

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('site-footer');

  if (headerEl) {
    headerEl.innerHTML = headerHtml;
    var userEl = document.getElementById('header-user');
    if (userEl) {
      userEl.textContent = user.nombre || user.usuario || user.email || 'Usuario';  // muestra nombre en header
    }
    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        logout();
        window.location.href = 'index.html';  // cierra sesion y va al login
      });
    }
  }

  if (footerEl) {
    footerEl.innerHTML = footerHtml;
  }
})();
