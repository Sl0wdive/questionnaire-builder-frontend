import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizPage from "./pages/Quiz";
import Builder from "./pages/Builder";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, SelectIsAuth } from './redux/slices/auth';
import React from 'react';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(SelectIsAuth);

  React.useEffect(() => {
    dispatch(fetchMe());
  }, [])

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/builder" element={<Builder/>} />
        <Route path="/edit-quiz/:id" element={<Builder />} />
      </Routes>
    </div>
  );
}

export default App;
