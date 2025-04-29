// Middleware para logar a data e hora das requisições
export default (req, res, next) => {
    try {
        // Log da data e hora atual no formato ISO
        console.log(new Date(Date.now()).toISOString());

        // Chama o próximo middleware ou a rota, se não houver erro
        next();
    } catch (error) {
        // Caso ocorra um erro, retorna um erro 500 com a mensagem do erro
        return res.status(500).send({
            error: error.message
        });
    }
}
