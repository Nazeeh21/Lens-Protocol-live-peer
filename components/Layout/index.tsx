import { Box, Flex, Spacer } from "@chakra-ui/react";
import LoginButton from "../Login";
import { ReactFragment } from "react";

const Layout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <Box  w="full">
      <Flex pt={3} w='80%' m='auto'>
        <Spacer />
        <LoginButton />
      </Flex>
      {children}
    </Box>
  );
};

export default Layout;
