import sqlite3
from models import Pokemon

class PokemonDAO:
    def __init__(self, caminho_banco="pokemon.db"):
        self.caminho_banco = caminho_banco
        self.criar_tabela()

    def criar_tabela(self):
        with sqlite3.connect(self.caminho_banco) as conexao:
            cursor = conexao.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pokemons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    tipo TEXT NOT NULL,
                    altura REAL NOT NULL,
                    peso REAL NOT NULL
                )
            """)
            conexao.commit()

    def buscar_todos(self):
        with sqlite3.connect(self.caminho_banco) as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome, tipo, altura, peso FROM pokemons")
            linhas = cursor.fetchall()
            return [Pokemon(*linha) for linha in linhas]

    def inserir(self, pokemon):
        with sqlite3.connect(self.caminho_banco) as conexao:
            cursor = conexao.cursor()
            cursor.execute(
                "INSERT INTO pokemons (nome, tipo, altura, peso) VALUES (?, ?, ?, ?)",
                (pokemon.nome, pokemon.tipo, pokemon.altura, pokemon.peso)
            )
            conexao.commit()
            return cursor.lastrowid