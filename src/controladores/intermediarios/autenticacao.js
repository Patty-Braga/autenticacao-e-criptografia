const jwt = require('jsonwebtoken');
const senhaJwt = require('../../senha_jwt');
const pool = require('../../conexao');


const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt);
        const { rows, rowsCount } = await pool.query('select * from usuarios where id= $1', [id]);

        if (rowsCount > 1) {
            return res.status(401).json({ mensagem: 'Não autorizado' });
        }

        req.headers.id = id;
        req.usuario = rows[0];

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }
}


module.exports = verificarUsuarioLogado;