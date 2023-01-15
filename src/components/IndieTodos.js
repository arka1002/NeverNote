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
      await API.graphql({ query: updateTodo, variables: { input: add } });
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


      <div className='flex flex-row justify-evenly mb-2'>
        <div>
          <div className='font-bold'>{namey}</div>
          <div className='italic'>{description}</div>
          
        </div>
        <div>{content}</div>
      </div>




    </div>
  );
}



