import { useEffect, useState, useRef, useCallback } from "react";
import { Container, Typography, Card, CardContent, CircularProgress, Button, Select, Box, MenuItem } from "@mui/material";
import Grid from '@mui/material/Grid';
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import QuestionnaireCard from "../components/QuestionnaireCard";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  const observer = useRef();
  const lastQuizRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    setPage(1);
    setQuizzes([]);
  }, [sortBy]);

  useEffect(() => {
    setLoading(true);

    let sortOptions = {};
    switch (sortBy) {
      case "name":
        sortOptions = { name: 1 };
        break;
      case "questions":
        sortOptions = { questionsCount: 1 };
        break;
      case "completions":
        sortOptions = { completions: 1 };
        break;
      default:
        sortOptions = { name: 1 };
        break;
    }

    axios.get(`/questionnaires?sortBy=${sortBy}&page=${page}`)
      .then(async (response) => {
        if (response.data && Array.isArray(response.data)) {
          const questionnaires = response.data;

          const updatedQuizzes = await Promise.all(
            questionnaires.map(async (quiz) => {
              quiz.questionsCount = quiz.questions.length;
              try {
                const statResponse = await axios.get(`/questionnaires/${quiz._id}/statistic`);
                return { ...quiz, completions: statResponse.data.totalCompletions };
              } catch (error) {
                console.warn(`No statistics found for quiz ${quiz._id}, setting completions to 0.`);
                return { ...quiz, completions: 0 };
              }
            })
          );

          setQuizzes(prev => page === 1 ? updatedQuizzes : [...prev, ...updatedQuizzes]);
          setHasMore(updatedQuizzes.length > 0);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      });
  }, [sortBy, page]);

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const handleDelete = (quizId) => {
    if (!isAuthenticated()) {
      alert("You must be logged in to delete a questionaire.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this questionaire?")) {
      axios.delete(`/questionnaires/${quizId}`)
        .then(() => {
          setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
          alert("Quiz deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting questionaire:", error);
          alert("There was an issue deleting the questionaire.");
        });
    }
  };

  const handleEdit = (quizId) => {
    if (!isAuthenticated()) {
      alert("You must be logged in to edit a questionaire.");
      return;
    }

    navigate(`/edit-quiz/${quizId}`);
  };

  return (
    <Container sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Public Questionaire Catalog
      </Typography>

      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        sx={{ mb: 3 }}
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="questions">Number of Questions</MenuItem>
        <MenuItem value="completions">Number of Completions</MenuItem>
      </Select>

      {loading && page === 1 ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => {
              const isLastQuiz = index === quizzes.length - 1;
              return (
                <Grid
                  ref={isLastQuiz ? lastQuizRef : null}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={quiz._id}
                >
                  <QuestionnaireCard
                    quiz={quiz}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Grid>
              );
            })
          ) : (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
              No quizzes available
            </Typography>
          )}
        </Grid>
      )}

      {loading && page > 1 && (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />
      )}
    </Container>
  );
};

export default Home;
