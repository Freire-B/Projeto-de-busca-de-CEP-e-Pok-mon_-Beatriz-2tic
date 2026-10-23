class Pokemon:
    def __init__(self, id, nome, tipo, altura, peso):
        self.id = id
        self.nome = nome
        self.tipo = tipo
        self.altura = altura
        self.peso = peso

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "tipo": self.tipo,
            "altura": self.altura,
            "peso": self.peso
        }