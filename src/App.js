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
import { Flex, View, useTheme, TextField, Divider } from '@aws-amplify/ui-react';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import HandshakeIcon from '@mui/icons-material/Handshake';
import LogoutIcon from '@mui/icons-material/Logout';
import PetsIcon from '@mui/icons-material/Pets';
import AddCircleIcon from '@mui/icons-material/AddCircle';


Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  //react-hook-form
  const { register, handleSubmit, reset, formState, formState: { errors }, formState: { isSubmitSuccessful } } = useForm();


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
    mutationFn: async (add) => await API.graphql(graphqlOperation(createTodo, { input: add })),
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

      <div className='flex justify-around py-5'>
        <Heading level={5}>Hello! {user.username} <HandshakeIcon /> </Heading>


        <Button onClick={signOut}>Sign out  <LogoutIcon /></Button>

      </div>


      <Flex direction="column">
        <Divider
          orientation="horizontal" />
      </Flex>


      <h2 className='text-2xl text-center italic font-bold underline underline-offset-4'>NeverNote <PetsIcon /> </h2>
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
        {errors.name && <span className='text-rose-500'>This field is required</span>}
        {/* include validation with required or other standard HTML validation rules */}
        <TextField
          descriptiveText="Enter a valid description"
          placeholder="Description"
          label="Description"
          errorMessage={errors.name} {...register("description", { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.description && <span className='text-rose-500'>This field is required</span>}

        <button type="submit" className='transition ease-in-out delay-50 mt-5 border-solid border-2 border-indigo-600 py-2 rounded-md font-bold hover:bg-sky-500/50'>Add Note <AddCircleIcon /> </button>
      </form>



      <Flex direction="column">
        <Divider
          orientation="horizontal" />
      </Flex>


      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div>
          <p className='text-xl text-center italic font-bold underline underline-offset-4 my-5'>All Notes</p>
          {query.data?.map((todo) => (
            <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
          ))}
        </div>
        <div>
          <p className='text-xl text-center italic font-bold underline underline-offset-4 my-5'>Active</p>
          {query.data?.filter(label => label.status == "NOT DONE").map((todo) => (
            <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
          ))}
        </div>
        <div>
          <p className='text-xl text-center italic font-bold underline underline-offset-4 my-5'>Completed</p>
          {query.data?.filter(label => label.status == "DONE").map((todo) => (
            <IndieTodos id={todo.id} namey={todo.name} description={todo.description} status={todo.status} />
          ))}
        </div>
      </div>





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