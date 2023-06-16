import './style.css';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase';
import { Link } from 'react-router-dom';
import { app, db } from '../../firebase';
import bcrypt from 'bcryptjs';


const createUser = async (email: string, senha: string, senha_confirmacao: string, curtidos: null) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const senhaEncriptada = bcrypt.hashSync(senha, salt)

  if (senha == senha_confirmacao) {
    await addDoc(collection(db, "users"), {
      login: email,
      senha: senhaEncriptada,
    })
      .then(() => {
        console.log("Dados registrados no banco");
        alert("Usuário cadastrado com sucesso!");
      })
      .catch((error) => {
        console.log("Gerou um erro ao adicionar" + error);
      });

  } else {
    alert("Senhas não conferem");
  }
};

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [senha_confirmacao, setPasswordCheck] = useState('');

  const handleLogin = async () => {
    createUser(email, senha, senha_confirmacao, null);
  };

  return (
    <div>
      <h1>Página de Cadastro</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirme sua senha"
        value={senha_confirmacao}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />

      <button onClick={handleLogin}>Cadastrar</button>
      <Link to='/' className='ButtonLogin'>Retornar para Login</Link>
    </div>
  );
};

export default SignInPage;