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
import { Flex, View, useTheme } from '@aws-amplify/ui-react';
import { useForm } from "react-hook-form";


Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  //react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  //aws amplify ui library
  const { tokens } = useTheme();

  // Access the client
  const queryClient = useQueryClient();
  
  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: async () => {
    const todoData = await API.graphql(graphqlOperation(listTodos));
    const todos = todoData.data.listTodos.items;
    return todos;
  } })
  return (
    <>
      <div style={styles.container}>
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut} style={styles.button}>Sign out</Button>
        <h2>NeverNote</h2>

        
      </div>
      <Flex
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        alignContent="flex-start"
        wrap="nowrap"
        gap="1rem"
      >
        <View
          height="100%"
          width="30%"
          backgroundColor={tokens.colors.blue[20]}
        >
          {query.data?.map((todo) => (
          <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
        ))}
        </View>
        <View
          height="100%"
          width="30%"
          backgroundColor={tokens.colors.blue[40]}
        >
          {query.data?.filter(label => label.status == "NOT DONE").map((todo) => (
          <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
        ))}
        </View>
        <View
          height="100%"
          width="30%"
          backgroundColor={tokens.colors.blue[60]}
        >
          {query.data?.filter(label => label.status == "DONE").map((todo) => (
          <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
        ))}
        </View>
      </Flex>
    </>
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