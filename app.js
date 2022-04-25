class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  }
}

class Library {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => Library.addBook(book));
  }

  static addBook(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBookToList(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', Library.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;

  if (title === '' || author === '' || pages === '') {
    Library.showAlert('Please fill in all fields', 'danger');
  } else {
    const book = new Book(title, author, pages);

    Library.addBook(book);

    Store.addBookToList(book);
    
    Library.showAlert('Book Added', 'success');

    Library.clearFields();
  }  
})

document.querySelector('#book-list').addEventListener('click', (e) => {
  Library.deleteBook(e.target);

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  Library.showAlert('Book Removed', 'success');
})