import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { UpdootSection } from '../components/UpdootSection';

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string
    });
    const [{ data, fetching }] = usePostsQuery({
        variables
    });

    if (!fetching && !data) {
        return <div>Something went wrong on your query</div>;
    }

    return (
        <Layout>
            <Flex align="center">
                <Heading>gras-reddit</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            <br />
            {!data && fetching ? (
                <div>Loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((post) => (
                        <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                            <UpdootSection post={post} />
                            <Box my="auto">
                                <Heading fontSize="xl">{post.title}</Heading>
                                <Text>posted by {post.creator.username}</Text>
                                <Text mt={4}>{post.textSnippet}</Text>
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor:
                                    data.posts.posts[
                                        data.posts.posts.length - 1
                                    ].createdAt
                            });
                        }}
                        isLoading={fetching}
                        m="auto"
                        my={8}
                    >
                        Load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
