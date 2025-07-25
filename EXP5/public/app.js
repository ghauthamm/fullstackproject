var app = angular.module('todoApp', []);

app.controller('TodoController', function($http) {
    var self = this;
    self.todos = [];
    self.newTodo = '';

    self.loadTodos = function() {
        $http.get('/api/todos').then(function(response) {
            self.todos = response.data;
        });
    };

    self.addTodo = function() {
        if (!self.newTodo) return;
        $http.post('/api/todos', { text: self.newTodo }).then(function(response) {
            self.todos = response.data;
            self.newTodo = '';
        });
    };

    self.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id).then(function(response) {
            self.todos = response.data;
        });
    };

    self.loadTodos();
}); 