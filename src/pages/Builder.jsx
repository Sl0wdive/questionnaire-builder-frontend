import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Radio, FormControlLabel, Checkbox } from '@mui/material';
import { Link, useNavigate, useParams } from "react-router-dom";
import OptionListDnd from '../components/OptionListDnd';
import QuestionListDnd from '../components/QuestionListDnd';
import { v4 as uuidv4 } from 'uuid';

const QuestionnaireBuilder = () => {
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

  const isEditing = Boolean(id);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (id) {
      axios.get(`/questionnaires/${id}`)
        .then((response) => {
          setQuestionnaireName(response.data.name);
          setDescription(response.data.description);
          setQuestions(response.data.questions);
        })
        .catch((error) => console.error("Error fetching questionnaire:", error));
    } else {
      setQuestionnaireName('');
      setDescription('');
      setQuestions([]);
      setNewQuestion({
        question_text: '',
        type: 'text',
        options: [],
        selectedOptions: [],
      });
    }
  }, [id, navigate]);


  const handleAddQuestion = () => {
    if (!newQuestion.question_text.trim()) {
      alert("Please enter the question text.");
      return;
    }

    if ((newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice') && newQuestion.options.length === 0) {
      alert("Please provide at least one option.");
      return;
    }

    const questionWithId = { ...newQuestion, id: uuidv4() };
    setQuestions([...questions, questionWithId]);
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
    if (!questionnaireName.trim()) {
      alert("Please enter a name for the questionnaire.");
      return;
    }

    if (!questions || questions.length === 0) {
      alert("Please add at least one question before submitting the questionnaire.");
      return;
    }

    try {
      const response = isEditing
        ? await axios.patch(`/questionnaires/${id}`, {
          name: questionnaireName,
          description,
          questions,
        })
        : await axios.post(`/questionnaires`, {
          name: questionnaireName,
          description,
          questions,
        });

      alert(`${isEditing ? 'Questionnaire updated' : 'Questionnaire created'} successfully!`);
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

  const handleDeleteOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  const renderOptions = () => {
    if (['single_choice', 'multiple_choice'].includes(newQuestion.type)) {
      return (
        <Box sx={{ mb: 2 }}>
          <h4>Options</h4>
          {newQuestion.options.map((option, index) => {
            const isSelected = newQuestion.selectedOptions.includes(option);
            const controlProps = {
              checked: isSelected,
              onChange: (e) => handleOptionChange(e, option),
              value: option,
            };

            return (
              <FormControlLabel
                key={index}
                control={newQuestion.type === 'single_choice' ? <Radio {...controlProps} /> : <Checkbox {...controlProps} />}
                label={option}
              />
            );
          })}
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

      {(newQuestion.type === 'single_choice' || newQuestion.type === 'multiple_choice') && (
        <OptionListDnd
          options={newQuestion.options}
          setOptions={(newOpts) =>
            setNewQuestion({ ...newQuestion, options: newOpts })
          }
          handleDeleteOption={handleDeleteOption}
        />
      )}

      <Button onClick={handleAddQuestion} variant="contained" color="primary" sx={{ mb: 3 }}>
        Add Question
      </Button>

      <h4>Current Questions</h4>
      <QuestionListDnd
        questions={questions}
        setQuestions={setQuestions}
        handleDeleteQuestion={handleDeleteQuestion}
      />

      <Button onClick={handleSubmitQuestionnaire} variant="contained" color="primary" sx={{ mt: 3 }}>
        Save
      </Button>
    </Box>
  );
};

export default QuestionnaireBuilder;
