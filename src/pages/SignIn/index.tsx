
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase';
import { Link } from 'react-router-dom';
import { app, db } from '../../firebase';


const createUser = async (email: string, senha: string, curtidos: null) => {

    await addDoc(collection(db, "users"), {
      login: email,
      senha: senha,
    })
      .then(() => {
        console.log("Dados registrados no banco");
      })
      .catch((error) => {
        console.log("Gerou um erro ao adicionar" + error);
      });
};

const SignInPage = () => {
const [email, setEmail] = useState('');
const [senha, setPassword] = useState('');

const handleLogin = async () => {

  createUser(email, senha, null);

console.log('Email:', email);
console.log('Senha:', senha);
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
<button onClick={handleLogin}>Cadastro</button>
<Link to={'/'} className='ButtonLogIn'>Retornar Log In</Link>
</div>
);
};

export default SignInPage;