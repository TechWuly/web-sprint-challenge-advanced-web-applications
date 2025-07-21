import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/'); // ✨ implement 
  const redirectToArticles = () => navigate('/articles'); // ✨ implement 

  const logout = () => {
    // ✨ implement
    
    // If a token is in local storage it should be removed,
    localStorage.removeItem('token'); //Remove Token
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!');  //set Goodbye message
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin();  //Redirect to Login
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true); // start spinner before request
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    try {
          const response = await axios.post(loginUrl, {username, password});
          localStorage.setItem('token', response.data.token); //store token
          setMessage(response.data.message);
          redirectToArticles();
    } catch(err){
      setMessage(err.response?.data?.message || 'Login failed');

    } finally{
      setSpinnerOn(false); // stop spinner in all cases
    }
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    try {
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization : localStorage.getItem('token')
        }
      });
      setArticles(response.data.articles);
      setMessage(response.data.message); 
       
    } catch(err){
      setMessage(err.response?.data?.message || 'Failed to create article')

    } finally{
      setSpinnerOn(false);
    }
    // Don't forget to turn off the spinner!
  };

  const postArticle = async ( article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axios.post(articlesUrl, article, {
        headers:{
          Authorization: localStorage.getItem('token')
        }
      });
      setArticles([...articles, response.data.article]);
      setMessage(response.data.message);
      setCurrentArticleId(null);
    
    } catch(err){
      setMessage(err.response?.data?.message|| 'Failed to create an article');
         
    } finally {
      setSpinnerOn(false);
    }
  };

  const updateArticle = async ({ article_id, article }) => {

    // ✨ implement
    // You got this!
    setMessage('');
    setSpinnerOn(true);

    try{
      const response = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: {
          Authorization:localStorage.getItem('token')
        }
      });

      setArticles(articles.map(art =>
        art.article_id === article_id ? response.data.article : art
      ));

      setMessage(response.data.message);
      setCurrentArticleId(null); // Reset edit mode

    } catch(err) {
      setMessage(err.response?.data?.message || 'Failed to update article')

    } finally {
      setSpinnerOn(false)

    }
    
  };

  const deleteArticle = async ( article_id) => {
    // ✨ implement
    setSpinnerOn(true);
     try{
     const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers:{
          Authorization: localStorage.getItem('token')
        }
      });

      setArticles(articles.filter(art => art.article_id !== article_id));
      setMessage(response.data.message);
      
     } catch(err){
       setMessage(err.response?.data?.message || 'Failed to delete article');
     }finally{
      setSpinnerOn(false);
     }
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on = {spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
               postArticle={postArticle}
               updateArticle={updateArticle}
               currentArticle={currentArticleId ? articles.find (art => art.article_id === currentArticleId): null}
               setCurrentArticleId={setCurrentArticleId}
              />

              <Articles 

              articles={articles}
              getArticles={getArticles}
              deleteArticle={deleteArticle}
              setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
