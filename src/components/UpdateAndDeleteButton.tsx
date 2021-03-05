import React from 'react';
import NextLink from 'next/link';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface UpdateAndDeleteButtonProps {
    postId: number;
    creatorId: number;
}

export const UpdateAndDeleteButton: React.FC<UpdateAndDeleteButtonProps> = ({
    postId,
    creatorId
}) => {
    const { data } = useMeQuery({
        skip: isServer()
    });
    const [deletePost] = useDeletePostMutation();

    if (data?.me?.id !== creatorId) {
        return null;
    }

    return (
        <Box>
            <NextLink href={`/post/edit/${postId}`}>
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
                    deletePost({
                        variables: { id: postId },
                        update: (cache) => {
                            //post:77 this will remove from cache
                            cache.evict({ id: 'Post:' + postId });
                        }
                    });
                }}
            />
        </Box>
    );
};
