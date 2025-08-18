// src/pages/ChatPage.jsx
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import { useState } from 'react';
import { useSignOut } from '@nhost/react';

// GraphQL Queries, Mutations, Subscriptions
const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      role
    }
  }
`;

const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, role: "user" }) {
      id
    }
  }
`;

const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $message: String!) {
    sendMessage(chat_id: $chat_id, message: $message) {
      id
      content
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: {title: $title}) {
      id
    }
  }
`;

// Main Chat Page Component
const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { signOut } = useSignOut();

  const { loading: chatsLoading, error: chatsError, data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS);
  // Add this right after your useQuery line
if (chatsError) {
  console.error("Error fetching chats:", JSON.stringify(chatsError, null, 2));
} //remove 
  const { data: messagesData, loading: messagesLoading } = useSubscription(GET_MESSAGES, {
    variables: { chat_id: activeChatId },
    skip:!activeChatId,
  });

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageToAction] = useMutation(SEND_MESSAGE_ACTION); // THIS LINE IS NOW CORRECT
  const [createChat] = useMutation(CREATE_CHAT);

  const handleCreateChat = async () => {
    const title = prompt("Enter new chat title:");
    if (title) {
      await createChat({ variables: { title } });
      refetchChats();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() ||!activeChatId) return;

    const userMessageContent = newMessage;
    setNewMessage('');

    await insertUserMessage({ variables: { chat_id: activeChatId, content: userMessageContent } });
    await sendMessageToAction({ variables: { chat_id: activeChatId, message: userMessageContent } });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2>Chats</h2>
        <button onClick={handleCreateChat}>+ New Chat</button>
        <button onClick={signOut} style={{ marginTop: '10px' }}>Sign Out</button>
        {chatsLoading && <p>Loading chats...</p>}
        {chatsError && <p>Error loading chats.</p>}
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', overflowY: 'auto' }}>
          {chatsData?.chats.map((chat) => (
            <li 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)} 
              style={{ 
                cursor: 'pointer', 
                padding: '0.5rem',
                backgroundColor: activeChatId === chat.id? '#e0e0e0' : 'transparent'
              }}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '75%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {!activeChatId && <p>Select a chat to start messaging.</p>}
          {messagesLoading && <p>Loading messages...</p>}
          {messagesData?.messages.map((msg) => (
            <p key={msg.id}><strong>{msg.role}:</strong> {msg.content}</p>
          ))}
        </div>
        <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '80%', padding: '0.5rem' }}
            disabled={!activeChatId}
          />
          <button type="submit" style={{ width: '18%', padding: '0.5rem' }} disabled={!activeChatId}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;