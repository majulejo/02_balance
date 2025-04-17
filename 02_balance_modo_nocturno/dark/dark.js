const switchElement = document.querySelector(".switch");
cargarDarkModeDesdeLocalStorage() 

document.addEventListener('DOMContentLoaded', e => {
    switchElement.addEventListener("click", toggleDarkMode)    
    })
    
function toggleDarkMode (){
    switchElement.classList.toggle("active");
    document.body.classList.toggle('active');
guardarDarkModeEnLocalStorage(switchElement.classList.contains('active'))
}
function guardarDarkModeEnLocalStorage (estado) {
localStorage.setItem('darkMode', estado)    
}

function cargarDarkModeDesdeLocalStorage() {
    const darkModeGuardado = localStorage.getItem('darkMode') === 'true';
    if(darkModeGuardado) {
        switchElement.classList.add("active");
        document.body.classList.add('active');
    }
}
