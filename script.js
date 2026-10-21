let btnBuscar = document.querySelector("#btnBuscar");
let btnBuscarPoke = document.querySelector("#btnBuscarPoke");
let btnLimpar = document.querySelector("#btnLimpar");

let inputCep = document.querySelector("#cep");
let inputPoke = document.querySelector("#pokemon");

let resultadoCep = document.querySelector("#resultadoCep");
let resultadoPoke = document.querySelector("#resultadoPoke");

let erroCep = document.querySelector("#erroCep");
let erroPoke = document.querySelector("#erroPoke");

let carregandoCep = document.querySelector("#carregandoCep");
let carregandoPoke = document.querySelector("#carregandoPoke");

async function buscarCEP() {
    try {
        erroCep.style.display = "none";
        resultadoCep.innerHTML = "";

        let cepLimpo = inputCep.value.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            throw new Error("Digite os 8 números do CEP.");
        }

        let resposta = await fetch("https://viacep.com.br/ws/" + cepLimpo + "/json/");

        if (!resposta.ok) {
            throw new Error("Não consegui buscar o CEP.");
        }

        let dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado.");
        }

        resultadoCep.innerHTML =
            "<p><strong>Rua:</strong> " + (dados.logradouro || "Não informado") + "</p>" +
            "<p><strong>Bairro:</strong> " + (dados.bairro || "Não informado") + "</p>" +
            "<p><strong>Cidade:</strong> " + dados.localidade + " — " + dados.uf + "</p>";

    } catch (erro) {
        erroCep.textContent = erro.message;
        erroCep.style.display = "block";
    }
}

async function buscarPokemon() {
    try {
        erroPoke.style.display = "none";
        resultadoPoke.innerHTML = "";

        let nome = inputPoke.value.toLowerCase().trim();

        if (!nome) {
            throw new Error("Digite um nome ou número.");
        }

        let resposta = await fetch("https://pokeapi.co/api/v2/pokemon/" + nome);

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }

        let dados = await resposta.json();
        let tipos = dados.types.map(function(t) { return t.type.name; }).join(", ");

        resultadoPoke.innerHTML =
            "<p><strong>Nome:</strong> " + dados.name.toUpperCase() + "</p>" +
            "<p><strong>Nº:</strong> " + dados.id + "</p>" +
            "<p><strong>Peso:</strong> " + (dados.weight / 10).toFixed(1) + " kg</p>" +
            "<p><strong>Altura:</strong> " + (dados.height / 10).toFixed(1) + " m</p>" +
            "<p><strong>Tipos:</strong> " + tipos + "</p>" +
            "<img src='" + dados.sprites.front_default + "'>";

    } catch (erro) {
        erroPoke.textContent = erro.message;
        erroPoke.style.display = "block";
    }
}

btnBuscar.addEventListener("click", buscarCEP);
btnBuscarPoke.addEventListener("click", buscarPokemon);

btnLimpar.addEventListener("click", function() {
    inputCep.value = "";
    inputPoke.value = "";
    resultadoCep.innerHTML = "";
    resultadoPoke.innerHTML = "";
    erroCep.style.display = "none";
    erroPoke.style.display = "none";
});