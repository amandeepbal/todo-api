var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express ();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req,res){
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(rer,res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
});

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
});

// DELETE
app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id:todoId});

    if(matchedTodo){
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    }else{
        res.status(404).json({"error":"No Todo found with id " + todoId});
    }
    
});

app.listen(PORT, function(){
    console.log('Express listneing on port ' + PORT +'!');
});