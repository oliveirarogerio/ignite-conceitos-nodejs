const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;


  const usuario = users.find(usuario => usuario.username === username);

  if (!usuario) {
    return response.status(404).json({ error: "User not found" });
  }

  request.usuario = usuario;

  console.log(usuario);

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User Already Exists!" });
  }
 
  const usuario = {
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: [],
  };

  users.push(usuario);

  console.log(usuario);

  return response.status(201).json(usuario);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
 const {usuario} = request

 return response.json(usuario.todos)
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { usuario } = request;
  const { title, deadline } = request.body;
 

  const createTodo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  usuario.todos.push(createTodo);

  return response.status(201).json(createTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {title , deadline } = request.body
  const {usuario} = request
  const {id} = request.params




  const todo = usuario.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: "Todo Already Exists!" });
  }

  todo.title = title
  todo.deadline = new Date(deadline)

 return response.status(201).json(todo);

});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const {id} = request.params
  const {usuario} = request

  const todo = usuario.todos.find(todo => todo.id === id)


  if (!todo) {
    return response.status(404).json({ error: "Todo Already Exists!" });
  }

  todo.done = !todo.done

  return response.status(200).json(todo);

});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {id} = request.params
  const {usuario} = request

  const todo = usuario.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(404).json({ error: "Todo Already Exists!" });
  }

  usuario.todos.splice(todo,1)


return response.status(204).send()

});

module.exports = app;
