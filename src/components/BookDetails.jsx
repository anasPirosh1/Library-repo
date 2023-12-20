import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Image,
  Title,
  Space,
  Container,
  FileInput,
  Button,
  TextInput,
} from "@mantine/core";
import { storage } from "./firebase";
import { getStorage, getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export const BookDetails = () => {
  const { id } = useParams();
  const [imageFile, setImageFile] = useState("");
  const [book, setBook] = useState(null);
  const [imageState, setImageState] = useState(false);
  const [readBy, setReadby] = useState(null);
  const [readByState, setReadByState] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionState, setDescriptionState] = useState(false);
  const navigate = useNavigate();

  const fetchBook = async () => {
    const response = await fetch(`http://127.0.0.1:8000/book/${id}`);
    const data = await response.json();
    setBook(data);
    console.log(book);
  };
  useEffect(() => {
    fetchBook();
  }, [imageState, descriptionState]);

  const uploadImage = async (book) => {
    if (imageFile == null) {
      return;
    }
    console.log(book.book_id);
    const imageRef = ref(storage, `images/${imageFile.name}`);
    const response = await uploadBytes(imageRef, imageFile);
    const url = await getDownloadURL(imageRef);
    console.log(url);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        imageUrl: url,
        book_id: book.id,
      }),
    };

    const sendImage = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/uploadImageUrl",
        requestOptions
      );
      setImageState(true);
    };
    sendImage();
  };

  const bookRead = async (book) => {
    console.log(book.book_id);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        book_id: book.id,
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
    setReadByState(true);
  };

  const addDescription = async (book) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        book_id: book.id,
        description: description,
      }),
    };

    const addDetails = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/addBookDescription",

        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setDescriptionState(true);
    };
    addDetails();
  };

  const removeFromRead = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        book_id: book.id,
      }),
    };

    const removeBookFromReadby = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/removeFromReadby",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
    };
    removeBookFromReadby();
    setReadByState(false);
  };

  const gotoAuthorPage = (book) => {
    navigate(`/author/${book.author_id}`);
  };

  return (
    <>
      {book ? (
        <>
          <Title ta="center" order={1}>
            {book.name}
          </Title>
          <Title ta="center" order={4} onClick={() => gotoAuthorPage(book)}>
            by {book.author_name}
          </Title>
          <Space h="lg" />
          {book.image ? (
            <Image mx="auto" width={400} height={400} src={book.image} />
          ) : (
            <>
              <Container size="20rem" px={0}>
                <FileInput
                  size="lg"
                  onChange={(event) => {
                    console.log(event);
                    setImageFile(event);
                  }}
                  variant="filled"
                  // elementRef={fileInputRef}
                  placeholder="Select Image"
                  accept="image/png,image/jpeg"
                />
                <Space h="md" />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button mx="auto" size="md" onClick={() => uploadImage(book)}>
                    Upload Image
                  </Button>
                </div>
              </Container>
            </>
          )}
          <Space h="lg" />
          <Container size="80rem" px={0}>
            {book.description ? (
              <Title order={4}>{book.description}</Title>
            ) : (
              <>
                <Container size="60rem" px={0}>
                  <TextInput
                    size="sm"
                    placeholder="Add Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Space h="lg" />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      mx="auto"
                      size="md"
                      onClick={() => addDescription(book)}
                    >
                      Add Description
                    </Button>
                  </div>
                </Container>
              </>
            )}
            <Space h="lg" />
          </Container>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {readByState == true ? (
              <Button mx="auto" size="md" onClick={() => removeFromRead(book)}>
                Remove from read
              </Button>
            ) : (
              <Button mx="auto" size="md" onClick={() => bookRead(book)}>
                Read
              </Button>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};
