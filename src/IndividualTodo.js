import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation, graphql } from 'aws-amplify'
import { createTodo, updateTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading, Text, TextField, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);


export default function IndividualTodos({ key, title, content, label }) {
    const [mark, setMark] = useState(label);
    function testChange() {
        setMark("DONE");
    }


    async function updateStatus() {
        setMark("DONE");
        await API.graphql({ query: updateTodo, variables: {input: {
            id: key,
            status: "DONE"
        }}});
    }



    return (
        <div key={key}>
            <Heading
                width='30vw'
                level={6} 
            >
                {title}
            </Heading>
            <Text
                variation="primary"
                as="p"
                color="black"
                lineHeight="1.5em"
                fontWeight={400}
                fontSize="1em"
                fontStyle="normal"
                textDecoration="none"
                width="30vw"
            >
                {mark}
            </Text>   
            <Text
                variation="primary"
                as="p"
                color="black"
                lineHeight="1.5em"
                fontWeight={400}
                fontSize="1em"
                fontStyle="normal"
                textDecoration="none"
                width="30vw"
            >
                {content}
            </Text>
            <Button
                onClick={updateStatus}
            >
                Click me!
            </Button>
        </div>
    );
}