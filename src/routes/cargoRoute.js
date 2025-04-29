// Importa o controller responsável pelas operações com o recurso "cargo"
import cargoController from "../controllers/cargoController.js";

// Importa o middleware que trata alguma lógica relacionada ao tempo (ex: tempo de requisição)
import tempoMiddlewares from "../middlewares/tempoMiddleware.js";

// Exporta uma função que recebe o app (instância do Express) e define as rotas para o recurso "cargo"
export default (app) => {

    // Rota GET para listar todos os cargos, aplicando o middleware de tempo antes do controller
    app.get('/cargo', tempoMiddlewares, cargoController.get);

    // Rota GET para obter um cargo específico pelo ID
    app.get('/cargo/:id', cargoController.get);

    // Rota POST para criar um novo cargo
    app.post('/cargo', cargoController.persist);

    // Rota PATCH para atualizar parcialmente um cargo existente, reutilizando o método de persistência
    app.patch('/cargo/:id', cargoController.persist);

    // Rota DELETE para remover um cargo pelo ID
    app.delete('/cargo/:id', cargoController.destroy);
};
