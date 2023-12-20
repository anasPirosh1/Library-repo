import {
  createStyles,
  Header,
  Group,
  Button,
  Box,
  Burger,
  Drawer,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Text } from "@mantine/core";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Home } from "./Home";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const [loggedIn, setLoggedIn] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
      }
    });
  }, [auth]);

  async function user(event) {
    // event.preventDefault();
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${await auth.currentUser.getIdToken()}`,
      },
    };
    console.log(auth);
    const addUser = async () => {
      const response = await fetch("http://127.0.0.1:8000/addUser", request);
      const data = await response.json();
      if (data.msg == "user added") {
        navigate("/enterdetails");
      }
    };

    addUser();
  }

  const handleLogIn = () => {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data.user.uid);
      user();
    });
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  return (
    <>
      <Box>
        <Header height={60} px="md">
          <Group position="apart" sx={{ height: "100%" }}>
            <Group>
              <LibraryBooksIcon size={30} />
              <Text fw={900}>Library</Text>
            </Group>
            <Group
              sx={{ height: "100%" }}
              spacing={0}
              className={classes.hiddenMobile}
            >
              <a href="/" className={classes.link}>
                Home
              </a>

              <a href="/authors" className={classes.link}>
                Authors
              </a>
              <a href="/books" className={classes.link}>
                Books
              </a>
            </Group>
            {loggedIn ? (
              <Button onClick={handleLogOut}>Log Out</Button>
            ) : (
              <Group className={classes.hiddenMobile}>
                <Button variant="default" onClick={handleLogIn}>
                  Log in
                </Button>
                <Button onClick={handleLogIn}>Sign up</Button>
              </Group>
            )}

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Group>
        </Header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          className={classes.hiddenDesktop}
          zIndex={1000000}
        >
          <a href="#" className={classes.link}>
            Home
          </a>
          <a href="/authors" className={classes.link}>
            Authors
          </a>
          <a href="/books" className={classes.link}>
            Books
          </a>

          {loggedIn ? (
            <Button onClick={handleLogOut}>Log Out</Button>
          ) : (
            <Group position="center" grow pb="xl" px="md">
              <Button variant="default" onClick={handleLogIn}>
                Log in
              </Button>
              <Button onClick={handleLogIn}>Sign up</Button>
            </Group>
          )}
        </Drawer>
      </Box>
      <Home />
    </>
  );
}
