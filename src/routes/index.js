import cargoRoute from "./cargoRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import padraoLugaresRoute from "./padraoLugaresRoute.js"; 
import filmeRoute from "./filmeRoute.js";  
import salaRoute from "./salaRoute.js";  
import usuarioSessoesRoutes from "./usuarioSessoesRoute.js";
import sessoesRoute from "./sessoesRoute.js";


function Routes(app) {
    cargoRoute(app);
    usuarioRoute(app);
    padraoLugaresRoute(app);  
    filmeRoute(app);  
    salaRoute(app);  
    usuarioSessoesRoutes(app);
    sessoesRoute(app);

    
}

export default Routes;
