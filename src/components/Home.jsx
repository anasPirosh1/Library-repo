import { Title, Table, Container, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

export const Home = () => {
  const [username, setUserName] = useState("");
  const [bookList, setBookList] = useState([]);
  // const [authorList, setAuthorList] = useState([]);

  const viewBooksRead = async () => {
    if (auth.currentUser) {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: await auth.currentUser.getIdToken(),
        },
      };
      // console.log("hiii");
      const response = await fetch(
        "http://127.0.0.1:8000/viewBooksRead",
        requestOptions
      );
      const data = await response.json();
      // console.log(data.bookList);
      setUserName(data.username);
      setBookList(data.bookList);
    }
  };

  useEffect(() => {
    viewBooksRead();
  }, [auth.currentUser]);

  const deleteBookRead = async (book) => {
    console.log(book.bookName);
    const response = await fetch(
      `http://127.0.0.1:8000/deleteBookRead/${book.bookName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: await auth.currentUser.getIdToken(),
        },
      }
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <Title order={2} align="center" py="lg">
        Welcome {username.toUpperCase()}
      </Title>
      <Title order={2} align="center">
        Books You've read
      </Title>
      <Container size="sm" px="sm" py="md">
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
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bookList.map((book) => {
              return (
                <tr key={book.bookName}>
                  <td>{book.bookName}</td>
                  <td>{book.author.name}</td>
                  <td>
                    <Button mx="auto" onClick={() => deleteBookRead(book)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </>
  );
};
