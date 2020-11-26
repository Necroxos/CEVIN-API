import express = require('express');
import path = require('path');

export default class Server {

    // Variables de configuración
    public app: express.Application;
    public port: number;

    constructor(puerto: number) {
        this.port = puerto;
        this.app = express();
    }

    // Se recibe un puerto para iniciar el constructor
    static init(puerto: number) {
        return new Server(puerto);
    }

    // Se establece una carpeta public con una página inical para la api
    private publicFolder() {
        const publicPath = path.resolve(__dirname, '../public');
        this.app.use(express.static(publicPath));
    }

    // Inicializa express con las configuraciones establecidas
    start(callback: Function) {
        this.app.listen(this.port);
        this.publicFolder();
        callback(true);
    }
}