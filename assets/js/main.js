document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");

  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "Thank you! Your message has been sent successfully.";
      form.reset();
    });
  }

  const paymentForm = document.getElementById("admission-payment-form");
  const mpesaModal = document.getElementById("mpesaModal");
  const closeMpesaModal = document.getElementById("closeMpesaModal");
  const mpesaStepText = document.getElementById("mpesaStepText");
  const mpesaSpinner = document.getElementById("mpesaSpinner");
  const pinWrap = document.getElementById("pinWrap");
  const mpesaPhoneText = document.getElementById("mpesaPhoneText");
  const mpesaAmountText = document.getElementById("mpesaAmountText");
  const transactionLog = document.getElementById("transactionLog");
  const paidStudentsList = document.getElementById("paidStudentsList");
  const clearLogBtn = document.getElementById("clearLogBtn");

  const initialPaidStudents = [
    { name: "Aisha M", amount: 5000 },
    { name: "Daniel K", amount: 5000 }
  ];

  let paidStudents = [...initialPaidStudents];
  let activeSequence = null;

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addLogEntry(message, type = "info") {
    if (!transactionLog) return;

    const item = document.createElement("li");
    item.className = `log-item ${type}`;
    item.innerHTML = `<span class="log-time">${formatTime()}</span><span>${message}</span>`;
    transactionLog.prepend(item);
  }

  function renderPaidStudents() {
    if (!paidStudentsList) return;

    paidStudentsList.innerHTML = "";

    paidStudents.forEach((student) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>${student.name}</span><span>Tsh ${Number(student.amount).toLocaleString()}</span>`;
      paidStudentsList.appendChild(item);
    });
  }

  function openModal() {
    if (!mpesaModal) return;
    mpesaModal.classList.add("open");
    mpesaModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!mpesaModal) return;
    mpesaModal.classList.remove("open");
    mpesaModal.setAttribute("aria-hidden", "true");
  }

  function updateStep(text, options = {}) {
    const { showSpinner = true, showPin = false } = options;

    if (mpesaStepText) {
      mpesaStepText.textContent = text;
    }

    if (mpesaSpinner) {
      mpesaSpinner.style.display = showSpinner ? "inline-block" : "none";
    }

    if (pinWrap) {
      pinWrap.classList.toggle("visible", showPin);
    }
  }

  function simulatePayment(studentName, phoneNumber, amount) {
    if (!mpesaModal) return;

    const normalizedPhone = phoneNumber.trim();
    const txId = `TXN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    openModal();
    updateStep("Generating Session Key...", { showSpinner: true, showPin: false });
    addLogEntry(`Generating session key for ${studentName}.`, "info");

    if (activeSequence) {
      clearTimeout(activeSequence);
    }

    activeSequence = setTimeout(() => {
      updateStep(`Sending STK Push to ${normalizedPhone}...`, { showSpinner: true, showPin: false });
      addLogEntry(`Sending STK Push to ${normalizedPhone}.`, "info");
      mpesaPhoneText.textContent = normalizedPhone;
      mpesaAmountText.textContent = `Tsh ${Number(amount).toLocaleString()}`;
    }, 900);

    setTimeout(() => {
      updateStep("Please enter your M-Pesa PIN", { showSpinner: false, showPin: true });
      addLogEntry("PIN prompt displayed. Waiting for confirmation.", "alert");
    }, 2200);

    setTimeout(() => {
      updateStep(`Payment approved! Transaction ID: ${txId}`, { showSpinner: false, showPin: false });
      addLogEntry(`Payment approved! Transaction ID: ${txId}`, "success");
    }, 4200);

    setTimeout(() => {
      updateStep("Checking payment status...", { showSpinner: true, showPin: false });
      addLogEntry("Checking payment status...", "info");
    }, 5600);

    setTimeout(() => {
      updateStep("STATUS: COMPLETED", { showSpinner: false, showPin: false });
      addLogEntry("STATUS: COMPLETED", "success");
      paidStudents = [{ name: studentName, amount }, ...paidStudents];
      renderPaidStudents();
    }, 7000);
  }

  if (paymentForm) {
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const studentName = document.getElementById("studentName").value.trim();
      const phoneNumber = document.getElementById("phoneNumber").value.trim();
      const amount = Number(document.getElementById("amount").value || 5000);

      if (!studentName || !phoneNumber) {
        addLogEntry("Payment form is incomplete. Please provide student details.", "alert");
        return;
      }

      simulatePayment(studentName, phoneNumber, amount);
    });
  }

  if (closeMpesaModal) {
    closeMpesaModal.addEventListener("click", closeModal);
  }

  if (mpesaModal) {
    mpesaModal.addEventListener("click", (event) => {
      if (event.target === mpesaModal) {
        closeModal();
      }
    });
  }

  if (clearLogBtn) {
    clearLogBtn.addEventListener("click", () => {
      if (transactionLog) {
        transactionLog.innerHTML = "";
      }
    });
  }

  renderPaidStudents();
  addLogEntry("System ready. Waiting for admission payment.", "info");
  addLogEntry("Admission fee is fixed at Tsh 5,000.", "info");
});
