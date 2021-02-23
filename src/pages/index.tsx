import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Link,
    Stack,
    Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import {
    useDeletePostMutation,
    useMeQuery,
    usePostsQuery
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { UpdootSection } from '../components/UpdootSection';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string
    });
    const [{ data: meData }] = useMeQuery();
    const [{ data, fetching }] = usePostsQuery({
        variables
    });

    const [, deletePost] = useDeletePostMutation();

    if (!fetching && !data) {
        return <div>Something went wrong on your query</div>;
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
                                {meData?.me?.id === post.creator.id ? (
                                    <>
                                        <NextLink
                                            href={`/post/edit/${post.id}`}
                                        >
                                            <IconButton
                                                mr={0}
                                                ml="auto"
                                                icon={<EditIcon />}
                                                aria-label="Edit-Post"
                                            />
                                        </NextLink>
                                        <IconButton
                                            mr={0}
                                            ml={2}
                                            icon={<DeleteIcon />}
                                            aria-label="Delete-Post"
                                            color="red.500"
                                            onClick={() => {
                                                deletePost({ id: post.id });
                                            }}
                                        />
                                    </>
                                ) : null}
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
