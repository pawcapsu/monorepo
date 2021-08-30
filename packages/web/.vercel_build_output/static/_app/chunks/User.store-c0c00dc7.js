import{I as e,C as a}from"./vendor-da42db30.js";import{c as r}from"./graphql-d4829eba.js";const s=(()=>{const{subscribe:s,update:d}=a({});return{subscribe:s,authMe(){const{subscribe:a}=r.query(e.gql`
        query me {
          me {
            _id
            email
            username
          }
        }
      `);a((e=>{var a;e.loading||(null!=(null==(a=e.data)?void 0:a.me)?d((a=>{var r;return a.user=null==(r=null==e?void 0:e.data)?void 0:r.me,a.loaded=!0,a})):d((e=>(e.loaded=!0,e))))}))}}})();export{s as U};
