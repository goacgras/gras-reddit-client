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
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import UpdateAndDeleteButton from '../components/UpdateAndDeleteButton';
import { UpdootSection } from '../components/UpdootSection';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string
    });
    const [{ data, error, fetching }] = usePostsQuery({
        variables
    });

    if (!fetching && !data) {
        return (
            <div>
                <div>Something went wrong on your query</div>
                <div>{error?.message}</div>
            </div>
        );
    }

    console.log('Data: ', data);

    // console.log(data?.posts.posts);

    return (
        <Layout>
            {!data && fetching ? (
                <div>Loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((post) =>
                        !post ? null : (
                            <Flex
                                key={post.id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                            >
                                <UpdootSection post={post} />
                                <Box my="auto">
                                    <NextLink
                                        // href={`/post/${encodeURIComponent(
                                        //     post.id
                                        // )}`}
                                        href={{
                                            pathname: '/post/[id]',
                                            query: { id: post.id }
                                        }}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {post.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Text>
                                        posted by {post.creator.username}
                                    </Text>
                                    <Text mt={4}>{post.textSnippet}</Text>
                                </Box>

                                <Box ml="auto">
                                    <UpdateAndDeleteButton
                                        postId={post.id}
                                        creatorId={post.creator.id}
                                    />
                                </Box>
                            </Flex>
                        )
                    )}
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
