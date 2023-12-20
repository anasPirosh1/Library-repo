import { TextInput, Button, Group, Box } from "@mantine/core";
import { Select } from "@mantine/core";
import { useState, useEffect, useMemo } from "react";
import { Space, FileInput } from "@mantine/core";
import { Table, Text } from "@mantine/core";
import { Container, Image } from "@mantine/core";
import { auth } from "./firebase";
import { useRef } from "react";
import { getStorage, getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";

// import { v4 } from "uuid";

export const Books = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [issueYear, setIssueYear] = useState("");
  const [authorList, setAuthorList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState("");
  // const [image, setImage] = useState(null);
  const [readby, setReadby] = useState(null);
  const storage = getStorage();
  const navigate = useNavigate();

  const fileInputRef = useRef();

  const fetchAuthors = async () => {
    const response = await fetch("http://127.0.0.1:8000/viewAuthors");
    const data = await response.json();
    setAuthorList(data);
    // console.log(authorList);
  };

  const memoizedAuthorList = useMemo(() => {
    return authorList.map((author) => ({
      value: author.name,
      label: author.name,
    }));
  }, [authorList]);

  useEffect(() => {
    fetchAuthors();
    fetchBooks();
    console.log(bookList);
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("http://127.0.0.1:8000/viewBooks");
    const data = await response.json();
    setBookList(data);
  };

  const addBook = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        name: name,
        author: author,
        issueYear: issueYear,
      }),
    };

    const fetchData = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/addBook",
        requestOptions
      );
    };
    await fetchData();
    fetchBooks();
  };

  const checkBookName = async (e) => {
    // setName(e.target.value);
    const response = await fetch(`http://127.0.0.1:8000/checkBookName/${name}`);
    const data = await response.json();
    // console.log(data);
    if (data && data.msg == "Book with same name already exists") {
      setError("Book with same name already exists");
      return;
    }
    setError(null);
  };

  useEffect(() => {
    checkBookName();
  }, [name]);

  const bookRead = async (book) => {
    console.log(book.book_id);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        book_id: book.book_id,
      }),
    };

    const readBy = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/read_by",

        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setReadby(data);
    };
    readBy();
  };

  // const handleFileSelect = (files) => {
  //   setFile(files);
  //   console.log(files);
  // };

  // const uploadImage = async (book) => {
  //   const selectedFile = file;
  //   console.log(selectedFile);
  //   const formData = new FormData();
  //   formData.append("image", selectedFile);
  //   formData.append("book_id", book.book_id);
  //   console.log(formData.get("book_id"));

  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       Authorization: await auth.currentUser.getIdToken(),
  //     },
  //     body: formData,
  //   };

  //   const sendImage = async () => {
  //     const response = await fetch(
  //       "http://127.0.0.1:8000/uploadBookImage",
  //       requestOptions
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   };
  //   sendImage();
  //   await fetchBooks();
  // };

  const bookDescription = async (book) => {
    // const response = await fetch(
    //   `http://127.0.0.1:8000/bookDescription/${book.name}`
    // );
    // const data = await response.json();
    // console.log(data);
    navigate(`/book/${book.book_id}`);
  };

  const deleteBookButton = async (book) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        book_id: book.book_id,
      }),
    };

    const deleteBook = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/deleteBook",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      fetchBooks();
    };

    deleteBook();
  };

  return (
    <>
      <Box maw={300} mx="auto">
        <TextInput
          label="Name"
          placeholder="Name Of Book"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
        />
        <Select
          label="Author"
          placeholder="Author"
          data={memoizedAuthorList}
          value={author}
          onChange={(e) => setAuthor(e)}
        />
        <TextInput
          label="IssueYear"
          placeholder="Year Of Issue"
          value={issueYear}
          onChange={(e) => setIssueYear(e.target.value)}
        />
        <Group position="right" mt="md">
          {error == null ? (
            <Button type="submit" mx="auto" onClick={addBook}>
              Submit
            </Button>
          ) : (
            <Button mx="auto" disabled>
              Submit
            </Button>
          )}
        </Group>

        <Space h="sm" />
      </Box>
      <Container size="sm" px="sm">
        <Table
          horizontalSpacing="xl"
          verticalSpacing="sm"
          fontSize="md"
          highlightOnHover
          withBorder
          withColumnBorders
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Issue Year</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bookList.map((book) => {
              return (
                <tr key={book.name}>
                  <td onClick={() => bookDescription(book)}>{book.name}</td>
                  <td onClick={() => bookDescription(book)}>{book.author}</td>
                  <td onClick={() => bookDescription(book)}>
                    {book.issueYear}
                  </td>
                  <td>
                    <Button
                      type="submit"
                      mx="auto"
                      onClick={() => deleteBookButton(book)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Space h="sm" />
      </Container>
    </>
  );
};
