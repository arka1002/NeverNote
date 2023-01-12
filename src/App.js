import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from "./aws-exports";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import IndieTodos from './components/IndieTodos';
import { Flex, View, useTheme, TextField } from '@aws-amplify/ui-react';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";


Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  //react-hook-form
  const { register, handleSubmit, reset, formState, formState: { errors }, formState: { isSubmitSuccessful } } = useForm();


  //aws amplify ui library
  const { tokens } = useTheme();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey: ['todos'], queryFn: async () => {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      return todos;
    }
  })
  //Mutations
  const addMutation = useMutation({
    mutationFn: async (add) => await API.graphql(graphqlOperation(createTodo, {input: add})),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })



  //resetting the form please
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ name: '', description: '' });
    }
  }, [formState, reset]);
  return (
    <>
      <div style={styles.container}>
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut} style={styles.button}>Sign out</Button>
        <h2>NeverNote</h2>
      </div>

      {/* The input form */}
      <form onSubmit={handleSubmit((data) => {
        data.status = "NOT DONE";
        addMutation.mutate(data);
      })} style={styles.container}>
        {/* register your input into the hook by invoking the "register" function */}
        <TextField
          descriptiveText="Enter a valid name"
          placeholder="Name"
          label="Name"
          errorMessage={errors.name} {...register("name", { required: true })}
        />
        {errors.name && <span>This field is required</span>}
        {/* include validation with required or other standard HTML validation rules */}
        <TextField
          descriptiveText="Enter a valid description"
          placeholder="Description"
          label="Description"
          errorMessage={errors.name} {...register("description", { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.description && <span>This field is required</span>}

        <button type="submit">Add Note</button>
      </form>


 




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
  todo: { marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);