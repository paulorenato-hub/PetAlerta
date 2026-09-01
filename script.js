const form = document.getElementById('formPet');
const listaDePets = document.getElementById('listaDePets');
const mensagemVazia = document.getElementById('mensagemVazia');
const STORAGE_KEY = 'listaDePets';

function salvarPets(pets) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

function carregarPets() {
    const petsSalvos = localStorage.getItem(STORAGE_KEY);

    if (!petsSalvos) {
        return [];
    }

    try {
        return JSON.parse(petsSalvos);
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        return [];
    }
}

function renderizarPets() {
    const pets = carregarPets();
    listaDePets.innerHTML = '';

    if (pets.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    }

    mensagemVazia.style.display = 'none';

    pets.forEach((pet) => {
        const li = document.createElement('li');

        li.innerHTML = `
            <img src="${pet.foto}" alt="${pet.nome}" class="foto-pet">
            <div>
                <h4>${pet.nome}</h4>
                <p>${pet.info}</p>
            </div>
            <button class="btn-remover" type="button" data-id="${pet.id}">Remover</button>
        `;

        listaDePets.appendChild(li);
    });

    document.querySelectorAll('.btn-remover').forEach((botao) => {
        botao.addEventListener('click', function () {
            const id = Number(this.dataset.id);
            const petsAtualizados = carregarPets().filter((pet) => pet.id !== id);
            salvarPets(petsAtualizados);
            renderizarPets();
        });
    });
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nomePet = document.getElementById('nomePet').value.trim();
    const infoPet = document.getElementById('infoPet').value.trim();
    const fotoPet = document.getElementById('fotoPet').files[0];

    if (!nomePet || !infoPet || !fotoPet) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function () {
        const pets = carregarPets();
        const novoPet = {
            id: Date.now(),
            nome: nomePet,
            info: infoPet,
            foto: leitor.result
        };

        pets.push(novoPet);
        salvarPets(pets);
        renderizarPets();
        form.reset();
    };

    leitor.readAsDataURL(fotoPet);
});

renderizarPets();