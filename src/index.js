import app from './app';
import './database/cnxn';

app.listen(app.get('port'));

console.log('Server on port', app.get('port'));