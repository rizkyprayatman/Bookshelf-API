/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */

const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    } = request.payload;

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
      };

      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};

// eslint-disable-next-line consistent-return
const getAllBooksHandler = (request, h) => {
  const { reading } = request.query;
  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) => book.reading === true)
          .map((read) => ({
            id: read.id,
            name: read.name,
            publisher: read.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) => book.reading === false)
          .map((unread) => ({
            id: unread.id,
            name: unread.name,
            publisher: unread.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  const { finished } = request.query;
  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) => book.finished === true)
          .map((finish) => ({
            id: finish.id,
            name: finish.name,
            publisher: finish.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
          .filter((book) => book.finished === false)
          .map((unfinish) => ({
            id: unfinish.id,
            name: unfinish.name,
            publisher: unfinish.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  const { name } = request.query;
  if (name === null || name === undefined || name === '') {
    const response = h.response({
      status: 'success',
      data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
  }
  if (name) {
    const response = h.response({
      status: 'success',
      data: {
          books: books
          .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const book = books.filter((Book) => Book.id === bookid)[0];

    if (book !== undefined) {
        return {
          status: 'success',
          data: {
            book,
          },
        };
      }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      } = request.payload;

      if (name === undefined) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
      }

      if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
      }
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((Book) => Book.id === bookid);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookid } = request.params;

    const index = books.findIndex((Book) => Book.id === bookid);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

   const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  };

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
