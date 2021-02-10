import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import {
    dedupExchange,
    Exchange,
    fetchExchange,
    stringifyVariables
} from 'urql';
import { pipe, tap } from 'wonka';
import {
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
    VoteMutationVariables
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { gql } from '@urql/core';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            // If the OperationResult has an error send a request to sentry
            if (error?.message.includes('Unauthorize')) {
                Router.replace('/login'); // replace current route in history rather than push new entry
            }
        })
    );
};

const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;

        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(
            (info) => info.fieldName === fieldName
        );
        const size = fieldInfos.length;

        if (size === 0) {
            return undefined;
        }
        //check if data is in the cache return it from the cache

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;

        const isItInTheCache = cache.resolve(
            cache.resolve(entityKey, fieldKey) as string,
            'posts'
        );
        info.partial = !isItInTheCache;

        let hasMore = true;
        const result: string[] = [];
        fieldInfos.forEach((fi) => {
            const key = cache.resolve(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, 'posts') as string[];
            const _hasMore = cache.resolve(key, 'hasMore');
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            result.push(...data);
        });

        return {
            __typename: 'PaginatedPosts',
            hasMore,
            posts: result
        };
    };
};

//for ServerSideREndering
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:5000/graphql',
    fetchOptions: {
        credentials: 'include' as const
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            keys: {
                PaginatedPosts: () => null
            },
            resolvers: {
                Query: {
                    posts: cursorPagination()
                }
            },
            updates: {
                Mutation: {
                    vote: (_result, args, cache, info) => {
                        const { postId, value } = args as VoteMutationVariables;
                        //reading the fragment
                        const data = cache.readFragment(
                            gql`
                                fragment _ on Post {
                                    id
                                    points
                                }
                            `,
                            { id: postId }
                        ); // Data or null
                        console.log('Data: ', data);

                        if (data) {
                            const newPoints = (data.points as number) + value;
                            //update fragment
                            cache.writeFragment(
                                gql`
                                    fragment __ on Post {
                                        points
                                    }
                                `,
                                { id: postId, points: newPoints }
                            );
                        }
                    },
                    createPost: (_result, args, cache, info) => {
                        const allFields = cache.inspectFields('Query');
                        const fieldInfos = allFields.filter(
                            (info) => info.fieldName === 'posts'
                        );
                        //looping paginate items or queries and invalidate all of them
                        fieldInfos.forEach((fi) => {
                            cache.invalidate(
                                'Query',
                                'posts',
                                fi.arguments || {}
                            );
                        });
                    },
                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        );
                    },
                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user
                                    };
                                }
                            }
                        );
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user
                                    };
                                }
                            }
                        );
                    }
                }
            }
        }),
        errorExchange,
        ssrExchange,
        fetchExchange
    ]
});
