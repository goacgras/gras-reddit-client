import { Box, Heading } from '@chakra-ui/react';
import { Layout } from '../../components/Layout';
import UpdateAndDeleteButton from '../../components/UpdateAndDeleteButton';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
    const { data, error, loading } = useGetPostFromUrl();

    if (loading) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find post</Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Box mb={4}>{data.post.text}</Box>
            <UpdateAndDeleteButton
                postId={data.post.id}
                creatorId={data.post.creator.id}
            />
        </Layout>
    );
};

export default withApollo({ ssr: true })(Post);
