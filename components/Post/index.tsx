import { Box, Flex, Image, Stack, VStack } from "@chakra-ui/react";
import { AnyPublication } from "@lens-protocol/react-web";

const PostComp = ({ postData }: { postData: AnyPublication }) => {
  return (
    <Flex
      m={3}
      borderRadius={"0.5rem"}
      borderWidth={2}
      borderColor={"whitesmoke"}
      minH="10rem"
      w="full"
      p={3}
      alignItems={"flex-start"}
    >
      <Image
        w="2.5rem"
        borderRadius={"full"}
        // @ts-expect-error
        src={postData.profile.picture?.original?.url}
        alt={postData.profile.name!}
      />
      <Stack justify={"flex-start"} h="full" gap={1} ml={4}>
        <Box fontWeight="bold">Name: {postData.profile.name}</Box>
        <Box>Handle: {postData.profile.handle}</Box>
        {/* @ts-expect-error */}
        <Box>{postData.metadata?.content}</Box>
      </Stack>
    </Flex>
  );
};

export default PostComp;
