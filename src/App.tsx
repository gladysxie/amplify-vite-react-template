import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
    const { user, signOut } = useAuthenticator();  // Get user information from the authenticator
    const [messages, setMessages] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setMessages([...data.items]),
        });
    }, []);

    function sendMessage() {
        const content = window.prompt("Enter your message:");
        if (content) {
            // Automatically use the logged-in user's name as the sender
            client.models.Todo.create({ content: `${user.username}: ${content}` });
        }
    }

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#a586cc', minHeight: '100vh', paddingTop: '20px' }}>
            <h1>Chatroom</h1>
            <div style={{ border: '1px solid #ddd', padding: '10px', width: '700px', height: '500px', overflowY: 'scroll', backgroundColor: '#ffffff', borderRadius: '10px' }}>
                {messages.map((message) => (
                    <div key={message.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            <button onClick={sendMessage} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#333', color: '#fff' }}>Send</button>
            <button onClick={signOut} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#333', color: '#fff' }}>Sign out</button>
        </main>
    );
}

export default App;



