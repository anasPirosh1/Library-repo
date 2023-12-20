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

export const AuthorDetails = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [imageFile, setImageFile] = useState("");
  const [description, setDescription] = useState("");
  const [imageState, setImageState] = useState(false);
  const [descriptionState, setDescriptionState] = useState(false);
  const navigate = useNavigate();

  const fetchAuthor = async () => {
    const response = await fetch(`http://127.0.0.1:8000/author/${id}`);
    const data = await response.json();
    setAuthor(data);
    console.log(data);
  };

  useEffect(() => {
    fetchAuthor();
  }, [imageState, descriptionState]);

  const uploadImage = async (author) => {
    const imageRef = ref(storage, `AuthorImages/${imageFile.name}`);
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
        author_id: author.id,
      }),
    };

    const sendImage = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/uploadAuthorImageUrl",
        requestOptions
      );
      setImageState(true);
    };
    sendImage();
  };

  const goToBookPage = (book) => {
    navigate(`/book/${book.id}`);
  };

  const addDescription = async (author) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        author_id: author.id,
        description: description,
      }),
    };

    const addDetails = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/addAuthorDescription",

        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setDescriptionState(true);
    };
    addDetails();
  };

  return (
    <>
      {author ? (
        <>
          <Title ta="center" order={1}>
            {author.name}
          </Title>
          <Space h="lg" />
          {author.image ? (
            <Image mx="auto" width={400} height={400} src={author.image} />
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
                  placeholder="Select Image"
                  accept="image/png,image/jpeg"
                />
                <Space h="md" />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    mx="auto"
                    size="md"
                    onClick={() => uploadImage(author)}
                  >
                    Upload Image
                  </Button>
                </div>
              </Container>
            </>
          )}
          <Space h="lg" />
          <Container size="80rem" px={0}>
            {author.description ? (
              <Title order={4}>{author.description}</Title>
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
                      onClick={() => addDescription(author)}
                    >
                      Add Description
                    </Button>
                  </div>
                </Container>
              </>
            )}
            <Space h="lg" />
            <Space h="lg" />
            {author.books.length >= 1 ? (
              <Title ta="center" order={1}>
                Book(s) by {author.name}
              </Title>
            ) : (
              <Title ta="center" order={1}>
                No books yet
              </Title>
            )}
            {author.books.map((book) => {
              return (
                <Container key={book.name}>
                  <Title
                    ta="center"
                    order={2}
                    onClick={() => goToBookPage(book)}
                  >
                    {book.name}
                  </Title>
                </Container>
              );
            })}
          </Container>
          <Space h="lg" />
          <Space h="lg" />
          <Space h="lg" />
          <Space h="lg" />
        </>
      ) : null}
    </>
  );
};
