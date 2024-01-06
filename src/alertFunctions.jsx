import Swal from 'sweetalert2';

export function showSuccessAlert(message) {
  Swal.fire({
    title: 'Cajero Automático',
    text: message,
    icon: 'success',
    confirmButtonText: 'Aceptar',
  });
}

export function showWarningAlert(message) {
  Swal.fire({
    title: 'Cajero Automático',
    text: message,
    icon: 'warning',
    confirmButtonText: 'Aceptar',
  });
}