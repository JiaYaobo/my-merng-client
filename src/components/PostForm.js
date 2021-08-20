import React from 'react';
import {Form, Button} from 'semantic-ui-react';
import {gql, useMutation} from '@apollo/client';
import {useForm} from '../util/hooks';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function PostForm(){
    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables: {body: values.body},
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  getPosts: [result.data.createPost, ...data.getPosts],
                },
              });
            values.body = ''
        },
        onError(err){}

    })

    function createPostCallback(){
        createPost();
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a new post</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi world"
                    name="body"
                    type="text"
                    onChange={onChange}
                    value={values.body}
                    error={error? true:false}
                    />
                    <Button
                        type="submit"
                        color="teal">
                            Submit
                        </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom: 20}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body:String!){
        createPost(body:$body){
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            likeCount
            comments{
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }

`; 

export default PostForm;