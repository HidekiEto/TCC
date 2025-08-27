import React, { useState } from "react";
import { View } from "react-native";
import Input from "../Input";

export default function Inputs() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmeSenha, setConfirmeSenha] = useState('');

  return (
    <View className="p-5 gap-5 top-[10%]">
      <Input
        label="Nome Completo"
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <Input
        label="Data de Nascimento"
        placeholder="DD/MM/AAAA"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
      />
      <Input
        label="Confirme sua Senha"
        placeholder="Digite novamente a senha"
        value={confirmeSenha}
        onChangeText={setConfirmeSenha}
        secureTextEntry={true}
      />
    </View>
  );
}
