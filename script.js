document.addEventListener("DOMContentLoaded", () => {
    // Seleccionar todos los enlaces dentro de los boxes
    const boxLinks = document.querySelectorAll("#box-navigation ul li a");

    // Seleccionar el elemento donde se mostrará el box seleccionado
    const selectedBoxElement = document.querySelector("#selected-box h2");

    // Objeto para almacenar los datos de cada box
    const boxData = {};

    // Seleccionar todas las secciones que necesitan opacidad
    const seccionesPerdidasIngresos = document.querySelectorAll("#perdidas, #ingresos");

    // Seleccionar los inputs necesarios
    const pesoInput = document.querySelector("#peso-box");
    const horasDesdeIngresoInput = document.querySelector("#horas-desde-ingreso-box");

    // Inicialmente aplicar opacidad a las secciones de pérdidas e ingresos
    seccionesPerdidasIngresos.forEach(section => {
        section.style.opacity = "0.3";
        section.style.pointerEvents = "none"; // Deshabilitar interacción
    });

    // Función para verificar si se puede habilitar las secciones
    function verificarHabilitacion() {
        const pesoValido = pesoInput && pesoInput.value.trim() !== "";
        const horasDesdeIngresoValido = horasDesdeIngresoInput && horasDesdeIngresoInput.value.trim() !== "";

        if (pesoValido && horasDesdeIngresoValido) {
            // Quitar opacidad y habilitar interacción
            seccionesPerdidasIngresos.forEach(section => {
                section.style.opacity = "1";
                section.style.pointerEvents = "auto";
            });
        } else {
            // Mantener opacidad y deshabilitar interacción
            seccionesPerdidasIngresos.forEach(section => {
                section.style.opacity = "0.3";
                section.style.pointerEvents = "none";
            });
        }
    }

    // Agregar eventos para verificar en tiempo real
    pesoInput?.addEventListener("input", verificarHabilitacion);
    horasDesdeIngresoInput?.addEventListener("input", verificarHabilitacion);

    // Seleccionar todos los inputs dinámicamente
    const allInputs = document.querySelectorAll("input");

    // Función para guardar los datos del box actual
    function saveCurrentBoxData(boxNumber) {
        const data = {};
        allInputs.forEach(input => {
            data[input.id] = input.value;
        });
        boxData[boxNumber] = data;
    }

    // Función para cargar los datos de un box seleccionado
    function loadBoxData(boxNumber) {
        const data = boxData[boxNumber] || {};
        allInputs.forEach(input => {
            input.value = data[input.id] || "";
        });
    }

    // Función para calcular valores basados en las fórmulas
    function calculateDerivedValues() {
        const getValue = (id) => parseFloat(document.querySelector(id)?.value) || 0;

        const peso = getValue("#peso-box");
        const horasDesdeIngreso = getValue("#horas-desde-ingreso-box");
        const fiebre37Horas = getValue("#fiebre37-horas-box");
        const fiebre38Horas = getValue("#fiebre38-horas-box");
        const fiebre39Horas = getValue("#fiebre39-horas-box");
        const rpm25Horas = getValue("#rpm25-horas-box");
        const rpm35Horas = getValue("#rpm35-horas-box");
        const vomitosSudor = getValue("#perdida-vomitos-box");

        const diuresis = getValue("#perdida-orina-box");
        const sng = getValue("#perdida-sng-box");
        const hdfvvc = getValue("#perdida-hdfvvc-box");
        const drenajes = getValue("#perdida-drenajes-box");

        const midazolam = getValue("#ingreso-midazolam-box");
        const fentanest = getValue("#ingreso-fentanest-box");
        const propofol = getValue("#ingreso-propofol-box");
        const remifentanilo = getValue("#ingreso-remifentanilo-box");
        const dexdor = getValue("#ingreso-dexdor-box");
        const noradrenalina = getValue("#ingreso-noradrenalina-box");
        const insulina = getValue("#ingreso-insulina-box");
        const sueroterapia1 = getValue("#ingreso-sueroterapia1-box");
        const sueroterapia2 = getValue("#ingreso-sueroterapia2-box");
        const sueroterapia3 = getValue("#ingreso-sueroterapia3-box");
        const medicacion = getValue("#ingreso-medicacion-box");
        const sangrePlasma = getValue("#ingreso-sangreplasma-box");
        const oral = getValue("#ingreso-oral-box");
        const enteral = getValue("#ingreso-enteral-box");
        const parenteral = getValue("#ingreso-parenteral-box");

        // Calcular valores derivados
        const calculoFiebre37 = peso * 0.1 * fiebre37Horas;
        const calculoFiebre38 = peso * 0.2 * fiebre38Horas;
        const calculoFiebre39 = peso * 0.3 * fiebre39Horas;
        const calculoRpm25 = peso * 0.2 * rpm25Horas;
        const calculoRpm35 = peso * 0.3 * rpm35Horas;
        const perdidasInsensibles = peso * 0.5 * horasDesdeIngreso;
        const calculoVomitosSudor = vomitosSudor + calculoFiebre37 + calculoFiebre38 + calculoFiebre39 + calculoRpm25 + calculoRpm35;

        const totalPerdidas = diuresis + sng + hdfvvc + drenajes + perdidasInsensibles + calculoVomitosSudor;
        const balancePerdidas = diuresis + sng + hdfvvc + drenajes + perdidasInsensibles + calculoVomitosSudor;

        const aguaEndogena = horasDesdeIngreso > 20 ? 400 : 20 * horasDesdeIngreso;
        const totalIngresos = midazolam + fentanest + propofol + remifentanilo + dexdor + noradrenalina + insulina + sueroterapia1 + sueroterapia2 + sueroterapia3 + medicacion + sangrePlasma + aguaEndogena + oral + enteral + parenteral;
        const balanceIngresos = midazolam + fentanest + propofol + remifentanilo + dexdor + noradrenalina + insulina + sueroterapia1 + sueroterapia2 + sueroterapia3 + medicacion + sangrePlasma + aguaEndogena + oral + enteral + parenteral;

        const balanceTotal = totalIngresos - totalPerdidas;

        // Actualizar campos de Totales y Balances
        const updateTextContent = (id, value) => {
            const element = document.querySelector(id);
            if (element) element.textContent = value.toFixed(2);
        };

        updateTextContent("#total-ingresos-balance", totalIngresos);
        updateTextContent("#total-perdidas-balance", totalPerdidas);
        updateTextContent("#balance-total", balanceTotal);

        // Asignar valores calculados a los inputs específicos
        const setValue = (id, value) => {
            const input = document.querySelector(id);
            if (input) input.value = value.toFixed(2);
        };

        setValue("#fiebre37-calculo-box", calculoFiebre37);
        setValue("#fiebre38-calculo-box", calculoFiebre38);
        setValue("#fiebre39-calculo-box", calculoFiebre39);
        setValue("#rpm25-calculo-box", calculoRpm25);
        setValue("#rpm35-calculo-box", calculoRpm35);
        setValue("#perdidas-insensibles-box", perdidasInsensibles);
        setValue("#perdida-fuerafluidos-box", calculoVomitosSudor);
        setValue("#total-perdidas-box", totalPerdidas);
        setValue("#balance-total-perdidas-box", balancePerdidas);
        setValue("#ingreso-agua-endogena-box", aguaEndogena);
        setValue("#resumen-total-ingresos-box", totalIngresos);
        setValue("#balance-total-ingresos-box", balanceIngresos);


        // Cambiar color del campo Balance Total
        // Cambiar color y mostrar el contenido del campo Balance Total
const balanceTotalField = document.querySelector("#balance-total-box");
if (balanceTotalField) {
    balanceTotalField.style.backgroundColor = balanceTotal >= 0 ? "#add8e6" : "#f08080"; // Azul claro para positivo, rojo claro para negativo
    balanceTotalField.style.color = "black"; // Asegura que el texto sea siempre visible
    balanceTotalField.style.fontWeight = "bold"; // Resalta el texto
    balanceTotalField.value = balanceTotal.toFixed(2); // Asegura que el valor sea visible y actualizado
}




    }

    // Iterar sobre cada enlace y agregar un evento click
    boxLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

            // Guardar los datos del box actual antes de cambiar
            const currentBox = selectedBoxElement.getAttribute("data-current-box");
            if (currentBox) {
                saveCurrentBoxData(currentBox);
            }

            // Obtener el número de box desde el atributo data-box
            const boxNumber = link.getAttribute("data-box");

            // Cargar los datos del nuevo box
            loadBoxData(boxNumber);

            // Actualizar el texto del elemento seleccionado
            selectedBoxElement.textContent = `Has seleccionado el Box ${boxNumber}`;
            selectedBoxElement.setAttribute("data-current-box", boxNumber);

            // Recalcular valores
            calculateDerivedValues();
        });
    });

    // Agregar eventos de input para recalcular los valores derivados
    allInputs.forEach(input => {
        input.addEventListener("input", calculateDerivedValues);
    });

    // Restricciones de valores entre 0 y 24 para los campos específicos
    const restrictedInputs = [
        "#horas-desde-ingreso-box",
        "#fiebre37-horas-box",
        "#fiebre38-horas-box",
        "#fiebre39-horas-box",
        "#rpm25-horas-box",
        "#rpm35-horas-box"
    ];

    restrictedInputs.forEach(selector => {
        const input = document.querySelector(selector);
        if (input) {
            input.addEventListener("input", () => {
                let value = parseInt(input.value, 10);
                if (isNaN(value) || value < 0) {
                    input.value = 0;
                } else if (value > 24) {
                    input.value = 24;
                }
            });
        }
    });

    // Botones para borrar los datos del box actual
    const deleteButtons = document.querySelectorAll("button#borrar-datos");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const currentBox = selectedBoxElement.getAttribute("data-current-box");
            if (currentBox) {
                // Limpiar los datos almacenados para el box actual
                boxData[currentBox] = {};

                // Limpiar los valores visibles en los inputs
                allInputs.forEach(input => {
                    input.value = "";
                });

                // Recalcular valores
                calculateDerivedValues();
            }
        });
    });

    // Lógica específica para el nuevo botón "Borrar Datos Principal"
    const mainDeleteButton = document.querySelector("#borrar-datos-principal");
    if (mainDeleteButton) {
        mainDeleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            const currentBox = selectedBoxElement.getAttribute("data-current-box");
            if (currentBox) {
                // Limpiar los datos almacenados para el box actual
                boxData[currentBox] = {};

                // Limpiar los valores visibles en los inputs
                allInputs.forEach(input => {
                    input.value = "";
                });

                // Recalcular valores
                calculateDerivedValues();
            }

            // Mostrar mensaje adicional o realizar otras acciones
            alert("Datos del Box borrados correctamente");
        });
    }

    // Verificar habilitación inicial al cargar la página
    verificarHabilitacion();
});
document.addEventListener("DOMContentLoaded", () => {
    const pesoInput = document.querySelector("#peso-box");
    const horasDesdeIngresoInput = document.querySelector("#horas-desde-ingreso-box");
    const boxLosses = document.querySelector("#box-losses");
    const boxEarings = document.querySelector("#box-earings");
    const selectedBoxElement = document.querySelector("#selected-box h2");
    const boxLinks = document.querySelectorAll("#box-navigation ul li a");

    // Aplicar clase 'disabled' al inicio
    boxLosses.classList.add("disabled");
    boxEarings.classList.add("disabled");

    let boxSeleccionado = false;

    // Función para verificar si habilitar los inputs
    function verificarHabilitacion() {
        const pesoValido = pesoInput.value.trim() !== "";
        const horasDesdeIngresoValido = horasDesdeIngresoInput.value.trim() !== "";

        if (pesoValido && horasDesdeIngresoValido && boxSeleccionado) {
            boxLosses.classList.remove("disabled");
            boxEarings.classList.remove("disabled");
        } else {
            boxLosses.classList.add("disabled");
            boxEarings.classList.add("disabled");
        }
    }

    // Detectar selección de un box
    boxLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            boxSeleccionado = true;
            verificarHabilitacion();
        });
    });

    // Agregar eventos a los inputs para detectar cambios
    pesoInput.addEventListener("input", verificarHabilitacion);
    horasDesdeIngresoInput.addEventListener("input", verificarHabilitacion);
});
