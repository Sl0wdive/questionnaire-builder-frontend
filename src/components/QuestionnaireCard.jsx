import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";

const QuestionnaireCard = ({ quiz, onDelete, onEdit, isEditable }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ boxShadow: 3,
      transition: "0.3s",
      "&:hover": { boxShadow: 6 },
      display: "flex",
      flexDirection: "column",
      height: "100%", }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">{quiz.name}</Typography>
        <Typography color="text.secondary">{quiz.description}</Typography>
        <Typography sx={{ color: "#5C6BC0", fontStyle: "italic" }}>
          Created by: {quiz.creator?.fullName}
        </Typography>
        <Typography color="primary" sx={{ mt: 1 }}>
          Questions: {quiz.questionsCount}
        </Typography>
        <Typography color="primary" sx={{ mt: 1 }}>
          Completions: {quiz.completions ?? 0}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid>
            <Button variant="outlined" color="primary" onClick={() => navigate(`/quiz/${quiz._id}`)}>Run</Button>
          </Grid>
          {isEditable && (
            <Grid container spacing={2} >
              <Grid item>
                <Button variant="outlined" onClick={() => onEdit(quiz._id)}>Edit</Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="error" onClick={() => onDelete(quiz._id)}>Delete</Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireCard;