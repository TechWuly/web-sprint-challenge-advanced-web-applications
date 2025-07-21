import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles({
  //destructure all props as per protoTypes
  articles,
  getArticles,
  deleteArticle,
  setCurrentArticleId,
  currentArticleId

}) {
  // ✨ where are my props? Destructure them here

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)

  if(!localStorage.getItem('token')) { //check for token to determine if user is logged in
   return <Navigate to="/"/>
  }

  useEffect(() => {
    // ✨ grab the articles here, on first render only
    getArticles() // fetch articles on component mount
  }, []) //this empty dependency array ensures this runs only once

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles
          .filter(art => art.article_id !== currentArticleId)
          .map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button 
                   disabled={currentArticleId === art.article_id}
                   onClick={() => setCurrentArticleId(art.article_id)}
                   >
                    Edit
                    </button>
                  <button 
                   disabled={currentArticleId === art.article_id}
                   onClick={() => deleteArticle(art.article_id)}
                   >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
