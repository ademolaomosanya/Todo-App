import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Checkbox,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon, GitHub as GitHubIcon, Twitter as TwitterIcon, Article as ArticleIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/todos/${editingId}`, { text, priority });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/todos`, { text, priority });
      }
      setText('');
      setPriority('medium');
      fetchTodos();
    } catch (error) {
      console.error('Error saving a todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setText(todo.text);
    setPriority(todo.priority);
    setEditingId(todo._id);
  };

  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`${API_URL}/todos/${todo._id}`, {
        ...todo,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode
            ? 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)'
            : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
               Todo App
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Welcome to my Basic TODO App
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This application helps you organize your tasks efficiently. Here's what you can do:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Add new tasks with priority levels (Low, Medium, High)
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Mark tasks as complete with a single click
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Edit or delete tasks as needed
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Toggle between light and dark mode for comfortable viewing
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Tip: Use the checkbox to mark tasks as complete and track your progress!
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Add a new task"
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                {editingId ? 'Update Task' : 'Add Task'}
              </Button>
            </form>
          </Paper>
          <List>
            {todos.map((todo) => (
              <ListItem
                key={todo._id}
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  border: todo.completed ? '1px solid #4caf50' : '1px solid transparent',
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  sx={{ 
                    mr: 1,
                    '&.Mui-checked': {
                      color: '#4caf50',
                    },
                  }}
                />
                <ListItemText
                  primary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body1"
                          component="span"
                          sx={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {todo.text}
                        </Typography>
                        {todo.completed && (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={todo.priority}
                          color={getPriorityColor(todo.priority)}
                          size="small"
                        />
                        {todo.completed && (
                          <Chip
                            label={`Completed at ${new Date(todo.updatedAt).toLocaleTimeString()}`}
                            size="small"
                            variant="outlined"
                            color="success"
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              About the Developer
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Hi! I'm Ademola, a passionate Software Engineer building this TODO app for the FCDC Full Stack Web Development Cohort application. I love making impact through codes and open-source contributions.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                href="https://github.com/ademolaomosanya"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<GitHubIcon />}
              >
                GitHub
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="https://x.com/omosanyaademola"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<TwitterIcon />}
              >
                Twitter
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="https://hashnode.com/@Ademolaomo"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ArticleIcon />}
              >
                Blog
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              Built with React, Node.js, and MongoDB
            </Typography>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;