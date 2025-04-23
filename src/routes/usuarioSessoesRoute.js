import usuarioSessoesController from "../controllers/usuarioSessoesController.js";

export default (app) => {
    // Buscar todas as sessões ou lugares livres de uma sessão via query param
    app.get('/usuarios-sessoes', usuarioSessoesController.get);

    // Buscar uma sessão específica de usuário
    app.get('/usuarios-sessoes/:id', usuarioSessoesController.get);

    // Criar nova compra (compra de ingresso)
    app.post('/usuarios-sessoes', usuarioSessoesController.persist);

    // Atualizar uma compra de ingresso
    app.patch('/usuarios-sessoes/:id', usuarioSessoesController.persist);

    // Excluir uma compra de ingresso
    app.delete('/usuarios-sessoes/:id', usuarioSessoesController.destroy);
};
