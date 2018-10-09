# Vue Discover
###### [PT-BR]
### Instalação
    npm i -S vue-discover
### Dependências
Vue discover exige que você 
|Pacotes|npm command|
|------|-|
|lodash.camelcase|`npm i lodash.upperfirst`
|lodash.upperfirst| `npm i lodash.upperfirst`

### Uso
```
import Vue from 'vue'
import discover from 'vue-discover'
Vue.use(discover)
```
**Vue Discover** é um plugin para [VueJS](https://vuejs.org/) que propõem agilizar o desenvolvimento de completas aplicações com Vue.

Vue Discover descobre/mapeia através de uma estrutura pré definida de diretórios `\Features` e `\Modules`, recursos fundamentais da aplicação: `routes`, `vuex` e `components` (de forma global). Descartando a necessidade de importar componentes próprios em sua aplicação.

Vue Discover provê um array com a estrutura de menu de até dois níveis, podendo ser extendida para 3 níveis ao usar o `agrupamento de nav`, este array pode ser invocado em qualquer `vue component`, apenas chamando: `this.$_nav`.
##### Vue Discover Estrutura de Diretórios
Vue discover fabrica e injeta na instância do Vue as rotas e os estados (`vuex`) mapeados no diretório `Feature`.


###
