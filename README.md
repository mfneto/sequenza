<p align="center">
  <h2 align="center">Sequenza - Customer API Front's</h2>    
</p>

# Requisitos
- **NodeJS** instalado
- **gulp** instalado (`npm install gulp -g`)
- **bower** instalado (`npm install bower -g`)

# Instalação de dependências

Para a instalação de todas as dependências do projeto, execute os comando abaixo na pasta raiz: 

```js
npm install
bower install
```

# Tasks Gulp

## Build do projeto

Para rodar o projeto localmente com um servidor de teste utilize a task `run`:
```js
gulp run
```

Obs: Este Irá Abrir montar um http-server da pasta dist na porta :8888


Para apenas o build do projeto utilize a task `build`:
```js
gulp build
```

## Informações Específicas do Build (Gulp)

O processo de build irá gerar os arquivos na pasta `dist`, seguindo os passos abaixo:
1. Limpeza de todos os arquivos da pasta `dist`
2. Cópia das bibliotecas externas para a pasta `dist/lib` (com todas suas dependências)
3. Geração dos arquivos necessários compilados (versões originais, minificadas e seus respectivos sourcemaps) nas pastas /js e /css. (com todas suas dependencias).

O processo que "starta" o http-server (run) realiza o item anterior e já mapeia o servidor na porta :8888