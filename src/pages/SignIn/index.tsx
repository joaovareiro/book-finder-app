import './style.css';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import bcrypt from 'bcryptjs';


const createUser = async (email: string, senha: string, senha_confirmacao: string, curtidos: null) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const senhaEncriptada = bcrypt.hashSync(senha, salt)

  if (senha === senha_confirmacao) {
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

    <div className="CriarLogin">
    <div className="CriarLoginBox">
      <div className="CriarLoginHeader">Crie seu login ! 😀</div>
      <div className="inputs">
        <input className="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="password"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setPassword(e.target.value)}
        />
         <input
           type="password"
           placeholder="Confirme sua senha"
           value={senha_confirmacao}
           onChange={(e) => setPasswordCheck(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={handleLogin} className="submitbutton">Cadastrar</button>
      </div>
      <Link style={{ display: "flex", justifyContent: "center" }} to='/' className='ButtonLogin'>Retornar para Login</Link>
    </div>
  </div>
  );
};

export default SignInPage;