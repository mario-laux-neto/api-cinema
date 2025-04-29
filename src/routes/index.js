// Importa as rotas de diferentes módulos do sistema
import cargoRoute from "./cargoRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import padraoLugaresRoute from "./padraoLugaresRoute.js"; 
import filmeRoute from "./filmeRoute.js";  
import salaRoute from "./salaRoute.js";  
import usuarioSessoesRoutes from "./usuarioSessoesRoute.js";
import sessoesRoute from "./sessoesRoute.js";

// Importa o controller do usuário, utilizado diretamente abaixo
import usuarioController from "../controllers/usuarioController.js";

// Função que registra todas as rotas no app (instância do Express)
function Routes(app) {
    // Registra as rotas relacionadas a cargos
    cargoRoute(app);

    // Registra as rotas relacionadas a usuários
    usuarioRoute(app);

    // Registra as rotas relacionadas ao padrão de lugares (provavelmente disposição de assentos)
    padraoLugaresRoute(app);

    // Registra as rotas relacionadas a filmes
    filmeRoute(app);

    // Registra as rotas relacionadas a salas de cinema
    salaRoute(app);

    // Registra as rotas relacionadas à associação entre usuários e sessões
    usuarioSessoesRoutes(app);

    // Registra as rotas relacionadas às sessões de cinema
    sessoesRoute(app);

    // Rota POST específica para recuperação de senha de usuário
    app.post('/usuario/recuperar-senha', usuarioController.enviarCodigo);
};

// Exporta a função que configura todas as rotas da aplicação
export default Routes;
