import React from "react";
import { Card, CardContent, CardActions, Typography, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";

const QuestionnaireCard = ({ quiz, onDelete, onEdit, isEditable }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: 3,
      transition: "0.3s",
      "&:hover": { boxShadow: 6 },
      wordWrap: "break-word",
      overflowWrap: "break-word",
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
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

      </CardContent>

      <CardActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/quiz/${quiz._id}`)}
        >
          Run
        </Button>

        {isEditable && (
          <>
            <Button variant="outlined" onClick={() => onEdit(quiz._id)}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(quiz._id)}
            >
              Delete
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default QuestionnaireCard;