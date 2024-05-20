[![Datalayer](https://assets.datalayer.tech/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# 🪐 🦕 Jupyter UI Docusaurus Example

This example is built using [Docusaurus](https://docusaurus.io), a modern static website generator, and allows you to add a live cell in the Docusaurus site.

```bash
yarn install &&
  echo open http://localhost:3000/docs/intro && \
  yarn start
```

<div align="center" style="text-align: center">
  <img alt="Jupyter UI Docusaurus" src="https://datalayer-jupyter-examples.s3.amazonaws.com/jupyter-react-docusaurus.png" />
</div>

```bash
yarn build:docusaurus &&
  echo open http://localhost:3000 && \
  yarn serve
```

## Usage

Add the following code in any Markdown file.

```jsx
import JupyterCell from '@theme/JupyterCell';

<JupyterCell 
  source={`print('Hello world')
for i in range(10):
  print(i)
`}
  token='60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6'
  serverHttpUrl='http://localhost:8686/api/jupyter-kernels'
  serverWsUrl='ws://localhost:8686/api/jupyter-kernels'
/>
```
