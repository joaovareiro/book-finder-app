import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import bcrypt from 'bcryptjs';
import './style.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');

  const checkUser = async (email: string, senha: string) => {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersCollection, where('login', '==', email)));

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();

      const isPasswordMatched = await bcrypt.compare(senha, user.senha);
      if (isPasswordMatched) {
        console.log('Login realizado com sucesso!');
        const queryParams = `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(senha)}`;
        navigate(`/home${queryParams}`);
        return 0;
      } else {
        console.log('Senha incorreta!');
        alert('Senha incorreta!');
        return 1;
      }
    } else {
      console.log('Login não realizado!');
      return 1;
    }
  };

  const handleLogin = async () => {
    try {
      await checkUser(email, senha);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
    }
  };

  return (

    <div className="Login">
      <div className="LoginBox">
        <div className="LoginHeader">Login</div>
        <div className="inputs">
          <input className="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="password"
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleLogin} className="submitbutton">Login</button>
        </div>
        <Link style={{ display: "flex", justifyContent: "center" }} to="/cadastro" className="ButtonCadastro">
          Cadastra-se
        </Link>
      </div>
    </div>

  );
};

export default LoginPage;
