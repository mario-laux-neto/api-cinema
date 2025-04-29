// Importa o controller responsável pelas operações com o recurso "filmes"
import filmeController from "../controllers/filmeController.js";

// Exporta uma função que recebe o app (instância do Express) e define as rotas para o recurso "filmes"
export default (app) => {

    // Rota GET para listar todos os filmes
    app.get('/filmes', filmeController.get);

    // Rota GET para obter um filme específico pelo ID
    app.get('/filmes/:id', filmeController.get);

    // Rota POST para criar um novo filme
    app.post('/filmes', filmeController.persist);

    // Rota PATCH para atualizar parcialmente um filme existente
    app.patch('/filmes/:id', filmeController.persist);

    // Rota DELETE para remover um filme pelo ID
    app.delete('/filmes/:id', filmeController.destroy);
};
