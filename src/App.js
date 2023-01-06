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

const App = ({ signOut, user }) => {
  // Access the client
  const queryClient = useQueryClient();
  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: async () => {
    const todoData = await API.graphql(graphqlOperation(listTodos));
    const todos = todoData.data.listTodos.items;
    return todos;
  } })
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

  return (
    <div style={styles.container}>
    <Heading level={1}>Hello {user.username}</Heading>
    <Button onClick={signOut} style={styles.button}>Sign out</Button>
    <h2>Amplify Todos</h2>

       {query.data?.map((todo) => (
          <div key={todo.id}>
           <Heading
             width='30vw'
             level={6}
           >
             {todo.name}
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
             {todo.description}
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
             {todo.status}
           </Text>

           <Button
             onClick={() => {
               mutation.mutate({
                 id: todo.id,
                 status: 'DONE',
               })
             }}
           >
             DONE
           </Button>
          </div>
          
        ))} 
  </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);