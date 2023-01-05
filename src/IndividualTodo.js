import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading, Text, TextField, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);


export default function IndividualTodos({ key, title, content, status }) {
    const [mark, setMark] = useState(status);
    function testChange() {
        setMark("DONE");
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
                onClick={testChange}
            >
                Click me!
            </Button>
        </div>
    );
}