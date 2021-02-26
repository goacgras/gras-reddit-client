import React from 'react';
import NextLink from 'next/link';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface UpdateAndDeleteButtonProps {
    postId: number;
    creatorId: number;
}

const UpdateAndDeleteButton: React.FC<UpdateAndDeleteButtonProps> = ({
    postId,
    creatorId
}) => {
    const [{ data: meData }] = useMeQuery();
    const [, deletePost] = useDeletePostMutation();

    if (meData?.me?.id !== creatorId) {
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
                    deletePost({ id: postId });
                }}
            />
        </Box>
    );
};

export default UpdateAndDeleteButton;
