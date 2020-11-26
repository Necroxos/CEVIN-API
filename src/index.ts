import Server from './server/server';
import router from './router/router';

// Configura express
const server = Server.init(3000);
// Se le añaden las rutas
server.app.use(router);
// Se inicia la aplicación
server.start(() => {
    console.log('Servidor corriendo en el puerto 3000');
})