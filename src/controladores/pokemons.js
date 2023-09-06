const pool = require('../conexao')

const cadastraPokemon = async (req, res) => {
    const { nome, apelido, habilidades, imagem } = req.body
    const { id } = req.headers


    try {

        const queryText = 'insert into pokemons (usuario_id, nome, habilidades, imagem, apelido) values ($1, $2, $3, $4, $5) returning *';

        const queryParams = [id, nome, habilidades, imagem, apelido];

        const { rows } = await pool.query(queryText, queryParams);

        return res.status(201).json(rows[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json('Erro interno do servidor')
    }
}

const atualizaPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const { apelido } = req.body

        const { rows, rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount > 1) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' });
        }

        await pool.query('update pokemons set apelido = $1 where id = $2', [apelido, id]);
        return res.status(204).send()
    } catch (error) {
        console.log(error);
        return res.status(500).json('Erro interno do servidor');
    }
}

const listaTodosPokemons = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from pokemons');

        return res.status(201).json(rows);

    } catch (error) {
        return res.status(500).json('Erro interno do servidor');
    }
}

const detalhaPokemon = async (req, res) => {
    const { id } = req.params

    try {
        const { rows, rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' });
        }

        return res.json(rows[0])
    } catch (error) {
        return res.status(500).json('Erro interno do servidor');
    }
}

const excluiPokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows, rowCount } = await pool.query(
            'select * from pokemons where id = $1',
            [id]
        )

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: 'Pokemon não encontrado' })
        }

        await pool.query('delete from pokemons where id = $1', [id])

        return res.status(204).send()


    } catch (error) {
        return res.status(500).json('Erro interno do servidor');
    }
}


module.exports = {
    cadastraPokemon,
    atualizaPokemon,
    listaTodosPokemons,
    detalhaPokemon,
    excluiPokemon
}