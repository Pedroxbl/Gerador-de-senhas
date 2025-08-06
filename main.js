const slider = document.querySelector('#tamanho-senha');
const numeroSenha = document.querySelector('#tamanho-valor');

let tamanhoSenha = parseInt(slider.value);
numeroSenha.textContent = tamanhoSenha;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';

const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const valorEntropia = document.querySelector('.entropia');

// Atualiza tamanho da senha via slider
slider.addEventListener('input', () => {
    tamanhoSenha = parseInt(slider.value);
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
});

// Geração automática ao marcar opções
checkbox.forEach(cb => cb.addEventListener('click', geraSenha));

// Editar senha manualmente e avaliar
campoSenha.addEventListener('input', () => {
    const senha = campoSenha.value;
    const tamanhoAlfabeto = calcularAlfabeto(senha);
    classificaSenha(senha.length, tamanhoAlfabeto);
});

// Botão de copiar senha
document.getElementById('copiar').addEventListener('click', () => {
    navigator.clipboard.writeText(campoSenha.value);
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
});

// Gera nova senha
function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) alfabeto += letrasMaiusculas;
    if (checkbox[1].checked) alfabeto += letrasMinusculas;
    if (checkbox[2].checked) alfabeto += numeros;
    if (checkbox[3].checked) alfabeto += simbolos;

    if (alfabeto.length === 0) {
        campoSenha.value = '';
        classificaSenha(0, 0);
        return;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        const index = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[index];
    }

    campoSenha.value = senha;
    classificaSenha(tamanhoSenha, alfabeto.length);
}

// Classifica força da senha
function classificaSenha(tamanho, alfabetoTamanho) {
    if (alfabetoTamanho === 0 || tamanho === 0) {
        forcaSenha.className = 'forca';
        valorEntropia.textContent = '';
        return;
    }

    const entropia = tamanho * Math.log2(alfabetoTamanho);
    const dias = Math.floor((2 ** entropia) / (100e6 * 60 * 60 * 24));

    forcaSenha.className = 'forca';

    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35) {
        forcaSenha.classList.add('media');
    } else {
        forcaSenha.classList.add('fraca');
    }

    valorEntropia.textContent = `Estimativa: ${dias.toLocaleString()} dias para descobrir essa senha.`;
}

// Calcula alfabeto com base nos caracteres usados
function calcularAlfabeto(senha) {
    let charset = new Set();

    if (/[A-Z]/.test(senha)) letrasMaiusculas.split('').forEach(c => charset.add(c));
    if (/[a-z]/.test(senha)) letrasMinusculas.split('').forEach(c => charset.add(c));
    if (/[0-9]/.test(senha)) numeros.split('').forEach(c => charset.add(c));
    if (/[^A-Za-z0-9]/.test(senha)) simbolos.split('').forEach(c => charset.add(c));

    return charset.size;
}

// Gera senha inicial
geraSenha();
