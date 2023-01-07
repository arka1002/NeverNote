import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "./aws-exports";
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import IndieTodos from './components/IndieTodos';


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
  return (
    <div style={styles.container}>
    <Heading level={1}>Hello {user.username}</Heading>
    <Button onClick={signOut} style={styles.button}>Sign out</Button>
    <h2>Amplify Todos</h2>

       {query.data?.map((todo) => (
          <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status}/>
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