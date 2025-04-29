// Importa o módulo path para lidar com caminhos de arquivos
import path from 'path'

/**
 * Função para mover e salvar um arquivo enviado via `req.files` para um diretório específico.
 * @param file - O arquivo que veio do `req.files`.
 * @param params - Um objeto contendo {tipo, tabela, id}.
 *    id: Chave primária que terá ligação com a foto.
 *    tabela: A tabela em que o id está cadastrado.
 *    tipo: O tipo do arquivo (ex: imagem ou arquivo).
 * @return - Objeto contendo tipo e mensagem (sucesso ou erro).
 */
export default async (file, params) => {
    try {
        // Obtém a extensão do arquivo (ex: .jpg, .png)
        let extensao = path.extname(file.name);
        
        // Define o caminho relativo para onde o arquivo será salvo
        let filePath = `public/${params.tipo}/${params.tabela}/${params.id}/${extensao}`;
        
        // Define o caminho absoluto para o arquivo no sistema de arquivos
        let uploadPath = `${__dirname}/../../${filePath}`;
        
        // Move o arquivo para o caminho especificado
        await file.mv(uploadPath);

        // Retorna um objeto de sucesso, com o caminho completo do arquivo salvo
        return {
            type: 'success',
            message: uploadPath
        }

    } catch (error) {
        // Retorna um objeto de erro caso haja algum problema no processo
        return {
            type: 'erro',
            message: error.message
        }
    }
}
