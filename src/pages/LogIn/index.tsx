import React, { useState } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase';
import { Link } from 'react-router-dom';
import { app, db } from '../../firebase';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';


const checkUser = async (email:string, password:string) => {
  const usersCollection = collection(db, 'users');
  const querySnapshot = await getDocs(query(usersCollection, where('login', '==', email), where('senha', '==', password)));

  if (!querySnapshot.empty) {
    console.log('Login realizado com sucesso!');
    return 0;
  } else {
    console.log('Login não realizado!');
    return 1;
  }
};


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await checkUser(email, senha);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <Link to="/cadastro" className="ButtonSingIn">Ir para SignIn</Link>
    </div>
  );
};

export default LoginPage;
