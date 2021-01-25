// Dependencias
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
// Rutas
import RolRoutes from './routes/rol.routes';
import TipoRoutes from './routes/tipo.routes';
import ZonaRoutes from './routes/zona.routes';
import AdminRoutes from './routes/admin.routes';
import StockRoutes from './routes/stock.routes';
import LoginRoutes from './routes/login.routes';
import VentaRoutes from './routes/venta.routes';
import ComunaRoutes from './routes/comuna.routes';
import ClienteRoutes from './routes/cliente.routes';
import UsuarioRoutes from './routes/usuario.routes';
import CilindroRoutes from './routes/cilindro.routes';
import PropietarioRoutes from './routes/propietario.routes';
import CilindroVentaRoutes from './routes/cilindro-venta.routes';

// Inicializaciones
const app = express();

//settings
app.set('port', process.env.PORT);

//public folder
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

//middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get('/api/', (req, res) => {
    res.json({
        message: 'GET DE TESTING'
    })
});

app.use(RolRoutes);
app.use(TipoRoutes);
app.use(ZonaRoutes);
app.use(AdminRoutes);
app.use(StockRoutes);
app.use(LoginRoutes);
app.use(VentaRoutes);
app.use(ComunaRoutes);
app.use(ClienteRoutes);
app.use(UsuarioRoutes);
app.use(CilindroRoutes);
app.use(PropietarioRoutes);
app.use(CilindroVentaRoutes);

export default app;