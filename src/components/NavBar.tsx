import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'; // Client side routing
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery();
    console.log(data?.me?.username);

    let navBarMarkup = null;

    //loading
    if (fetching) {
        navBarMarkup = <p>Loading...</p>;
        //user not logged in
    } else if (!data?.me) {
        navBarMarkup = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </>
        );
        //user is logged in
    } else {
        navBarMarkup = (
            <Flex>
                <Box mr="4">{data?.me?.username.toUpperCase()}</Box>
                <Button pb="2" variant="link">
                    Logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml="auto">{navBarMarkup}</Box>
        </Flex>
    );
};
