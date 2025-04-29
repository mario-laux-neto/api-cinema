// Importa o controller responsável pelas operações com o recurso "padrão de lugares"
// (possivelmente relacionado à disposição padrão de assentos em salas)
import padraoLugaresController from "../controllers/padraoLugaresController.js";

// Exporta uma função que define as rotas para o recurso "padrão de lugares"
export default (app) => {

    // Rota GET para listar todos os padrões de lugares
    app.get('/padrao-lugares', padraoLugaresController.get);

    // Rota GET para obter um padrão de lugares específico pelo ID
    app.get('/padrao-lugares/:id', padraoLugaresController.get);

    // Rota POST para criar um novo padrão de lugares
    app.post('/padrao-lugares', padraoLugaresController.persist);

    // Rota PATCH para atualizar parcialmente um padrão de lugares existente
    app.patch('/padrao-lugares/:id', padraoLugaresController.persist);

    // Rota DELETE para remover um padrão de lugares pelo ID
    app.delete('/padrao-lugares/:id', padraoLugaresController.destroy);
};
