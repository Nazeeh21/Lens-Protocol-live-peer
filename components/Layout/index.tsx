import { Box, Flex, Spacer, VStack } from "@chakra-ui/react";
import LoginButton from "../Login";
import { ReactFragment } from "react";
import { useAccount } from "wagmi";
import LogoutButton from "../Logout";

const Layout: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  return (
    <Box w="full">
      <Flex pt={3} w="80%" m="auto">
        <Spacer />
        {isConnected ? (
          <VStack>
            <Box>
              {address?.toString().slice(0, 3) +
                "...." +
                address?.toString().slice(-3)}{" "}
              connected
            </Box>
            <LogoutButton />
          </VStack>
        ) : (
          <LoginButton />
        )}
      </Flex>
      <Box mx={3}>{children}</Box>
    </Box>
  );
};

export default Layout;
