import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { Select } from "@mantine/core";
import { Title } from "@mantine/core";
import { countries } from "countries-list";
import { useState, useMemo, useEffect } from "react";
import { Table } from "@mantine/core";
import { Container } from "@mantine/core";
import { Space } from "@mantine/core";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

//test
export const Author = () => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [country, setCountry] = useState("");
  const [authorList, setAuthorList] = useState([]);
  // const [authorName, setAuthorName] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const memoizedCountriesList = useMemo(() => {
    // Compute and return the value here
    // This value will be cached and memoized
    return Object.values(countries).map((country) => ({
      value: country.name,
      label: country.name,
    }));
  }, [countries]);

  async function fetchAuthors() {
    const response = await fetch("http://127.0.0.1:8000/viewAuthors");
    const data = await response.json();
    setAuthorList(data);
    console.log(authorList);
  }

  useEffect(() => {
    fetchAuthors();
  }, []);

  const addAuthor = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        name: name,
        birthYear: birthYear,
        country_of_origin: country,
      }),
    };

    const fetchData = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/addAuthor",
        requestOptions
      );
    };
    if (error == null) {
      await fetchData();
    }
    fetchAuthors();
  };

  const checkAuthorName = async (e) => {
    // setName(e.target.value);
    const response = await fetch(
      `http://127.0.0.1:8000/checkAuthorName/${name}`
    );
    const data = await response.json();
    console.log(data);
    if (data && data.msg == "Author with same name already exists") {
      setError("Author with same name already exists");
      return;
    }
    setError(null);
  };

  useEffect(() => {
    checkAuthorName();
  }, [name]);

  const deleteAuthorButton = async (author) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        author_id: author.author_id,
      }),
    };

    const deleteAuthor = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/deleteAuthor",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      fetchAuthors();
    };

    deleteAuthor();
  };

  const authorDescription = async (author) => {
    navigate(`/author/${author.author_id}`);
  };

  return (
    <>
      <Box maw={300} mx="auto">
        <Title>Add Author</Title>
        <TextInput
          label="Name"
          placeholder="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
        />
        <TextInput
          label="Birth Year"
          placeholder="Year Of Birth"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        />
        <Select
          label="Country"
          placeholder="Country of origin"
          data={memoizedCountriesList}
          value={country}
          onChange={(e) => setCountry(e)}
        />

        <Group position="right" mt="md">
          {error == null ? (
            <Button type="submit" mx="auto" onClick={addAuthor}>
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
              <th>BirthYear</th>
              <th>Country</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {authorList.map((author) => {
              return (
                <tr key={author.name}>
                  <td onClick={() => authorDescription(author)}>
                    {author.name}
                  </td>
                  <td>{author.birthYear}</td>
                  <td>{author.country_of_origin}</td>
                  <td>
                    <Button
                      type="submit"
                      mx="auto"
                      onClick={() => deleteAuthorButton(author)}
                    >
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
