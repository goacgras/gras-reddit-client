import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';

import theme from '../theme';
// import { ApolloProvider } from '@apollo/client';

function MyApp({ Component, pageProps }: any) {
    return (
        // <ApolloProvider client={client}>

        <ChakraProvider resetCSS theme={theme}>
            <ColorModeProvider
                options={{
                    useSystemColorMode: true
                }}
            >
                <Component {...pageProps} />
            </ColorModeProvider>
        </ChakraProvider>
        // </ApolloProvider>
    );
}

export default MyApp;
