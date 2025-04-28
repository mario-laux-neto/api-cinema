import path from 'path'

/**
 * @param file Deve ser um arquivo que venha do req.files
 * @param params deve ser um objeto contendo {tipo, dabela, id}.
 * id: Chave primaria que tera ligação com a foto
 * tabela: tabel que o id está cadastrado
 * tipo: tipo do arquivo ex imagem ou arquivo
 * @return objeto contendo erro ou sucesso
 */
export default async (file, params) => {
    try {
        let extensao = path.extname(file.name);
        let filePath = `public/${params.tipo}/${params.tabela}/${params.id}/${extensao}`
        let uploadPath = `${__dirname}/../../${filePath}`
        await file.mv(uploadPath)

        return{
            type: 'success',
            message: uploadPath
        }

    } catch (error) {
        return {
            type: 'erro',
            message: error.message
        }
    }
}