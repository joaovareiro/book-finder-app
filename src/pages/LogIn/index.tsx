import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase'; // Importe o objeto de configuração do Firebase

const app = initializeApp(firebaseConfig); // Initialize Firebase

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const db = getFirestore(app); // Obtenha uma referência para o objeto do Firestore

    try {
      await addDoc(collection(db, '123'), {
        email: email,
        senha: password,
        // Outros campos do livro
      });

      console.log('Dados salvos com sucesso!');
      alert('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
    }

    console.log('Email:', email);
    console.log('Senha:', password);
    // Exemplo de lógica de login bem-sucedido
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
