import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Grid, RadioGroup, Radio, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";


const QuestionnaireBuilder = () => {
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
    const token = window.localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({
      question_text: '',
      type: 'text',
      options: [],
      selectedOptions: [],
    });
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmitQuestionnaire = async () => {
    try {
      const response = await axios.post('/questionnaires', {
        name: questionnaireName,
        description,
        questions,
      });
      alert('Questionnaire created successfully!');
      navigate(`/`);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert("Error submitting questionnaire");
    }
  };

  const handleOptionChange = (event, option) => {
    const value = option;
    if (newQuestion.type === 'multiple_choice') {
      setNewQuestion({
        ...newQuestion,
        selectedOptions: event.target.checked
          ? [...newQuestion.selectedOptions, value]
          : newQuestion.selectedOptions.filter((opt) => opt !== value),
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        selectedOptions: [value],
      });
    }
  };

  const renderOptions = () => {
    if (newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice') {
      return (
        <Box sx={{ mb: 2 }}>
          <h4>Options</h4>
          {newQuestion.options.map((option, index) => (
            <div key={index}>
              {newQuestion.type === 'single_choice' ? (
                <FormControlLabel
                  control={
                    <Radio
                      checked={newQuestion.selectedOptions.includes(option)}
                      onChange={(e) => handleOptionChange(e, option)}
                      value={option}
                    />
                  }
                  label={option}
                />
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newQuestion.selectedOptions.includes(option)}
                      onChange={(e) => handleOptionChange(e, option)}
                      value={option}
                    />
                  }
                  label={option}
                />
              )}
            </div>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Create a New Questionnaire</h2>

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

      {newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice' ? (
        <TextField
          label="Options (comma separated)"
          fullWidth
          value={newQuestion.options.join(', ')}
          onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(', ') })}
          sx={{ mb: 2 }}
        />
      ) : null}

      {renderOptions()}

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
              {question.type === 'single_choice' || question.type === 'multiple_choice' ? (
                <p>Options: {question.options.join(', ')}</p>
              ) : null}
              <Button
                onClick={() => handleDeleteQuestion(index)}
                color="error"
                variant="outlined"
              >
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button onClick={handleSubmitQuestionnaire} variant="contained" color="primary" sx={{ mt: 3 }}>
        Submit Questionnaire
      </Button>
    </Box>
  );
};

export default QuestionnaireBuilder;
