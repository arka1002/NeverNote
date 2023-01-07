import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTodo, updateTodo } from '../graphql/mutations'
import { Button, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "../aws-exports";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'


Amplify.configure(awsExports);


export default function IndieTodos({ id, namey, description, status }) {
    // Access the client
    const queryClient = useQueryClient();
    // Mutations
    const mutation = useMutation({
        mutationFn: async (add) => {
            await API.graphql({ query: updateTodo, variables: {input: add}});
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })
    let content;
    if (status == "NOT DONE") {
        content = <Button
        onClick={() => {
            mutation.mutate({
              id: id,
              status: 'DONE',
            })
          }}
      >
        DONE
      </Button> 
    } else {
        content = <Button
        onClick={() => {
            mutation.mutate({
              id: id,
              status: 'NOT DONE',
            })
          }}
      >
        NOT DONE
      </Button>
    }
    return (
        <div key={id}>
            <Heading
                width='30vw'
                level={6}
            >
                {namey}
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
                {description}
            </Text>
            {content}
        </div>
    );
}



