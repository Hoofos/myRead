import React, { Component } from 'react'
import Book from './Book';
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default class SearchBooks extends Component {

    state = {
        query: '',
        results: []
    }

    static propTypes = {
      onUpdateShelf: PropTypes.func.isRequired
    }

    updateQuery(query) {
        if(query.length > 0 ) {
          this.setState(() => ({
            results: [],
            query: query
        }))
          this.bookSearch(query)
        }
        else {
          this.clearQuery()
        }
    }
    clearQuery = () => {
      this.setState({
        query: '',
        results: []
      })
    }
    bookSearch(query) {
      if (query.length > 0)
        BooksAPI.search(query)
        .then(searchResults => {
          if(query === this.state.query)
            this.setState(currentState => ({ 
            results: this.updateExistingShelves(searchResults)
            }))
          }
        );
     }
     updateExistingShelves(searchResults) {
       if(!searchResults.error) {
        const myBooks = this.props.books
        const addToState = searchResults.filter((result) => myBooks.find(b => {
          if(b.id === result.id) {
            result.shelf = b.shelf
            return result
          }
        }))
        myBooks.concat(addToState)
        return searchResults
       }
     }

    render() {
        const { query, results } = this.state
        const { onUpdateShelf } = this.props

        return(
            <div className="search-books">
                <div className="search-books-bar">
                  <button
                    className="close-search"
                    onClick={ this.clearQuery }>
                  </button>
                  <div className="search-books-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, author or subject"
                        value={query}
                        onChange={(event) => this.updateQuery(event.target.value)}
                    />
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">
                    { results ? (
                      results.map((book) => (
                        <Book
                          key={book.id}
                          book={book}
                          updateShelf={onUpdateShelf} 
                            />
                        ))
                      ) : (
                        <h4>No results for, "{query}"</h4>
                      )}
                  </ol>
                  <Link
                    to='/'
                    className="return-home">
                  </Link>
                </div>
            </div>
        )
    }
}