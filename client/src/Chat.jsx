import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useMutation
} from "@apollo/client";

import { Container, Row, Col, FormInput, Button } from "shards-react";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user:String!, $content:String!) {
    postMessage(user: $user, content: $content)
  }
`

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES);
  console.log(data);
  if (!data) {
    return null;
  }
  return (
    <div>
      {data.messages.map((msg) => {
        return (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: user === msg.user ? "flex-end" : "flex-start",
              paddingBottom: "1em",
            }}
          >
            {user !== msg.user && (
              <div
                style={{
                  height: 50,
                  width: 50,
                  marginRight: "0.5em",
                  border: "2px solid e5e6ea",
                  borderRadius: 25,
                  textAlign: "center",
                  fontSize: "18pt",
                  paddingTop: 5,
                }}
              >
                {msg.user.slice(0,2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: user === msg.user ? "#58bf56" : "#e5e6ea",
                color: user === msg.user ? "white" : "black",
                padding: "1em",
                borderRadius: "1em",
                maxWidth: "60%",
              }}
            >
              
              {msg.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Chat = () => {
  const [state, stateSet] = React.useState({
    user: "Jack",
    content: "",
  })

  const [postMessage] = useMutation(POST_MESSAGE)

  const onSend = () => {
    if(state.content.length > 0) {
      postMessage({
        variables: state
      });
    }
    stateSet({
      ...state,
      content: "",
    })
  }

  return (
    <Container>
      <Messages user={state.user} />
      <Row>
        <Col xs={2} style={{padding: 0}}>
          <FormInput
            label="User"
            value={state.user}
            onChange = {(evt) => stateSet({
              ...state,
              user: evt.target.value
            })}
          />
        </Col>
        <Col xs={8} >
          <FormInput
            label="User"
            value={state.content}
            onChange = {(evt) => stateSet({
              ...state,
              content: evt.target.value
            })}
            onKeyUp={(evt) => {
              if (evt.keyCode ===13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{padding: 0}}>
          <Button onClick={() => onSend()}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
