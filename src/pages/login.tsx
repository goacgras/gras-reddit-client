import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
// import { gql, useMutation } from 'urql';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';
// import { useAuthDispatch } from '../context/auth';

// interface registerProps {}

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({
                        variables: values,
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: 'Query',
                                    me: data?.login.user
                                }
                            });
                            cache.evict({ fieldName: 'posts:{}' });
                        }
                    });
                    // const response = await login({userData: values});
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                        // setErrors({
                        //     username: 'error dude'
                        // });
                    } else if (response.data?.login.user) {
                        //worked
                        if (typeof router.query.next === 'string') {
                            router.push(router.query.next);
                        } else {
                            router.push('/');
                        }
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            placeholder="username or email"
                            label="Username or Email"
                        />
                        <Box mt={5}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Flex>
                            <NextLink href="/forgot-password">
                                <Link
                                    mt={2}
                                    ml="auto"
                                    style={{ color: 'blue' }}
                                >
                                    forgot password?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Button
                            isLoading={isSubmitting}
                            mt={5}
                            type="submit"
                            colorScheme="teal"
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(Login);
