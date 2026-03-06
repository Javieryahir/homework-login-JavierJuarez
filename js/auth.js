/**
 * Autenticacion: login, registro y sesion con localStorage y sessionStorage.
 */
var AUTH_STORAGE_KEY = 'app_usuarios';    // clave en localStorage para la lista de usuarios
var CURRENT_USER_KEY = 'app_usuario_actual';  // clave en sessionStorage para el usuario logueado

var USUARIOS_DEMO = [
  { nombre: 'Usuario Demo', email: 'demo@ejemplo.com', usuario: 'demo', password: '123' }
];  // usuario de prueba: demo / 123

function getUsers() {
  try {
    var json = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!json) return USUARIOS_DEMO.slice();
    var list = JSON.parse(json);
    return Array.isArray(list) ? list : USUARIOS_DEMO.slice();
  } catch (e) {
    return USUARIOS_DEMO.slice();
  }
}
// lee la lista de usuarios desde localStorage; si no hay, devuelve los demo

function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}
// persiste la lista de usuarios en localStorage

function login(usuario, password) {
  var users = getUsers();
  usuario = (usuario || '').trim().toLowerCase();
  for (var i = 0; i < users.length; i++) {
    if (users[i].usuario.toLowerCase() === usuario && users[i].password === password) {
      return users[i];
    }
  }
  return null;
}
// valida usuario y password; devuelve el objeto usuario o null

function register(nombre, email, usuario, password, password2) {
  nombre = (nombre || '').trim();
  email = (email || '').trim().toLowerCase();
  usuario = (usuario || '').trim();
  if (!nombre) return { ok: false, error: 'El nombre es obligatorio.' };
  if (!email) return { ok: false, error: 'El correo es obligatorio.' };
  if (!usuario) return { ok: false, error: 'El usuario es obligatorio.' };
  if (!password) return { ok: false, error: 'La contraseña es obligatoria.' };
  if (password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  if (password !== password2) return { ok: false, error: 'Las contraseñas no coinciden.' };

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].usuario.toLowerCase() === usuario.toLowerCase()) {
      return { ok: false, error: 'Ese nombre de usuario ya está en uso.' };
    }
    if (users[i].email.toLowerCase() === email) {
      return { ok: false, error: 'Ese correo ya está registrado.' };
    }
  }

  var nuevo = {
    nombre: nombre,
    email: email,
    usuario: usuario,
    password: password
  };
  users.push(nuevo);
  saveUsers(users);

  console.log('Usuario registrado (guardado en localStorage y mostrado aqui):', JSON.stringify(nuevo, null, 2));
  return { ok: true };
}
// valida campos, comprueba usuario/email unicos, guarda en localStorage y en consola

function setCurrentUser(user) {
  try {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {}
}
// guarda el usuario actual en sessionStorage (sesion activa)

function getCurrentUser() {
  try {
    var json = sessionStorage.getItem(CURRENT_USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    return null;
  }
}
// lee el usuario actual de la sesion; null si no hay

function logout() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
}
// cierra sesion borrando el usuario de sessionStorage
