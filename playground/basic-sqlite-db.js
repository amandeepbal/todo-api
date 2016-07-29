var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
    'dialect':'sqlite',
    'storage':__dirname + '/basic-sqlite-db.sqlite'
});

var Todo = sequelize.define('todo',{
    description:{
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
            len:[1, 250]
        }
    },
    completed:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    }
})

sequelize.sync({
//    force: true
}).then(function(){
    console.log('Everything is synced');
    
    Todo.findById(2).then(function(todo){
        if(todo){
            console.log(todo.toJSON())
        }else{
            console.log('ID not found')
        }
    }); 
    
/*    Todo.create({
        description: 'walking my dog',
    }).then(function(todo){
        return Todo.create({
            description: 'clean the office',
    });
    }).then(function(){
        return Todo.findAll({
           where:{
               description:{
                   $like:'%clean%'
               }
           } 
        });    
    }).then(function(todos){
        if(todos){
            todos.forEach(function(todo){
                console.log(todo.toJSON())
            })
        }else{
            console.log('No todo Found')
        }
    }).catch(function(e){
         console.log(e);
    })*/

})