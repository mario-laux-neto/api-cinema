import usuarioController from "../controllers/usuarioController.js";
import authMiddleware from "../middlewares/autenticarTokenMiddleware.js";

export default (app) => {
    app.get('/usuario', usuarioController.get);
    app.get('/usuario/:id', usuarioController.get);
    app.post('/usuario', usuarioController.persist);
    app.patch('/usuario/:id', usuarioController.persist);
    app.delete('/usuario/:id', usuarioController.destroy);
    app.post('/usuario/login', usuarioController.login);
    app.get('/usuario/token', authMiddleware, usuarioController.getDataByToken);
    app.post('/usuario/recuperar-senha', usuarioController.enviarCodigoRecuperacao);
    app.post('/usuario/atualizar-senha', usuarioController.atualizarSenha);
};
