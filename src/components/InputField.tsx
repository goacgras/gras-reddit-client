import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Textarea
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size: _,
    ...props
}) => {
    let InputOrTextarea: any = Input;
    if (textarea) {
        InputOrTextarea = Textarea;
    }
    const [field, { error }] = useField(props);

    // '' => false
    // 'error messages stuff' => true
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
