import filmeController from "../controllers/filmeController.js";

export default (app) => {
    app.get('/filmes', filmeController.get);
    app.get('/filmes/:id', filmeController.get);
    app.post('/filmes', filmeController.persist);
    app.patch('/filmes/:id', filmeController.persist);
    app.delete('/filmes/:id', filmeController.destroy);
};
