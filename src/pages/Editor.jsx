import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Grid, Radio, FormControlLabel, Checkbox } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

const QuestionnaireEditor = () => {
  const { id } = useParams();
  const [questionnaireName, setQuestionnaireName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    type: 'text',
    options: [],
    selectedOptions: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    } else {
      axios.get(`/questionnaires/${id}`)
        .then((response) => {
          setQuestionnaireName(response.data.name);
          setDescription(response.data.description);
          setQuestions(response.data.questions);
        })
        .catch((error) => console.error("Error fetching questionnaire:", error));
    }
  }, [id, navigate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ question_text: '', type: 'text', options: [], selectedOptions: [] });
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmitQuestionnaire = async () => {
    try {
      await axios.put(`/questionnaires/${id}`, {
        name: questionnaireName,
        description,
        questions,
      });
      alert('Questionnaire updated successfully!');
      navigate(`/quiz/${id}`);
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      alert("Error updating questionnaire");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Edit Questionnaire</h2>

      <TextField
        label="Questionnaire Name"
        fullWidth
        value={questionnaireName}
        onChange={(e) => setQuestionnaireName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <h3>Add Questions</h3>

      <TextField
        label="Question Text"
        fullWidth
        value={newQuestion.question_text}
        onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Question Type</InputLabel>
        <Select
          value={newQuestion.type}
          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
          label="Question Type"
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="single_choice">Single Choice</MenuItem>
          <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
        </Select>
      </FormControl>

      {['single_choice', 'multiple_choice'].includes(newQuestion.type) && (
        <TextField
          label="Options (comma separated)"
          fullWidth
          value={newQuestion.options.join(', ')}
          onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(', ') })}
          sx={{ mb: 2 }}
        />
      )}

      <Button onClick={handleAddQuestion} variant="contained" color="primary" sx={{ mb: 3 }}>
        Add Question
      </Button>

      <h4>Current Questions</h4>
      <Grid container spacing={2}>
        {questions.map((question, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <h5>{question.question_text}</h5>
              <p>Type: {question.type}</p>
              {['single_choice', 'multiple_choice'].includes(question.type) && (
                <p>Options: {question.options.join(', ')}</p>
              )}
              <Button onClick={() => handleDeleteQuestion(index)} color="error" variant="outlined">
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button onClick={handleSubmitQuestionnaire} variant="contained" color="primary" sx={{ mt: 3 }}>
        Update Questionnaire
      </Button>
    </Box>
  );
};

export default QuestionnaireEditor;
