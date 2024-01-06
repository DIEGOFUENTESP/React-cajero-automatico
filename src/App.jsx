import React, { useState } from 'react';
import { showSuccessAlert, showWarningAlert } from './alertFunctions';
import logo from './assets/Logo-Banco.jpg';
import './app.css';

function App() {
  const [usuarios, setUsuarios] = useState({});
  const [nombre, setNombre] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cantidadOperacion, setCantidadOperacion] = useState('');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [contrasenaInput, setContrasenaInput] = useState('');
  const [mostrarFormularioCrearUsuario, setMostrarFormularioCrearUsuario] = useState(false);
  const [mostrarTransferencia, setMostrarTransferencia] = useState(false);
const [usuarioDestino, setUsuarioDestino] = useState('');
const [montoTransferencia, setMontoTransferencia] = useState('');

const realizarTransferencia = () => {
  if (!usuarioDestino || !montoTransferencia) {
    showWarningAlert('Por favor, completa todos los campos.');
    return;
  }

  const cantidad = Number(montoTransferencia);

  if (cantidad <= 0) {
    showWarningAlert('Por favor, ingresa una cantidad válida mayor que cero.');
    return;
  }

  if (!usuarios.hasOwnProperty(usuarioDestino)) {
    showWarningAlert('El usuario destino no existe.');
    return;
  }

  if (usuarioDestino === usuarioActual) {
    showWarningAlert('No puedes transferir dinero a la misma cuenta.');
    return;
  }

  if (usuarios[usuarioActual].saldo < cantidad) {
    showWarningAlert('Fondos insuficientes para realizar la transferencia.');
    return;
  }

  usuarios[usuarioActual].saldo -= cantidad;
  usuarios[usuarioDestino].saldo += cantidad;

  usuarios[usuarioActual].movimientos.push({
    tipo: 'Transferencia enviada',
    valor: cantidad,
    hora: obtenerHoraActual(),
    destinatario: usuarioDestino,
  });

  usuarios[usuarioDestino].movimientos.push({
    tipo: 'Transferencia recibida',
    valor: cantidad,
    hora: obtenerHoraActual(),
    remitente: usuarioActual,
  });

  showSuccessAlert(`Se transfirieron ${cantidad.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP a ${usuarioDestino}.`);

  setUsuarioDestino('');
  setMontoTransferencia('');
  setMostrarTransferencia(false);
};


  const crearUsuario = () => {

    const nombreRegex = /^[A-Za-z]+$/;

  if (!nombreRegex.test(nombre)) {
    showWarningAlert('El nombre solo debe contener letras.');
    return;
  }

  // Expresión regular para validar el usuario (empieza con letra y contiene letras y números)
  const usuarioRegex = /^[A-Za-z][A-Za-z0-9]*$/;

  if (!usuarioRegex.test(nuevoUsuario)) {
    showWarningAlert('El usuario debe empezar con una letra y solo puede contener letras y números.');
    return;
  }

  // Expresión regular para validar la contraseña (mínimo 9 caracteres)
  const contrasenaRegex = /^.{9,}$/;

  if (!contrasenaRegex.test(nuevaContrasena)) {
    showWarningAlert('La contraseña debe tener al menos 9 caracteres.');
    return;
  }


    if (!nombre || !nuevoUsuario || !nuevaContrasena) {
      showWarningAlert('Por favor, completa todos los campos.');
      return;
    }

    if (usuarios.hasOwnProperty(nuevoUsuario)) {
      showWarningAlert('El usuario ya existe. Intenta con otro nombre de usuario.');
      return;
    }

    const nuevoUsuarioData = {
      nombre: nombre,
      usuario: nuevoUsuario,
      contrasena: nuevaContrasena,
      saldo: 0,
      movimientos: [],
    };

    setUsuarios({ ...usuarios, [nuevoUsuario]: nuevoUsuarioData });
    setUsuarioActual(nuevoUsuario); // Cambiar al usuario recién creado
    showSuccessAlert('Usuario creado exitosamente.');

    setNombre('');
    setNuevoUsuario('');
    setNuevaContrasena('');
  };

  const consignarRetirar = (tipoOperacion) => {
    if (!cantidadOperacion || isNaN(Number(cantidadOperacion)) || Number(cantidadOperacion) <= 0) {
      showWarningAlert('Por favor, ingresa una cantidad válida.');
      return;
    }
  
    const cantidad = Number(cantidadOperacion);
  
    if (tipoOperacion === 'consignar') {
      usuarios[usuarioActual].saldo += cantidad;
      usuarios[usuarioActual].movimientos.push({
        tipo: 'Consignación',
        valor: cantidad,
        hora: obtenerHoraActual(),
      });
      showSuccessAlert(`Consignación exitosa. ${cantidad.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP.`);
    } else if (tipoOperacion === 'retirar') {
      if (usuarios[usuarioActual].saldo < cantidad) {
        showWarningAlert('Fondos insuficientes para realizar el retiro.');
        return;
      }
      usuarios[usuarioActual].saldo -= cantidad;
      usuarios[usuarioActual].movimientos.push({
        tipo: 'Retiro',
        valor: cantidad,
        hora: obtenerHoraActual(),
      });
      showSuccessAlert(`Retiro exitoso. ${cantidad.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP.`);
    }
  
    setCantidadOperacion('');
  };
  

  const obtenerHoraActual = () => {
    const fechaActual = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-CO', options);
    const hora = fechaActual.toLocaleTimeString();
    return `${fechaFormateada}, ${hora}`;
  };
  const cerrarSesion = () => {
    setUsuarioActual(null); // Restablecer el usuario actual al cerrar sesión
    setMostrarFormularioCrearUsuario(false); // Mostrar el formulario de inicio de sesión
  };
  const iniciarSesion = () => {
    if (!usuarioInput || !contrasenaInput) {
      showWarningAlert('Por favor, ingresa un usuario y contraseña válidos.');
      return;
    }

    if (!usuarios.hasOwnProperty(usuarioInput) || usuarios[usuarioInput].contrasena !== contrasenaInput) {
      showWarningAlert('Usuario o contraseña incorrectos. Por favor, intenta de nuevo.');
      return;
    }

    setUsuarioActual(usuarioInput);
    setUsuarioInput('');
    setContrasenaInput('');
  };
  


  return (
    <div className="App">
      {!usuarioActual && !mostrarFormularioCrearUsuario && (
        <div>
          <img src={logo} alt="Logo de la aplicación" className='logo'/>
          <h1 className='titulo'>Iniciar Sesión</h1>
          <label>
            Usuario:
            <input type="text" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} />
          </label>
          <br />
          <label>
            Contraseña:
            <input
              type="password"
              value={contrasenaInput}
              onChange={(e) => setContrasenaInput(e.target.value)}
            />
          </label>
          <br />
          <button className='iniciar-seccion' onClick={iniciarSesion}>Iniciar Sesión</button><br /><br />
          <button className='nuevo-usuario' onClick={() => setMostrarFormularioCrearUsuario(true)}>Crear Nuevo Usuario</button>
        </div>
      )}

      {mostrarFormularioCrearUsuario && !usuarioActual && (
        <div>
          <img src={logo} alt="Logo de la aplicación" className='logo'/>
          <h1  className='titulo'>Crear Nuevo Usuario</h1>
          <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <br />
          <label>
            Usuario:
            <input
              type="text"
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
            />
          </label>
          <br />
          <label>
            Contraseña:
            <input
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
            />
          </label>
          <br />
          <button className='iniciar-seccion' type="button" onClick={crearUsuario}>
            Crear Usuario
          </button><br /><br />
          <button className='nuevo-usuario' onClick={() => setMostrarFormularioCrearUsuario(false)}>Volver al Inicio de Sesión</button>
        </div>
      )}

{usuarioActual && (
  <div>
    <img src={logo} alt="Logo de la aplicación" className='logo'/>
    <h1 className='titulo'>Bienvenido, {usuarios[usuarioActual].nombre}!</h1>
    <p>
  Usuario: <span style={{ fontWeight: 'bold' }}>{usuarios[usuarioActual].usuario}</span>
</p>
<p>
  Saldo: <span style={{ fontWeight: 'bold' }}>{usuarios[usuarioActual].saldo.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP</span>
</p>
    <div>
      <label>
        Cantidad:
        <input
          type="number"
          value={cantidadOperacion}
          onChange={(e) => setCantidadOperacion(e.target.value)}
          placeholder='Monto'
        />
      </label>
      <button onClick={() => consignarRetirar('consignar')}>Consignar</button>
      <button className='red' onClick={() => consignarRetirar('retirar')}>Retirar</button>
      <button className='green' onClick={() => setMostrarTransferencia(true)}>Realizar Transferencia</button>{mostrarTransferencia && (
      <div>
        <h2>Realizar Transferencia</h2>
        <label>
          Usuario Destino:
          <input
            type="text"
            value={usuarioDestino}
            onChange={(e) => setUsuarioDestino(e.target.value)}
            placeholder='Usuario'
          />
        </label>
        <br />
        <label>
          Monto:
          <input
            type="number"
            value={montoTransferencia}
            onChange={(e) => setMontoTransferencia(e.target.value)}
            placeholder='Monto'
          />
        </label>
        <br />
        <button onClick={realizarTransferencia}>Transferir</button>
        <button className='red' onClick={() => setMostrarTransferencia(false)}>Cancelar</button>
      </div>
    )}
    <h2>Historial de Transacciones:</h2>
      <ul>
      {usuarios[usuarioActual].movimientos.map((movimiento, index) => (
        <li key={index}>
          {movimiento.tipo === 'Consignación' && (
            <>
              <p className='bold azul'>Consignación</p>
              <p className='azul'>Valor: {movimiento.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP</p>
              <p className='azul'>Fecha: {obtenerHoraActual()}</p>
            </>
          )}
          {movimiento.tipo === 'Retiro' && (
            <>
              <p className='bold rojo'>Retiro</p>
              <p className='rojo'>Valor: {movimiento.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP</p>
              <p className='rojo'>Fecha: {obtenerHoraActual()}</p>
            </>
          )}
          {movimiento.tipo === 'Transferencia enviada' && (
            <>
              <p className='bold verde'>Transferencia enviada</p>
              <p className='verde'>Valor: {movimiento.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP</p>
              <p className='verde'>Fecha: {obtenerHoraActual()}</p>
              <p className='verde'>Destinatario: {movimiento.destinatario}</p>
            </>
          )}
          {movimiento.tipo === 'Transferencia recibida' && (
            <>
              <p className='bold verde'>Transferencia recibida</p>
              <p className='verde'>Valor: {movimiento.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} COP</p>
              <p className='verde'>Fecha: {obtenerHoraActual()}</p>
              <p className='verde'>Remitente: {movimiento.remitente}</p>
            </>
          )}
        </li>
      ))}
    </ul>
      <button className='red' onClick={cerrarSesion}>Cerrar Sesión</button>
    </div>
  </div>
)}
    
  </div>
);
}

export default App;