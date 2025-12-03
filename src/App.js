import React, { useState, useEffect } from 'react';

import {
  Container, Paper, Typography, TextField, Button,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Checkbox, ButtonGroup, Box
} from '@mui/material';
import { Add, Delete, Edit, Save } from '@mui/icons-material';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load and save todos
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Core functions
  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      alert('Please enter a task!');
      return;
    }
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditTodo = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEditTodo = (id) => {
    if (!editText.trim()) {
      alert('Task cannot be empty!');
      return;
    }
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed': return todos.filter(todo => todo.completed);
      case 'pending': return todos.filter(todo => !todo.completed);
      default: return todos;
    }
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div style={{
      backgroundImage: `url('/image.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px 0',
      margin: 0
    }}>
      <Container maxWidth="sm" style={{ marginTop: '30px' }}>
        <Paper elevation={10} style={{
          padding: '25px',
          borderRadius: '15px',
          backgroundColor: 'rgba(30, 0, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(200, 50, 180, 0.5)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>

          <Typography variant="h4" align="center" gutterBottom style={{
            color: '#e46deb',
            marginBottom: '25px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>
            Todo Application
          </Typography>


          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Add your tasks here..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                style: { 
                  color: '#ffffff',
                  backgroundColor: 'rgba(60, 0, 50, 0.7)',
                  borderRadius: '8px'
                }
              }}
              InputLabelProps={{
                style: { color: '#bb86fc' }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              disabled={!newTodo.trim()}
              startIcon={<Add />}
              style={{
                minWidth: '100px',
                borderRadius: '8px',
                fontWeight: 'bold',
                backgroundColor: '#bb86fc',
                color: '#000000',
                '&:hover': { backgroundColor: '#9b6cfd' }
              }}
            >
              Add
            </Button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1" style={{ 
              marginBottom: '10px', 
              fontWeight: '500',
              color: '#e1bee7'
            }}>
              Filter tasks:
            </Typography>
            <ButtonGroup fullWidth variant="outlined" style={{ borderRadius: '8px' }}>
              {['all', 'pending', 'completed'].map((filterType) => (
                <Button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  style={{
                    backgroundColor: filter === filterType ? '#bb86fc' : 'transparent',
                    color: filter === filterType ? '#000' : '#e1bee7',
                    borderColor: '#bb86fc',
                    borderRadius: filterType === 'all' ? '8px 0 0 8px' : 
                                filterType === 'completed' ? '0 8px 8px 0' : '0',
                    textTransform: 'capitalize'
                  }}
                >
                  {filterType} (
                  {filterType === 'all' ? totalTodos :
                   filterType === 'pending' ? pendingTodos : completedTodos})
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Todo List */}
          {getFilteredTodos().length === 0 ? (
            <Typography variant="body1" align="center" style={{
              padding: '30px',
              color: '#bb86fc',
              backgroundColor: 'rgba(98, 6, 83, 0.6)',
              borderRadius: '8px',
              margin: '10px 0'
            }}>
              {todos.length === 0 
                ? '✨ No tasks yet. Add your first task above!' 
                : `No ${filter} tasks found.`}
            </Typography>
          ) : (
            <List style={{
              maxHeight: '350px',
              overflow: 'auto',
              borderRadius: '8px',
              padding: '5px'
            }}>
              {getFilteredTodos().map(todo => (
                <ListItem key={todo.id} style={{
                  backgroundColor: todo.completed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid #bb86fc',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    style={{ color: '#dcd6e3ff' }}
                  />

                  {editingId === todo.id ? (
                    <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEditTodo(todo.id)}
                        autoFocus
                        variant="standard"
                        InputProps={{ style: { color: '#fff' } }}
                      />
                      <div>
                        <IconButton onClick={() => saveEditTodo(todo.id)} style={{ color: '#bd80ccff' }}>
                          <Save />
                        </IconButton>
                        <IconButton onClick={cancelEdit} style={{ color: '#ff5252' }}>
                          ✕
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <ListItemText
                      primary={
                        <span style={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#4aa625ff' : '#e1bee7',
                          fontWeight: todo.completed ? '400' : '500'
                        }}>
                          {todo.text}
                        </span>
                      }
                      secondary={
                        <small style={{ color: '#888', fontSize: '0.75rem' }}>
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </small>
                      }
                      style={{ flex: 1 }}
                    />
                  )}

                  {editingId !== todo.id && (
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => startEditTodo(todo.id, todo.text)} style={{ color: '#bb86fc' }}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTodo(todo.id)} style={{ color: '#ff5252' }}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          {/* Stats */}
          <div style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(187, 134, 252, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" style={{ color: '#bb86fc', fontWeight: '500' }}>
              📊 Total: {totalTodos} | ⏳ Pending: {pendingTodos} | ☑️ Completed: {completedTodos}
            </Typography>
            
            {todos.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.confirm('Clear all tasks?') && setTodos([])}
                style={{
                  borderRadius: '6px',
                  borderColor: '#ff5252',
                  color: '#ff5252'
                }}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Info */}
          <Box style={{
            marginTop: '15px',
            padding: '12px',
            backgroundColor: 'rgba(187, 134, 252, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(187, 134, 252, 0.2)'
          }}>
            <Typography variant="body2" style={{ color: '#e1bee7' }}>
              💡 <span style={{ color: '#bb86fc' }}>Tip:</span> Tasks save automatically!
              <br/>• Click checkbox to mark complete
              <br/>• Click edit icon to modify task
              <br/>• Press Enter to add/edit quickly
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default TodoApp;