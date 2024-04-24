'use client';

import { useRouter } from 'next/navigation';
import {useRef, useState} from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import {Toast} from "primereact/toast";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const toast = useRef<Toast>(null)

  const router = useRouter();
  const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': true });

  const onFinish = () => {
    setLoading(true)
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, checked }),
    }).then((res) => res.json()).then(res => {
        setLoading(false)
      if (res.success) {
        router.push('/');
      } else {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Credenciais inválidas', life: 3000 })
      }
    }).catch((e) => {
      setLoading(false)
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao autenticar', life: 3000 })
    })
  }

  return (
    <div className={containerClassName}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">

        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
            <div className="text-center mb-5">
              {/*<div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>*/}
              <span className="text-600 font-medium">Entre para continuar</span>
            </div>

            <div>
              <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                Usuário
              </label>
              <InputText id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nome de usuário" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

              <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                Senha
              </label>
              <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                  <label htmlFor="rememberme1">Lembrar de mim</label>
                </div>
                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                  Esqueceu a senha?
                </a>
              </div>
              <Button label="Entrar" className="w-full p-3 text-xl" loading={loading} onClick={onFinish}></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;