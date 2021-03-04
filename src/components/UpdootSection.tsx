import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loading, setLoading] = useState<
        'updoot-loading' | 'downdoot-loading' | 'not-loading'
    >('not-loading');
    const [vote] = useVoteMutation();
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
                        }
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
                        }
                    });
                    setLoading('not-loading');
                }}
                colorScheme={post.voteStatus === -1 ? 'red' : undefined}
                isLoading={loading === 'downdoot-loading'}
            />
        </Flex>
    );
};
