import padraoLugaresController from "../controllers/padraoLugaresController.js";

export default (app) => {
    app.get('/padrao-lugares', padraoLugaresController.get);
    app.get('/padrao-lugares/:id', padraoLugaresController.get);
    app.post('/padrao-lugares', padraoLugaresController.persist);
    app.patch('/padrao-lugares/:id', padraoLugaresController.persist);
    app.delete('/padrao-lugares/:id', padraoLugaresController.destroy);
};
