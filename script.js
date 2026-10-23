let API_FLASK = "http://127.0.0.1:5000/pokemons";

let btnBuscar = document.querySelector("#btnBuscar");
let btnBuscarPoke = document.querySelector("#btnBuscarPoke");
let btnLimpar = document.querySelector("#btnLimpar");
let btnAtualizar = document.querySelector("#btnAtualizar");

let inputCep = document.querySelector("#cep");
let inputPoke = document.querySelector("#pokemon");

let resultadoCep = document.querySelector("#resultadoCep");
let resultadoPoke = document.querySelector("#resultadoPoke");
let listaBanco = document.querySelector("#listaBanco");

let erroCep = document.querySelector("#erroCep");
let erroPoke = document.querySelector("#erroPoke");
let mensagemCadastro = document.querySelector("#mensagemCadastro");

let carregandoCep = document.querySelector("#carregandoCep");
let carregandoPoke = document.querySelector("#carregandoPoke");

let formCadastro = document.querySelector("#formCadastro");
let inputNome = document.querySelector("#nome");
let inputTipo = document.querySelector("#tipo");
let inputAltura = document.querySelector("#altura");
let inputPeso = document.querySelector("#peso");

async function buscarCEP() {
    try {
        erroCep.style.display = "none";
        resultadoCep.innerHTML = "";
        carregandoCep.style.display = "block";
        btnBuscar.disabled = true;

        let cepLimpo = inputCep.value.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            throw new Error("O CEP precisa ter 8 dígitos.");
        }

        let resposta = await fetch("https://viacep.com.br/ws/" + cepLimpo + "/json/");

        if (!resposta.ok) throw new Error("Servidor não respondeu.");

        let dados = await resposta.json();
        if (dados.erro) throw new Error("CEP não encontrado.");

        resultadoCep.innerHTML =
            "<p class='sucesso'>✅ Endereço encontrado!</p>" +
            "<p><strong>Rua:</strong> " + (dados.logradouro || "Não informado") + "</p>" +
            "<p><strong>Bairro:</strong> " + (dados.bairro || "Não informado") + "</p>" +
            "<p><strong>Cidade:</strong> " + dados.localidade + " — " + dados.uf + "</p>";

    } catch (erro) {
        erroCep.textContent = erro.message;
        erroCep.style.display = "block";
    } finally {
        carregandoCep.style.display = "none";
        btnBuscar.disabled = false;
    }
}

async function buscarPokemon() {
    try {
        erroPoke.style.display = "none";
        resultadoPoke.innerHTML = "";
        carregandoPoke.style.display = "block";
        btnBuscarPoke.disabled = true;

        let nome = inputPoke.value.toLowerCase().trim();
        if (!nome) throw new Error("Digite um nome ou número.");

        let resposta = await fetch("https://pokeapi.co/api/v2/pokemon/" + nome);
        if (!resposta.ok) throw new Error("Pokémon não encontrado.");

        let dados = await resposta.json();
        let tipos = dados.types.map(t => t.type.name).join(", ");

        resultadoPoke.innerHTML =
            "<p class='sucesso'>✅ Encontrado!</p>" +
            "<p><strong>Nº:</strong> " + dados.id + "</p>" +
            "<p><strong>Nome:</strong> " + dados.name.toUpperCase() + "</p>" +
            "<p><strong>Peso:</strong> " + (dados.weight / 10).toFixed(1) + " kg</p>" +
            "<p><strong>Altura:</strong> " + (dados.height / 10).toFixed(1) + " m</p>" +
            "<p><strong>Tipos:</strong> " + tipos + "</p>" +
            "<img src='" + dados.sprites.front_default + "'>";

    } catch (erro) {
        erroPoke.textContent = erro.message;
        erroPoke.style.display = "block";
    } finally {
        carregandoPoke.style.display = "none";
        btnBuscarPoke.disabled = false;
    }
}

async function listarDoBanco() {
    try {
        listaBanco.innerHTML = "<p>Carregando...</p>";
        
        let resposta = await fetch(API_FLASK);
        if (!resposta.ok) throw new Error("Erro ao buscar lista.");
        
        let dados = await resposta.json();
        
        if (dados.length === 0) {
            listaBanco.innerHTML = "<p>Nenhum Pokémon cadastrado ainda.</p>";
            return;
        }

        listaBanco.innerHTML = "";
        dados.forEach(p => {
            listaBanco.innerHTML +=
                "<div class='item'>" +
                "<p><strong>" + p.nome + "</strong></p>" +
                "<p>Tipo: " + p.tipo + " | Altura: " + p.altura + "m | Peso: " + p.peso + "kg</p>" +
                "</div>";
        });

    } catch (erro) {
        listaBanco.innerHTML = "<p class='erro'>" + erro.message + "</p>";
    }
}

formCadastro.addEventListener("submit", async function(e) {
    e.preventDefault();
    mensagemCadastro.textContent = "";

    let dados = {
        nome: inputNome.value,
        tipo: inputTipo.value,
        altura: parseFloat(inputAltura.value),
        peso: parseFloat(inputPeso.value)
    };

    try {
        let resposta = await fetch(API_FLASK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) throw new Error("Erro ao cadastrar.");

        mensagemCadastro.textContent = "✅ Cadastrado com sucesso!";
        mensagemCadastro.className = "sucesso";
        formCadastro.reset();
        listarDoBanco();

    } catch (erro) {
        mensagemCadastro.textContent = erro.message;
        mensagemCadastro.className = "erro";
    }
});

btnBuscar.addEventListener("click", buscarCEP);
btnBuscarPoke.addEventListener("click", buscarPokemon);
btnAtualizar.addEventListener("click", listarDoBanco);

inputCep.addEventListener("keydown", e => e.key === "Enter" && buscarCEP());
inputPoke.addEventListener("keydown", e => e.key === "Enter" && buscarPokemon());

btnLimpar.addEventListener("click", () => {
    inputCep.value = "";
    inputPoke.value = "";
    resultadoCep.innerHTML = "";
    resultadoPoke.innerHTML = "";
    erroCep.style.display = "none";
    erroPoke.style.display = "none";
    mensagemCadastro.textContent = "";
    inputCep.focus();
});

listarDoBanco();