<script>
  import { client } from '../services/graphql';
  import { gql } from '@apollo/client';

  import { onMount } from 'svelte';

  let me;

  onMount(async () => {
    // 72f31864-c45b-4a4d-9e63-9c05453bf6ff
    // uid: 61163d119b31edce0323541d
    let login = await client.mutate(gql`
        mutation {
          login(uid: "61163d119b31edce0323541d") {
            _id
            email
            username
          }
        }
      `);

    console.log("LOGIN:");
    console.log(login);

    me = client.query(gql`
      query me {
        me {
          _id
          email
          username
        }
      }
    `);

    me.subscribe((obj) => {
      console.log(obj);
    });
  });
</script>