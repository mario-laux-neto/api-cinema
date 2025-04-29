// Importa o controller responsável pelas operações com o recurso "usuário"
import usuarioController from "../controllers/usuarioController.js";

// Importa o middleware responsável por autenticar o token JWT
import authMiddleware from "../middlewares/autenticarTokenMiddleware.js";

// Exporta uma função que define as rotas relacionadas ao recurso "usuário"
export default (app) => {

    // Rota GET para listar todos os usuários
    app.get('/usuario', usuarioController.get);

    // Rota GET para obter um usuário específico pelo ID
    app.get('/usuario/:id', usuarioController.get);

    // Rota POST para criar um novo usuário
    app.post('/usuario', usuarioController.persist);

    // Rota PATCH para atualizar parcialmente um usuário existente
    app.patch('/usuario/:id', usuarioController.persist);

    // Rota DELETE para remover um usuário pelo ID
    app.delete('/usuario/:id', usuarioController.destroy);

    // Rota POST para login do usuário
    app.post('/usuario/login', usuarioController.login);

    // Rota GET para obter dados do usuário a partir de um token JWT, validado pelo middleware
    app.get('/usuario/token', authMiddleware, usuarioController.getDataByToken);

    // Rota POST para solicitar a recuperação de senha, enviando um código por e-mail ou outro meio
    app.post('/usuario/recuperar-senha', usuarioController.enviarCodigoRecuperacao);

    // Rota POST para atualizar a senha do usuário (geralmente após a verificação do código de recuperação)
    app.post('/usuario/atualizar-senha', usuarioController.atualizarSenha);
};
