import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import List from './List'
import Search from './Search'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends Component {

  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then((books) => {
      this.setState(() => ({
        books
      }))
    })
  }

  updateShelf = (book, shelfName) => {
    const bookFromState = this.state.books.find(b => b.id === book.id);
    if (bookFromState) {
      // update existing
      bookFromState.shelf = shelfName;
      BooksAPI.update(book, shelfName)
      .then(this.setState(currentState => ({
        books: currentState.books
      })))
    } else {
      // add new one
        book.shelf = shelfName;
        BooksAPI.update(book, shelfName)
        .then(this.setState(prevState => ({
          books: prevState.books.concat(book)
      })))
    }
  };

  render() {
    return (
      <div>
        <Route exact path='/' render={() => (
          <List
            books={this.state.books}
            onUpdateShelf={this.updateShelf}
          />
        )} />
        <Route exact path='/search' render={() => (
          <Search
            books={this.state.books}
            onUpdateShelf={this.updateShelf}
          />
        )} />
      </div>
    )
  }
}
export default BooksApp