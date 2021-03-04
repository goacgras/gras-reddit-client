import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';
import UpdateAndDeleteButton from '../components/UpdateAndDeleteButton';
import { UpdootSection } from '../components/UpdootSection';
import { usePostsQuery } from '../generated/graphql';
// import { isServer } from '../utils/isServer';
import { withApollo } from '../utils/withApollo';

const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null
        },
        //for loading
        notifyOnNetworkStatusChange: true
    });

    if (!loading && !data) {
        return (
            <div>
                <div>Something went wrong on your query</div>
                <div>{error?.message}</div>
            </div>
        );
    }

    // console.log('Data: ', data);

    // console.log(data?.posts.posts);

    return (
        <Layout>
            {!data && loading ? (
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
                            fetchMore({
                                variables: {
                                    limit: variables?.limit,
                                    cursor:
                                        data.posts.posts[
                                            data.posts.posts.length - 1
                                        ].createdAt
                                }
                                //when click loadmore, it updates postsQuery
                                //stick the newPosts to prevPosts
                                // updateQuery: (
                                //     prevPosts,
                                //     { fetchMoreResult }
                                // ): PostsQuery => {
                                //     if (!fetchMoreResult) {
                                //         return prevPosts as PostsQuery;
                                //     }

                                //     return {
                                //         __typename: 'Query',
                                //         posts: {
                                //             __typename: 'PaginatedPosts',
                                //             hasMore: (fetchMoreResult as PostsQuery)
                                //                 .posts.hasMore,
                                //             posts: [
                                //                 ...(prevPosts as PostsQuery)
                                //                     .posts.posts,
                                //                 ...(fetchMoreResult as PostsQuery)
                                //                     .posts.posts
                                //             ]
                                //         }
                                //     };
                                // }
                            });
                        }}
                        isLoading={loading}
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

export default withApollo({ ssr: true })(Index);
