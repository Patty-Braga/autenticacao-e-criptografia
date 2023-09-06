const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senha_jwt');

const cadastraUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        )
        return res.status(201).json(novoUsuario.rows[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'erro interno do servidor' });

    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {

        const usuario = await pool.query('select * from usuarios where email = $1', [email]);

        if (usuario.rowCount < 1) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos, tente novamente!' });
        }

        const senhaValidada = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValidada) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos, tente novamente!' });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: '8h' })

        const { senha: _, ...usuarioLogado } = usuario.rows[0];

        return res.json({ senha: usuarioLogado, token })

    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno do servidor' });
    }
}

module.exports = {
    cadastraUsuario,
    login,
}