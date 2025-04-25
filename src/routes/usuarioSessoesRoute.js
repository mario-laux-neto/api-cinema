import usuarioSessoesController from "../controllers/usuarioSessoesController.js";

export default (app) => {
    // Rotas para usuário e sessão
    app.get('/usuarios-sessoes', usuarioSessoesController.get);
    app.get('/usuarios-sessoes/:id', usuarioSessoesController.get);
    app.post('/usuarios-sessoes', usuarioSessoesController.persist);
    app.patch('/usuarios-sessoes/:id', usuarioSessoesController.persist);
    app.patch('/usuarios-sessoes/cancelar/:id', usuarioSessoesController.cancel);
    app.get('/usuarios/:id/sessoes-compradas', usuarioSessoesController.listarSessoesCompradas);
    app.post('/comprar-ingresso/:idLugar', usuarioSessoesController.comprarIngressos);
    app.get('/sessoes-disponiveis', usuarioSessoesController.getSessoesDisponiveis);
    app.get('/relatorio-sessao/:idSessao', usuarioSessoesController.relatorioPorSessao);  
};
