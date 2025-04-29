// Importa o controller responsável pelas operações com o recurso "salas"
// (provavelmente relacionado às salas de cinema)
import salaController from "../controllers/salaController.js";

// Exporta uma função que define as rotas para o recurso "salas"
export default (app) => {

    // Rota GET para listar todas as salas
    app.get('/salas', salaController.get);

    // Rota GET para obter uma sala específica pelo ID
    app.get('/salas/:id', salaController.get);

    // Rota POST para criar uma nova sala
    app.post('/salas', salaController.persist);

    // Rota PATCH para atualizar parcialmente uma sala existente
    app.patch('/salas/:id', salaController.persist);

    // Rota DELETE para remover uma sala pelo ID
    app.delete('/salas/:id', salaController.destroy);
};
