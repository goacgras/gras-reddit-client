import React, { useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

//TODO Take the token & new password and send to server with mutation
const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token:
                            typeof router.query.token === 'string'
                                ? router.query.token
                                : ''
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        //worked
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError ? (
                            <Flex>
                                <Box mr={5} style={{ color: 'red' }}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password">
                                    <Link style={{ color: 'blue' }}>
                                        get a new one?
                                    </Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button
                            isLoading={isSubmitting}
                            mt={5}
                            type="submit"
                            colorScheme="teal"
                        >
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
