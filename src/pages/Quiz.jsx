import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import axios from "../axios";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`/questionnaires/${id}`)
      .then((response) => {
        setQuiz(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const savedStartTime = localStorage.getItem(`quizStartTime-${id}`);
    const savedAnswers = localStorage.getItem(`quizAnswers-${id}`);

    if (savedStartTime) {
      setStarted(true);
      setTimeTaken(Math.floor((Date.now() - parseInt(savedStartTime)) / 1000));
    }
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [id]);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(() => {
        setTimeTaken((prev) => prev + 1);
        localStorage.setItem(`quizTimeTaken-${id}`, timeTaken + 1);
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [started, timeTaken, id]);

  const handleStart = () => {
    setStarted(true);
    localStorage.setItem(`quizStartTime-${id}`, Date.now());
    localStorage.setItem(`quizAnswers-${id}`, JSON.stringify(answers));
  };

  const handleAnswerChange = (questionId, value) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    localStorage.setItem(`quizAnswers-${id}`, JSON.stringify(updatedAnswers));
  };

  const handleMultipleChoiceChange = (currentAnswers, option) => {
    if (currentAnswers.includes(option)) {
      return currentAnswers.filter((item) => item !== option);
    }
    return [...currentAnswers, option];
  };

  const validateAnswers = () => {
    return Object.keys(answers).every(
      (questionId) =>
        answers[questionId] !== "" &&
        (Array.isArray(answers[questionId]) ? answers[questionId].length > 0 : true)
    );
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      question_id: questionId,
      answer_text: answers[questionId],
    }));

    axios
      .post(`/questionnaires/${id}/submit`, {
        answers: formattedAnswers,
        completion_time: timeTaken,
      })
      .then(() => {
        setSubmitted(true);
        localStorage.removeItem(`quizStartTime-${id}`);
        localStorage.removeItem(`quizAnswers-${id}`);
        localStorage.removeItem(`quizTimeTaken-${id}`);

        clearInterval(intervalRef.current);
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
        alert("There was an issue submitting the quiz.");
      });
  };

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );

  if (!quiz)
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Quiz not found
      </Typography>
    );

  if (submitted) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Quiz Submitted!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          You completed the quiz in {timeTaken} seconds.
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Your Answers:
        </Typography>
        {quiz.questions.map((question) => (
          <Card key={question._id} sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{question.question_text}</Typography>
              <Typography variant="body1">
                {question.type === "multiple_choice"
                  ? answers[question._id]?.join(", ")
                  : answers[question._id]}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Button variant="contained" color="primary" onClick={() => window.location.href = "/"}>
          Go to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        {quiz.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {quiz.description}
      </Typography>

      {!started ? (
        <Button variant="contained" onClick={handleStart}>
          Start Quiz
        </Button>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Time Taken: {timeTaken} seconds
          </Typography>
          {quiz.questions.map((question) => (
            <Card key={question._id} sx={{ mb: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{question.question_text}</Typography>
                {question.type === "text" && (
                  <input
                    type="text"
                    value={answers[question._id] || ""}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  />
                )}
                {question.type === "single_choice" &&
                  question.options.map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={() => handleAnswerChange(question._id, option)}
                      />
                      {option}
                    </label>
                  ))}
                {question.type === "multiple_choice" &&
                  question.options.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        value={option}
                        checked={answers[question._id]?.includes(option)}
                        onChange={() =>
                          handleAnswerChange(
                            question._id,
                            handleMultipleChoiceChange(answers[question._id] || [], option)
                          )
                        }
                      />
                      {option}
                    </label>
                  ))}
              </CardContent>
            </Card>
          ))}
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={!validateAnswers()}>
            Submit Quiz
          </Button>
        </>
      )}
    </Container>
  );
};

export default Quiz;