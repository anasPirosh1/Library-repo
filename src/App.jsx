import { MantineProvider, Text } from "@mantine/core";
import { HeaderMegaMenu } from "./components/Header";
import { EnterDetails } from "./components/EnterDetails";
import { Books } from "./components/Books";
import { Author } from "./components/Author";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookDetails } from "./components/BookDetails";
import { AuthorDetails } from "./components/AuthorDetails";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeaderMegaMenu />} />
          <Route path="/enterdetails" element={<EnterDetails />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Author />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/author/:id" element={<AuthorDetails />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
