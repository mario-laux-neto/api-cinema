// Importa o controller responsável pelas operações envolvendo a relação entre usuários e sessões
import usuarioSessoesController from "../controllers/usuarioSessoesController.js";

// Exporta uma função que define as rotas relacionadas ao relacionamento entre usuários e sessões
export default (app) => {

    // Rota GET para listar todas as associações entre usuários e sessões
    app.get('/usuarios-sessoes', usuarioSessoesController.get);

    // Rota GET para obter uma associação específica entre usuário e sessão por ID
    app.get('/usuarios-sessoes/:id', usuarioSessoesController.get);

    // Rota POST para criar uma nova associação (ex: usuário comprando ingresso para uma sessão)
    app.post('/usuarios-sessoes', usuarioSessoesController.persist);

    // Rota PATCH para atualizar uma associação existente
    app.patch('/usuarios-sessoes/:id', usuarioSessoesController.persist);

    // Rota PATCH específica para cancelar uma compra de ingresso ou associação à sessão
    app.patch('/usuarios-sessoes/cancelar/:id', usuarioSessoesController.cancel);

    // Rota GET para listar todas as sessões compradas por um usuário específico
    app.get('/usuarios/:id/sessoes-compradas', usuarioSessoesController.listarSessoesCompradas);

    // Rota POST para realizar a compra de ingresso em um lugar específico de uma sessão
    app.post('/comprar-ingresso/:idLugar', usuarioSessoesController.comprarIngressos);

    // Rota GET para listar sessões disponíveis para compra (possivelmente filtradas por data, lotação etc.)
    app.get('/sessoes-disponiveis', usuarioSessoesController.getSessoesDisponiveis);

    // Rota GET para gerar ou visualizar um relatório referente a uma sessão específica
    app.get('/relatorio-sessao/:idSessao', usuarioSessoesController.relatorioPorSessao);  
};
