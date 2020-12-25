// Dependencias
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
// Rutas
import RolRoutes from './routes/rol.routes';
import AdminRoutes from './routes/admin.routes';
import TipoRoutes from './routes/tipo.routes';
import LoginRoutes from './routes/login.routes';
import ClienteRoutes from './routes/cliente.routes';
import UsuarioRoutes from './routes/usuario.routes';
import CilindroRoutes from './routes/cilindro.routes';
import PropietarioRoutes from './routes/propietario.routes';

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
app.use(AdminRoutes);
app.use(LoginRoutes);
app.use(ClienteRoutes);
app.use(UsuarioRoutes);
app.use(CilindroRoutes);
app.use(PropietarioRoutes);

export default app;