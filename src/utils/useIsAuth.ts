import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
    const { data, loading } = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !data?.me?.id) {
            //where to go after login
            router.replace('/login?next=' + router.pathname);
        }
    }, [data, router, loading]);
};
