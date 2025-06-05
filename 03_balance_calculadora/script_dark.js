document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  const pesoInput = document.querySelector("#peso-box");
  const horasDesdeIngresoInput = document.querySelector("#horas-desde-ingreso-box");
  const boxLosses = document.querySelector("#box-losses");
  const boxEarings = document.querySelector("#box-earings");
  const selectedBoxElement = document.querySelector("#selected-box h2");
  const boxLinks = document.querySelectorAll("#box-navigation ul li a");
  const allInputs = document.querySelectorAll("input");

  // Objeto para almacenar los datos de cada box
  const boxData = {};

  // Aplicar clase 'disabled' y deshabilitar campos al inicio
  boxLosses.classList.add("disabled");
  boxEarings.classList.add("disabled");

  if (pesoInput) pesoInput.disabled = true;
  if (horasDesdeIngresoInput) horasDesdeIngresoInput.disabled = true;

  let boxSeleccionado = false;

  function verificarHabilitacion() {
    const pesoValido = pesoInput && pesoInput.value.trim() !== "";
    const horasDesdeIngresoValido =
      horasDesdeIngresoInput && horasDesdeIngresoInput.value.trim() !== "";

    if (pesoValido && horasDesdeIngresoValido && boxSeleccionado) {
      boxLosses.classList.remove("disabled");
      boxEarings.classList.remove("disabled");
    } else {
      boxLosses.classList.add("disabled");
      boxEarings.classList.add("disabled");
    }
  }

  function saveCurrentBoxData(boxNumber) {
    const data = {};
    allInputs.forEach((input) => {
      data[input.id] = input.value;
    });
    boxData[boxNumber] = data;
  }

  function loadBoxData(boxNumber) {
    const data = boxData[boxNumber] || {};
    allInputs.forEach((input) => {
      input.value = data[input.id] || "";
    });
  }

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

    const calculoFiebre37 = peso * 0.1 * fiebre37Horas;
    const calculoFiebre38 = peso * 0.2 * fiebre38Horas;
    const calculoFiebre39 = peso * 0.3 * fiebre39Horas;
    const calculoRpm25 = peso * 0.2 * rpm25Horas;
    const calculoRpm35 = peso * 0.3 * rpm35Horas;
    const perdidasInsensibles = peso * 0.5 * horasDesdeIngreso;
    const calculoVomitosSudor =
      vomitosSudor +
      calculoFiebre37 +
      calculoFiebre38 +
      calculoFiebre39 +
      calculoRpm25 +
      calculoRpm35;
    const totalPerdidas =
      diuresis +
      sng +
      hdfvvc +
      drenajes +
      perdidasInsensibles +
      calculoVomitosSudor;
    const balancePerdidas = totalPerdidas;
    const aguaEndogena = horasDesdeIngreso > 20 ? 400 : 20 * horasDesdeIngreso;
    const totalIngresos =
      midazolam +
      fentanest +
      propofol +
      remifentanilo +
      dexdor +
      noradrenalina +
      insulina +
      sueroterapia1 +
      sueroterapia2 +
      sueroterapia3 +
      medicacion +
      sangrePlasma +
      aguaEndogena +
      oral +
      enteral +
      parenteral;
    const balanceIngresos = totalIngresos;
    const balanceTotal = totalIngresos - totalPerdidas;

    const updateTextContent = (id, value) => {
      const element = document.querySelector(id);
      if (element) element.textContent = value.toFixed(2);
    };

    updateTextContent("#total-ingresos-balance", totalIngresos);
    updateTextContent("#total-perdidas-balance", totalPerdidas);
    updateTextContent("#balance-total", balanceTotal);

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

    const balanceTotalField = document.querySelector("#balance-total-box");
    if (balanceTotalField) {
      const isDarkMode = document.body.classList.contains("active");

      if (isDarkMode) {
        balanceTotalField.style.backgroundColor =
          balanceTotal >= 0 ? "#0070C0" : "#a31c1c";
      } else {
        balanceTotalField.style.backgroundColor =
          balanceTotal >= 0 ? "#00A2E8" : "#ff0000";
      }

      balanceTotalField.style.fontWeight = "bold";
      balanceTotalField.value = balanceTotal.toFixed(2);
    }
  }

  function updateMainDeleteButtonText() {
    const currentBox = selectedBoxElement.getAttribute("data-current-box");
    const mainDeleteButton = document.querySelector("#borrar-datos-principal");
    if (mainDeleteButton && currentBox) {
      mainDeleteButton.textContent = `Borrar Datos del Box ${currentBox}`;
    } else if (mainDeleteButton) {
      mainDeleteButton.textContent = "Borrar Datos";
    }
  }

  boxLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const currentBox = selectedBoxElement.getAttribute("data-current-box");
      if (currentBox) saveCurrentBoxData(currentBox);

      const boxNumber = link.getAttribute("data-box");
      loadBoxData(boxNumber);
      selectedBoxElement.textContent = `Has seleccionado el Box ${boxNumber}`;
      selectedBoxElement.setAttribute("data-current-box", boxNumber);
      boxSeleccionado = true;

      // Habilitar campos de peso y horas
      if (pesoInput) pesoInput.disabled = false;
      if (horasDesdeIngresoInput) horasDesdeIngresoInput.disabled = false;

      verificarHabilitacion();
      calculateDerivedValues();
      updateMainDeleteButtonText(); // Actualiza texto del botón principal
    });
  });

  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      verificarHabilitacion();
      calculateDerivedValues();
    });
  });

  const restrictedInputs = [
    "#horas-desde-ingreso-box",
    "#fiebre37-horas-box",
    "#fiebre38-horas-box",
    "#fiebre39-horas-box",
    "#rpm25-horas-box",
    "#rpm35-horas-box",
  ];

  restrictedInputs.forEach((selector) => {
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

  const mainDeleteButton = document.querySelector("#borrar-datos-principal");
  if (mainDeleteButton) {
    mainDeleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const currentBox = selectedBoxElement.getAttribute("data-current-box");

      if (currentBox) {
        boxData[currentBox] = {};
      }

      allInputs.forEach((input) => (input.value = ""));
      calculateDerivedValues();

      // Restablecer estado inicial
      boxLosses.classList.add("disabled");
      boxEarings.classList.add("disabled");
      selectedBoxElement.textContent = "Selecciona un Box";
      selectedBoxElement.removeAttribute("data-current-box");
      boxSeleccionado = false;

      // Bloquear peso y horas nuevamente
      if (pesoInput) pesoInput.disabled = true;
      if (horasDesdeIngresoInput) horasDesdeIngresoInput.disabled = true;

      updateMainDeleteButtonText(); // Actualiza texto del botón principal

      alert("Todos los datos han sido borrados correctamente.");
    });
  }

  // Botón para borrar solo Ingresos
document.getElementById("borrar-ingresos")?.addEventListener("click", () => {
  const ingresoInputs = document.querySelectorAll(".ingreso:not([readonly])");
  console.log("Campos de ingreso editables:", document.querySelectorAll(".ingreso:not([readonly])"));
console.log("Campos de ingreso editables:", document.querySelectorAll(".ingreso:not([readonly])"));
  ingresoInputs.forEach((input) => (input.value = ""));
  calculateDerivedValues();
  alert("Datos de Ingresos borrados correctamente.");
});

// Botón para borrar solo Pérdidas
document.getElementById("borrar-perdidas")?.addEventListener("click", () => {
  const perdidaInputs = document.querySelectorAll(".perdida:not([readonly])");
  console.log("Campos de pérdida editables:", document.querySelectorAll(".perdida:not([readonly])"));
  perdidaInputs.forEach((input) => (input.value = ""));
  calculateDerivedValues();
  alert("Datos de Pérdidas borrados correctamente.");
});

  verificarHabilitacion();
});
