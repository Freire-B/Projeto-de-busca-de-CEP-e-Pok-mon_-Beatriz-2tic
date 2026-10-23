from flask import Flask, request, jsonify
from flask_cors import CORS
from dao import PokemonDAO
from models import Pokemon

app = Flask(__name__)
CORS(app)

dao = PokemonDAO()

@app.route("/pokemons", methods=["GET"])
def listar_pokemons():
    lista = dao.buscar_todos()
    return jsonify([p.to_dict() for p in lista])

@app.route("/pokemons", methods=["POST"])
def criar_pokemon():
    dados = request.json
    novo = Pokemon(
        id=None,
        nome=dados["nome"],
        tipo=dados["tipo"],
        altura=dados["altura"],
        peso=dados["peso"]
    )
    id_gerado = dao.inserir(novo)
    return jsonify({"id": id_gerado, "mensagem": "Cadastrado com sucesso!"}), 201

if __name__ == "__main__":
    app.run(debug=True)