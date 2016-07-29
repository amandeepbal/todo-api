var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send('Todo API Root');
})

// GET /todos?completed=true&q=house
app.get('/todos', function(req,res){
    var queryParams = req.query;
    var filteredTodos = todos;
// completed status
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos,{completed: true})
    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos,{completed: false})
    }
// query parameter
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
    filteredTodos = _.filter(filteredTodos, function(todo){
        return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    })
    }
    
    res.json(filteredTodos);
})

// GET /todos/:id
app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
})

// POST /todo
app.post('/todos',function(req,res){
    var body = _.pick(req.body,'description','completed');
    
// validate the todo    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }
    
// set body description to trimmed value    
    body.description = body.description.trim();
    
// add incrementer and add field
    body.id = todoNextId++;

    // append to array
    todos.push(body);    

    res.json(body);
})

// DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(matchedTodo){
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    }else{
        res.status(404).json({"error":"No Todo found with id " + todoId});
    }
})

// PUT /todos/:id
app.put('/todos/:id', function(req,res){
    console.log('Express listneing on port ' + PORT +'!');
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id:todoId});
    var body = _.pick(req.body,'description','completed');
    var validAttributes = {};
    
    if(!matchedTodo){
        return res.status(404).send();        
    }
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
            validAttributes.completed = body.completed;
       }else if(body.hasOwnProperty('completed')){
            res.status(404).send();
       }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
            validAttributes.description = body.description;
       }else if(body.hasOwnProperty('description')){
            res.status(404).send();
       }
    
    _.extend(matchedTodo,validAttributes);
     res.json(validAttributes);
    
})

app.listen(PORT, function(){
    console.log('Express listneing on port ' + PORT +'!');
});
