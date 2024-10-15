// src/app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Asegúrate de importar desde 'next/navigation'

const LoginPage = () => {
  // Estado para el nombre de usuario, contraseña y posibles errores
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Realizar la autenticación contra GeoServer
    const isAuthenticated = await authenticateUser(username, password);

    if (isAuthenticated) {
      // Almacenar las credenciales en localStorage
      localStorage.setItem('geoServerUser', username);
      localStorage.setItem('geoServerPass', password);
      // Redirigir a la página /home
      router.push('/home'); // Cambia esto a la página que desees
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  // Función para autenticar al usuario con GeoServer
  const authenticateUser = async (username, password) => {
    const response = await fetch('http://192.168.1.116:8080/geoserver/rest/workspaces', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${password}`), // Autenticación básica
        'Accept': 'application/json'
      }
    });

    return response.ok; // Devuelve true si la respuesta es 200-299
  };

  return (
    <main className="md:flex h-screen">
      <div className="w-2/3 md:bg-world bg-cover bg-no-repeat"></div>
      <div className="w-full md:w-1/3 mb-0 mr-0 flex flex-col justify-center items-center float-right bg-[#181a1e] text-[#edeffd] p-1 overflow-hidden shadow-[1rem_3rem_4rem_#000000] h-screen relative">
        <div className="flex flex-col justify-center items-center mt-[5%] gap-5">
          <img
            alt="favicon2"
            src="imgs/favicon2.svg"
            className="w-[100px] h-auto"
          />
          <div>
            <h1 className="text-2xl font-bold font-sans text-center">
              Iniciar Sesión
            </h1>
            <p className="text-xl text-center font-semibold mt-2">
              Ingresa tus datos para iniciar sesión
            </p>
          </div>

          {/* Campos de entrada para el nombre de usuario y contraseña */}
          <input
            type="text"
            name="LoginUser"
            id="LoginUser"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#c2c2c2] border-none rounded-lg p-4 w-full text-black text-dark border-[#AAAAAA]"
          />

          <input
            type="password"
            name="LoginPass"
            id="LoginPass"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#c2c2c2] border-none rounded-lg p-4 w-full text-black text-dark border-[#AAAAAA]"
          />

          {/* Botón de inicio de sesión */}
          <button
            onClick={handleLogin}
            className="w-[220px] my-[35px] py-2 px-8 cursor-pointer bg-[#00004c] border-0 outline-none rounded-[30px] shadow-[0_0_20px_9px_#000000] text-white font-sans text-lg text-center hover:bg-slate-700"
          >
            Iniciar Sesión
          </button>

          {/* Mostrar error si las credenciales son incorrectas */}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Logos de los colaboradores */}
        <div className="flex justify-center gap-5 mt-8 mb-5">
          <a href="https://www.saf.cl/" className="profile">
            <img
              alt="Logo SAF"
              src="https://gorev.moncosta.org/assets/images/logos/SAF_big.png"
              className="h-[100px]"
            />
          </a>
          <a href="https://anid.cl" className="profile">
            <img
              alt="Logo Anid"
              src="https://anid.cl/wp-content/uploads/2022/04/anid_rojo_azul.png"
              className="h-[100px]"
            />
          </a>
          <a href="https://www.ufro.cl/" className="profile">
            <img
              alt="Logo UFRO"
              src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Logo_Nuevo_Ufro.png"
              className="h-[100px]"
            />
          </a>
        </div>
        <p className="text-center text-white text-lg w-3/4 absolute bottom-0 mb-3">
          RP23I30007 - Sistema Geoespacial de Apoyo a la Toma de Decisión en Situación de Emergencia
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
