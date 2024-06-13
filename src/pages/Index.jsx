import React, { useEffect, useState } from "react";
import { Container, Text, VStack, HStack, Input, Button, Box, useColorMode, IconButton, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [filter, setFilter] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top10Ids = storyIds.slice(0, 10);
        return Promise.all(
          top10Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
          )
        );
      })
      .then((stories) => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredStories(stories.filter((story) => story.url && story.url.includes(filter)));
    } else {
      setFilteredStories(stories);
    }
  }, [filter, stories]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="200px">
      <HStack width="100%" justifyContent="space-between" mb={4}>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </HStack>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Filter by domain"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          pl={10} // Add padding to the left to accommodate the search icon
        />
      </InputGroup>
      <VStack spacing={4} width="100%">
        {filteredStories.map((story) => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="lg" fontWeight="bold">
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
            </Text>
            <Text fontSize="sm" color="gray.500">
              {story.url}
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;