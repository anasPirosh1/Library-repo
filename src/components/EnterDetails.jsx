import { useState } from "react";
import { Select } from "@mantine/core";
// import { useForm } from "@mantine/form";
import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { Text, Space } from "@mantine/core";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";

export const EnterDetails = () => {
  const [userName, setUserName] = useState("");
  const [sex, setSex] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await auth.currentUser.getIdToken(),
      },
      body: JSON.stringify({
        username: userName,
        gender: sex,
        email: auth.currentUser.email,
      }),
    };
    const response = await fetch("http://127.0.0.1:8000/enterdetails", request);
    navigate("/");
  };
  return (
    <div>
      <Space h="xl" />
      <Box maw={300} mx="auto" my="">
        <form>
          <TextInput
            withAsterisk
            label="Username"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Username"
          />
          <Select
            required
            value={sex}
            onChange={(e) => setSex(e)}
            label="Gender"
            placeholder="Pick one"
            data={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />

          <Group position="right" mt="md">
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};
