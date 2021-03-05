import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { withApollo as createWithApollo } from 'next-apollo';
import { createWithApollo } from './createApollo';
import { PaginatedPosts } from '../generated/graphql';
import { NextPageContext } from 'next';

const createClient = (ctx: NextPageContext) =>
    new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        credentials: 'include',
        headers: {
            cookie:
                (typeof window === 'undefined'
                    ? ctx.req?.headers.cookie
                    : undefined) || ''
        },
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: [],
                            //why paginatedPosts because it is what we returned, :PaginatedPosts what we returning
                            merge(
                                existing: PaginatedPosts | undefined,
                                incoming: PaginatedPosts
                            ): PaginatedPosts {
                                return {
                                    ...incoming,
                                    posts: [
                                        ...(existing?.posts || []),
                                        ...incoming.posts
                                    ]
                                };
                            }
                        }
                    }
                }
            }
        })
    });

export const withApollo = createWithApollo(createClient);
