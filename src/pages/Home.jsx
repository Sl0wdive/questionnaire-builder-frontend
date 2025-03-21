import { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Button, Select, MenuItem } from "@mui/material";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

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
        sortOptions = { completions: -1 };
        break;
      default:
        sortOptions = { name: 1 };
        break;
    }

    axios.get(`/questionnaires?sortBy=${sortBy}`)
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

          setQuizzes(updatedQuizzes);
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
  }, [sortBy]);

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

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
      setLoading(true);

      axios.get(`/questionnaires?page=${page + 1}`)
        .then(response => {
          setQuizzes(prevQuizzes => [
            ...prevQuizzes,
            ...response.data
          ]);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching more questionaires:", error);
          setLoading(false);
        });
    }
  };

  return (
    <Container sx={{ textAlign: "center", mt: 4 }} onScroll={handleScroll}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Questionaire Catalog
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
        <CircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card sx={{ boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                  <CardContent>
                    <Typography variant="h6">{quiz.name}</Typography>
                    <Typography color="text.secondary">{quiz.description}</Typography>
                    <Typography color="primary" sx={{ mt: 1 }}>Questions: {quiz.questionsCount}</Typography>
                    <Typography color="primary" sx={{ mt: 1 }}>
                      Completions: {quiz.completions ?? 0}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item>
                        <Button variant="outlined" onClick={() => handleEdit(quiz._id)}>Edit</Button>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" color="primary" onClick={() => navigate(`/quiz/${quiz._id}`)}>Run</Button>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(quiz._id)}>Delete</Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
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
