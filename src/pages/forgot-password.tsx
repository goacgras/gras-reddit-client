import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
// import router from 'next/dist/next-server/lib/router/router';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (values) => {
                    await forgotPassword({ variables: values });
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box>
                            If your account exist, we already sent you an email
                        </Box>
                    ) : (
                        <Form>
                            <Box mt={5}>
                                <InputField
                                    name="email"
                                    placeholder="email"
                                    label="Email"
                                    type="email"
                                />
                            </Box>
                            <Button
                                isLoading={isSubmitting}
                                mt={4}
                                type="submit"
                                colorScheme="teal"
                            >
                                Submit
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
