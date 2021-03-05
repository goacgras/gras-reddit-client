import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    PostSnippetFragment,
    useVoteMutation,
    VoteMutation
} from '../generated/graphql';
import { ApolloCache, gql } from '@apollo/client';

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
) => {
    const data = cache.readFragment<{
        id: number;
        points: number;
        voteStatus: number | null;
    }>({
        id: 'Post:' + postId,
        fragment: gql`
            fragment _ on Post {
                id
                points
                voteStatus
            }
        `
    });
    if (data) {
        if (data.voteStatus === value) {
            return;
        }
        const newPoints =
            (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
        //update fragment
        cache.writeFragment({
            id: 'Post:' + postId,
            fragment: gql`
                fragment __ on Post {
                    points
                    voteStatus
                }
            `,
            data: {
                points: newPoints,
                voteStatus: value
            }
        });
    }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loading, setLoading] = useState<
        'updoot-loading' | 'downdoot-loading' | 'not-loading'
    >('not-loading');
    const [vote] = useVoteMutation();

    // console.log('post:', post.voteStatus);

    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mr={4}
        >
            <IconButton
                aria-label="updoot post"
                icon={<ChevronUpIcon />}
                // variant="ghost"
                onClick={async () => {
                    if (post.voteStatus === 1) return;
                    setLoading('updoot-loading');
                    await vote({
                        variables: {
                            postId: post.id,
                            value: 1
                        },
                        update: (cache) => updateAfterVote(1, post.id, cache)
                    });
                    setLoading('not-loading');
                }}
                colorScheme={post.voteStatus === 1 ? 'green' : undefined}
                isLoading={loading === 'updoot-loading'}
            />

            {post.points}
            <IconButton
                aria-label="down vote post"
                icon={<ChevronDownIcon />}
                // variant="ghost"
                onClick={async () => {
                    if (post.voteStatus === -1) return;
                    setLoading('downdoot-loading');
                    await vote({
                        variables: {
                            postId: post.id,
                            value: -1
                        },
                        update: (cache) => updateAfterVote(-1, post.id, cache)
                    });
                    setLoading('not-loading');
                }}
                colorScheme={post.voteStatus === -1 ? 'red' : undefined}
                isLoading={loading === 'downdoot-loading'}
            />
        </Flex>
    );
};
