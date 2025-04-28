import cargoRoute from "./cargoRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import padraoLugaresRoute from "./padraoLugaresRoute.js"; 
import filmeRoute from "./filmeRoute.js";  
import salaRoute from "./salaRoute.js";  
import usuarioSessoesRoutes from "./usuarioSessoesRoute.js";
import sessoesRoute from "./sessoesRoute.js";
import usuarioController from "../controllers/usuarioController.js";


function Routes(app) {
    cargoRoute(app);
    usuarioRoute(app);
    padraoLugaresRoute(app);  
    filmeRoute(app);  
    salaRoute(app);  
    usuarioSessoesRoutes(app);
    sessoesRoute(app);
    app.post('/usuario/recuperar-senha', usuarioController.enviarCodigo);
};
    


export default Routes;
