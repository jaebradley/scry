import {Hono} from 'hono'
import {basicAuth} from 'hono/basic-auth';
import {handlePropertiesRequest} from "./properties";

const app = new Hono();
const authenticationMiddleware = basicAuth({
    username: 'admin',
    password: 'secret',
});

app.use('/*', authenticationMiddleware);

app.get('/', (c) => c.text('Hono!'));
app.get('/properties', handlePropertiesRequest);

export default app