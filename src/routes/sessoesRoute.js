// Importa o controller responsável pelas operações com o recurso "sessões"
// (relacionado às sessões de filmes em salas de cinema)
import sessaoController from "../controllers/sessoesController.js";

// Exporta uma função que define as rotas para o recurso "sessões"
export default (app) => {

    // Rota GET para listar todas as sessões
    app.get('/sessoes', sessaoController.get);

    // Rota GET para obter uma sessão específica pelo ID
    app.get('/sessoes/:id', sessaoController.get);

    // Rota POST para criar uma nova sessão
    app.post('/sessoes', sessaoController.persist);

    // Rota PATCH para atualizar parcialmente uma sessão existente
    app.patch('/sessoes/:id', sessaoController.persist);

    // Rota DELETE para remover uma sessão pelo ID
    app.delete('/sessoes/:id', sessaoController.destroy);
}
