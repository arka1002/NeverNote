import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTodo, updateTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "./aws-exports";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'


Amplify.configure(awsExports);

export default function StatusButton(id, status) {
    // Access the client
    const queryClient = useQueryClient();
    // Mutations
    const mutation = useMutation({
        mutationFn: async (add) => {
            await API.graphql({ query: updateTodo, variables: { input: add } });
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })




    if (status == "all") {
        return <Button
            onClick={() => {
                mutation.mutate({
                    id: id,
                    status: 'DONE',
                })
            }}
        >
            DONE
        </Button>
    } else if (status == "DONE") {
        return <Button
            onClick={() => {
                mutation.mutate({
                    id: id,
                    status: 'DONE',
                })
            }}
        >
            all
        </Button>
    }
}