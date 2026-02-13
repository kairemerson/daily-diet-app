# Expo 53 + NativeWind 4 Starter

Projeto Expo configurado com:
- ✅ Expo SDK 53
- ✅ NativeWind 4
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o projeto
```bash
npm start
```

Depois escolha:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web

## 📁 Estrutura

```
├── App.tsx                 # Componente principal
├── global.css              # Estilos Tailwind
├── tailwind.config.js      # Configuração Tailwind
├── metro.config.js         # Configuração Metro + NativeWind
├── babel.config.js         # Configuração Babel
├── tsconfig.json           # Configuração TypeScript
├── nativewind-env.d.ts     # Types do NativeWind
└── package.json            # Dependências
```

## 🎨 Como usar NativeWind

Use classes Tailwind diretamente com `className`:

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold text-blue-500">
    Hello NativeWind!
  </Text>
</View>
```

## 📦 Dependências principais

- `expo` ~53.0.0
- `react` 19.0.0
- `react-native` 0.79.6
- `nativewind` ^4.1.23
- `tailwindcss` ^3.4.17

## 🔧 Configuração

Tudo já está configurado! O projeto inclui:

- **Babel**: Configurado com preset Expo e plugin NativeWind
- **Metro**: Integrado com NativeWind para processar CSS
- **Tailwind**: Preset NativeWind aplicado
- **TypeScript**: Types do NativeWind incluídos

## 📝 Notas

- O arquivo `global.css` deve ser importado no `App.tsx`
- Classes Tailwind funcionam diretamente em componentes React Native
- Suporte completo a dark mode e responsividade
