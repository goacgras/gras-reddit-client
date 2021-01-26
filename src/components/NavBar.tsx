import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'; // Client side routing
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer() // check if is in server
    });

    let navBarMarkup = null;
    // console.log(data);
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
                <Button
                    pb="2"
                    variant="link"
                    isLoading={logoutFetching}
                    onClick={() => {
                        logout();
                    }}
                >
                    Logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex bg="tan" p={4}>
            <Box ml="auto">{navBarMarkup}</Box>
        </Flex>
    );
};
