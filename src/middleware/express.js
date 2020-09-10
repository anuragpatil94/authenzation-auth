import bodyParser, { json } from 'body-parser';
import cors from 'cors';

export default ({ app }) => {
  app.get('/favicon.ico', (req, res) => res.status(204).end());

  // CORS Management
  app.use(cors());

  // Load body parsers
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(json());
};
