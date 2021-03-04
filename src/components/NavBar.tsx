import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'; // Client side routing
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
// import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    // const router = useRouter();
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const apolloClient = useApolloClient();
    const { data, loading } = useMeQuery({
        skip: isServer() //check if is in server
    });

    console.log('meData: ', data);

    let navBarMarkup = null;
    // console.log(data);
    //loading
    if (loading) {
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
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button mr={4} as={Link}>
                        Create Post
                    </Button>
                </NextLink>
                <Box mr="4">{data?.me?.username.toUpperCase()}</Box>
                <Button
                    variant="link"
                    isLoading={logoutFetching}
                    onClick={async () => {
                        await logout();
                        // router.reload();
                        //to logout without reload
                        apolloClient.resetStore();
                    }}
                >
                    Logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
            <Flex flex={1} m="auto" maxW={800} alignItems="center">
                <NextLink href="/">
                    <Link>
                        <Heading>Gras-Reddit</Heading>
                    </Link>
                </NextLink>
                <Box ml="auto">{navBarMarkup}</Box>
            </Flex>
        </Flex>
    );
};
