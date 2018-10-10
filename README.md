# Vue Discover
###### [PT-BR]
**Vue Discover** é um plugin para [VueJS](https://vuejs.org/) que propõem agilizar o desenvolvimento de completas aplicações com Vue.

Vue Discover descobre/mapeia através de uma estrutura pré definida de diretórios `\Features` e `\Modules`, recursos fundamentais da aplicação: `routes`, `vuex` e `components` (de forma global). Descartando a necessidade de importar componentes próprios em sua aplicação.

Vue Discover provê um array com a estrutura de menu de até dois níveis, podendo ser extendida para 3 níveis ao usar o `agrupamento de nav`, este array pode ser invocado em qualquer `vue component`, apenas chamando: `this.$_nav`.
##### Vue Discover Estrutura de Diretórios
Vue discover exige a seguinte estrutura de Diretórios:
```
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
#### Modules
Os módulos são os arquivos base da aplicação. Eles são simplesmente arquivos vue, ou seja `components` que serão renderizados em determinada rota.
Um `componente módulo` deve obrigatóriamente possuir o atributo `signature` de valor único, pois **signature** servirá como identificador do módulo.
#### Features
Uma feature reunirá os módulos de acordo com o contexto desejado. Toda feature pode possuir uma store (`vuex`) representada pelo diretório `\store` com as opções de `actions, mutations, getters e state`, representados como arquivos únicos, acompanhados do pós-fixo 'feature.js'.
### Instalação
    npm i -S vue-discover
### Uso
```
import Vue from 'vue'
import discover from 'vue-discover'
Vue.use(discover)
```
Exemplificaremos com um simples TODO LIST.
##### Criando os módulos
###### src\Modules\TodoListShow.vue
```
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
  name: 'login',
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
```
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
  name: 'login',
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
Perceba que em ambos componentes importam funcionalidades do vuex (`mapActions, mapGetters`), e chamam funcções pelo namespace `Feature1` em `...mapActions('Feature1', ['addTodo']),` e `...mapGetters('Feature1', ['todoList'])`. O Vue Discover fabrica os states e os nomeia pelo namespace de sua Feature. Desta forma, o componente não tem a responsabilidade de gerenciar ou manipular as informações do estado, ele apenas dispara o stado os eventos que deseja.

> Nota [Rotas]: O botão `<router-link :to="{name: 'app.modules.todolist.form'}">Novo</router-link>` passa no parâmetro `to` o `name` da rota que desejamos navegar. O `name` de cada rota, como dito anteriormente, refere-se à propriedade `signature` de cada `módulo`. O próximo tópico exemplificará melhor as gerações de `routes e states`. 
##### Criando uma Feature
Feature1


Configuração da store da Feature
###### src\Features\Feature1\store\actions.feature.js
```
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
```
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
```
const todoList = (state) => {
  return state.todoList
}

export default {
  todoList
}
```
###### src\Features\Feature1\store\state.feature.js
```
export default {
    todoList: []
}
```
Configuração do `index.js`
###### src\Features\Feature1\index.js
```
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
  name: 'app.features.auth',
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

Vue discover fabrica e injeta na instância do Vue as rotas e os estados (`vuex`) mapeados no diretório `Feature`.