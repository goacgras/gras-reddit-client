import React from 'react';
import { Form, Formik } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
// import { gql, useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '', email: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ userData: values });
                    console.log(response);
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                        // setErrors({
                        //     username: 'error dude'
                        // });
                    } else if (response.data?.register.user) {
                        //worked
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            isLoading={isSubmitting}
                            mt={5}
                            type="submit"
                            colorScheme="teal"
                        >
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

//anytime wants to access urql, wrapped with this
export default withUrqlClient(createUrqlClient)(Register);
