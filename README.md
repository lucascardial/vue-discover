# Vue Discover
###### [PT-BR] Versão Beta
**Vue Discover** é um plugin para [VueJS](https://vuejs.org/) que propõem agilizar o desenvolvimento de completas aplicações com Vue.

Vue Discover descobre/mapeia através de uma estrutura pré definida de diretórios `\Features` e `\Modules`, recursos fundamentais da aplicação: `routes`, `vuex` e `components` (de forma global). Descartando a necessidade de importar componentes próprios em sua aplicação.

Vue Discover provê um array com a estrutura de menu de até dois níveis, podendo ser extendida para 3 níveis ao usar o `navigation group`, este array pode ser invocado em qualquer `vue component`, apenas chamando: `this.$_nav`.
#####  Estrutura de Diretórios
Vue discover exige a seguinte estrutura de Diretórios:
```shell
.src/
├── Features
│   └── Feature1
│   │   ├── index.js
│   │   └── store
│   │       ├── actions.feature.js
│   │       ├── mutations.feature.js
│   │       ├── getters.feature.js
│   │       └── state.feature.js
│   └──  ...
│
├── Modules
│   ├── module1.vue
│   ├── module2.vue
│   ├── module3.vue
│   └── ...
├── router
│   └── index.js
└── store
    └── index.js
```
>'Feature1' é apenas um nome fictício, você é livre para nomear suas features.

#### Components
Vue discover mapeia todos os arquivos vue exitentes no diretório `\components`, e os registra globalmente. Permitindo chamá-los baseado em seu atributo `name`
###### src\components\mybutton.vue
```vue
<template>
    <button>MY BUTTON</button>
</template>
<script>
    export default{
        name: 'my-buton'
    }
</script>
```
Assim você poderá chamar `<my-button>` em qualquer outro componente vue.
#### Modules
Os módulos são os arquivos base da aplicação. Eles são simplesmente arquivos vue, ou seja `components` que serão renderizados em determinada rota.
Um `componente módulo` deve obrigatóriamente possuir o atributo `signature` de valor único, pois **signature** servirá como identificador do módulo.
#### Features
Uma feature reunirá os módulos de acordo com o contexto desejado. Toda feature pode possuir uma store (`vuex`) representada pelo diretório `\store` com as opções de `actions`, `mutations`, `getters` e/ou `state`, representados como arquivos únicos, acompanhados do pós-fixo 'feature.js'.
### Instalação
```
npm i -S vue-discover
```
### Uso
```vue
import Vue from 'vue'
import discover from 'vue-discover'
Vue.use(discover)
```

##### Opções
Vue discover pode receber alguns parâmetros, como  `navigation.group`  já dito anteriormente, e`routes.joinTo`.

|objeto|type|valor|descrição|
|-----|----|----|---|
|`routes.joinTo`|string|Recebe como valor o nome de uma rota já existente no arquivo `routes\index.js`.|Injeta todas as rotas construídas pelo Vue Discover no atributo `children` da rota nomeada.|
|`navigation.group`|array| Recebe um array de grupos.|Adiciona grupos que podem relacionar diferentes features. Os únicos parâmetros obrigatórios são: `name` e `label`, embora você possa adicionar quaisquer outros atributos, pois todos estarão visíveis no [prototype](https://br.vuejs.org/v2/cookbook/adding-instance-properties.html) `$_nav`|

Exemplo de uso com os parâmetros descritos a cima (consideremos a existência de uma rota de `name: 'my.app'`

```vue
Vue.use( discover, {
    routes: { joinTo: 'my.app' },
    navigation: {
      groups: [
        { label: 'Group 01', name: 'group1', icon: 'icon' }
      ]
    }
  })
```

### Tutorial
Exemplificaremos com um simples TODO LIST.
###### src\main.js
```vue
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import discover from '.vue-discover'

Vue.use(
  discover, {
    routes: { joinTo: 'my.app' },
    navigation: {
      groups: [
        { label: 'Group 01', name: 'group1', icon: 'icon' }
      ]
    }
  })

Vue.config.productionTip = false
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

```
###### src\store\index.js
```vue
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({})

```
###### src\router\index.js
```vue
import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layouts/base'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/app',
      name: 'my.app',
      component: layout
    }
  ]
})
```
###### src\views\layouts\base.vue
```vue
<template>
  <div>
    <my-nav></my-nav>
    <h3>Layout base</h3>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'baselayout',
  created () {
    console.log(this.$_nav)
  }
}
</script>
```
###### src\components\my-nav.vue
```vue
<template>
    <nav>
      <ul v-for="(nav, i) of $_nav" :key="i">
        <li> {{nav.label}}</li>
        <ul v-for="(feature, j) of nav.children" :key="j">
          <li>
            <router-link :to="{name:feature.to}">{{feature.label}}</router-link>
          </li>
          <ul v-for="(module, k) of feature.children" :key="k">
            <li>
              <router-link :to="{name:module.to}">
                {{module.label}}
              </router-link>
            </li>
          </ul>
        </ul>
      </ul>
    </nav>
</template>

<script>
export default {
  name: 'my-nav'
}
</script>
```
> Note que o v-for recebe o atributo `$_nav` para interação. Como já dito, `$_nav` é provido globalmente.
##### Criando os módulos
###### src\Modules\TodoListShow.vue
```vue
<template>
    <div>
      <h1>Todo List</h1>
      <router-link :to="{name: 'app.modules.todolist.form'}">Novo </router-link>
      <ul>
        <li v-for="(todo, index) of todoList" :key="index">
            <span>{{ todo }}</span> <button @click="deleteTodo(index)">Remover</button>
        </li>
      </ul>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'todo-list-show',
  signature: 'app.modules.todolist.show',
  computed: {
    ...mapGetters('Feature1', ['todoList'])
  },
  methods: {
    ...mapActions('Feature1', ['deleteTodo']),
    DeleteTodoFromState (index) {
      this.deleteTodo(index)
    }
  }
}
</script>

```

###### src\Features\Modules\TodoListForm.vue
```vue
<template>
    <div>
      <h1>Todo List Form</h1>
      <form>
        <input type="text" v-model="name">
        <input type="button" @click.prevent="addTodoToState" value="Add ">
      </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'todo-list-form',
  signature: 'app.modules.todolist.form',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    ...mapActions('Feature1', ['addTodo']),
    addTodoToState () {
      this.addTodo(this.name)
      this.$router.push({name: 'app.modules.todolist.show'})
    }
  }
}
</script>
```

> Nota [Estado Centralizado]:
Perceba que em ambos componentes importam funcionalidades do vuex (`mapActions, mapGetters`), e chamam funções pelo namespace `Feature1` em `...mapActions('Feature1', ['addTodo']),` e `...mapGetters('Feature1', ['todoList'])`. O Vue Discover fabrica e injeta os `states` de cada feature diretamente na instância do `Vuex`, nomeando-os pelo namespace de sua Feature. Basicamente, para cada Feature existente, o Vue Discover fabrica os módulos do Vuex assinando a propriedade `namespaced` como `true`. Você não precisa saber como o Vue Discover manipula este dados, mas caso queira saber a respeito, leia a [Documentação](https://vuex.vuejs.org/guide/modules.html) do Vuex para estados modulares.

> Nota [Rotas]: O botão `<router-link :to="{name: 'app.modules.todolist.form'}">Novo</router-link>` passa no parâmetro `to` o `name` da rota que desejamos navegar. O `name` de cada rota, como dito anteriormente, refere-se à propriedade `signature` de cada `módulo`. O próximo tópico exemplificará melhor as gerações de `routes e states`. 
##### Criando uma Feature
Feature1
> "Feature1" é apenas um nome para exemplo, você é livre para nomear suas features.

Configuração da store da Feature
###### src\Features\Feature1\store\actions.feature.js
```es6
const addTodo = ({commit}, data) => {
  commit('ADD_TODO', data)
}

const deleteTodo = ({commit}, index) => {
  commit('DELETE_TODO', index)
}

export default {
  addTodo,
  deleteTodo
}

```
###### src\Features\Feature1\store\mutations.feature.js
```es6
const ADD_TODO = (state, data) => {
  state.todoList.push(data)
}

const DELETE_TODO = (state, index) => {
  state.todoList.splice(index, 1)
}

export default {
  ADD_TODO,
  DELETE_TODO
}
```
###### src\Features\Feature1\store\getters.feature.js
```es6
const todoList = (state) => {
  return state.todoList
}

export default {
  todoList
}
```
###### src\Features\Feature1\store\state.feature.js
```es6
export default {
    todoList: []
}
```
Configuração do `index.js`
###### src\Features\Feature1\index.js
```es6
const modules = [
  {
    name: 'app.modules.todolist.show',
    router: {
      path: 'todolist',
      component: '$name'
    },
    nav: {
      label: 'Todo List'
    }
  },
  {
    name: 'app.modules.todolist.form',
    router: {
      path: 'createtodolist',
      component: '$name'
    },
    nav: {
      label: 'Create Todo List'
    }
  }
]
export default {
  name: 'app.features.feature1',
  modules: modules,
  router: {
    path: '/feature1'
  },
  nav: {
    label: 'Feature1',
    group: 'group1'
  }
}

```
##### Propriedades do index.js
|Nome|Descrição|
|----|---------|
|name|Valor único, pode ser usado na navegação de rotas no parâmetro `:to={name:'nome.sua.feature'}`|
|modules| Recebe um objeto de modules descrito abaixo|
###### Objeto modules
O objeto modules contém um array de module:

|Nome|Descrição|
|----|---------|
|name|Pode Rreferer-se à propriedade `signature` criada no `vue component` no diretório `\Modules`, porém você é livre para escoher o melhor `name` que preferir. Caso escolha o nome do module, fique atento ao erro de _rotas com nome duplicados_. Pode ser usado na navegação de rotas no parâmetro `:to={name:'nome.seu.modulo'}`|
|router.path| rota do módulo, lembrando que as rotas de módulos serão filhas da feature, logo para o `component.router.path = '/my-component'`, será acessível pela rota: `my-feature-name/my-component`
|router.component|Recebe um vue component qualquer. Você é livre para importar o seu componente e associá-lo aqui, embora o sugerimos que siga o padrão de criação de módulos descrito anteriormente. Dessa forma, o valor deste atributo poderá ser a `signature` do módulo criado. **BÔNUS**: Caso o atributo `name` do objeto module seja o valor da `signature` do module, e você queira o mesmo valor para este atributo, poderá atribuí-lo o valor `'$name'`.
###### Objeto router
Objeto para criação das rotas na fábrica de rotas do Vue Discover, ele pode receber absolutamente todos os parâmetros do padrão de rotas do [Vue Router](https://router.vuejs.org/)

|Nome|Descrição|
|----|---------|
|router.path|rota da feature|
|router.component|Recebe um component vue, caso este atributo seja omitido, a Fábrica do Vue Discover injetará um componente anêmico, apenas para prover um slot do `<router-view>` para renderização de rotas filhas da Feature.|

Vue discover fabrica e injeta na instância do Vue as rotas e os estados (`vuex`) mapeados do diretório `Feature`.
#### Acessando os módulos
![Alt Text](https://github.com/lucca-cardial/common-logos/raw/master/gif-1.gif)
#### Registrando TODOs
![Alt Text](https://github.com/lucca-cardial/common-logos/raw/master/gif-1.gif)
