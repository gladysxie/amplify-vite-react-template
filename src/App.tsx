import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
    const { user, signOut } = useAuthenticator(); // 获取用户信息
    const [messages, setMessages] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        const subscription = client.models.Todo.observeQuery().subscribe({
            next: (data) => setMessages([...data.items]),
            error: (err) => console.error("Error observing messages:", err),
        });

        return () => subscription.unsubscribe();
    }, []);

    function sendMessage() {
        if (inputValue.trim()) {
            // 优先显示 email，如果 email 不存在则显示 username
            const senderEmail = user.attributes?.email || user.username || "Unknown User";
            client.models.Todo.create({ content: `${senderEmail}: ${inputValue.trim()}` });
            setInputValue(""); // 清空输入框
        }
    }


    return (
        <main style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'linear-gradient(135deg, #8e44ad, #3498db)',
            minHeight: '100vh', padding: '20px',
            fontFamily: 'Arial, sans-serif',
        }}>
            {/* 标题和登出按钮 */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '800px', paddingBottom: '20px',
            }}>
                <h1 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>Chatroom</h1>
                <button onClick={signOut} style={{
                    padding: '10px 20px', borderRadius: '8px', backgroundColor: '#e74c3c',
                    color: '#fff', cursor: 'pointer', fontWeight: 'bold', border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                }}>Sign out</button>
            </div>

            {/* 聊天内容框 */}
            <div style={{
                border: '1px solid #ddd', padding: '10px', width: '800px', height: '500px',
                overflowY: 'scroll', backgroundColor: '#fff', borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}>
                {messages.map((message) => {
                    // 判断是否是当前用户的消息
                    const isCurrentUser = message.userId === (user.attributes?.sub || user.username);

                    return (
                        <div key={message.id} style={{
                            display: 'flex',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', // 自己的消息靠右，其他消息靠左
                            margin: '10px 0',
                        }}>
                            <div style={{
                                maxWidth: '60%',
                                padding: '12px 16px',
                                backgroundColor: isCurrentUser ? '#8e44ad' : '#ecf0f1', // 自己的消息为紫色，其他消息为灰色
                                color: isCurrentUser ? '#fff' : '#2c3e50',
                                borderRadius: isCurrentUser ? '15px 0 15px 15px' : '0 15px 15px 15px', // 圆角样式区分
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                textAlign: 'left',
                                wordBreak: 'break-word',
                            }}>
                                <p style={{ margin: 0 }}>{message.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 输入框和发送按钮 */}
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '800px', marginTop: '20px',
            }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flex: 1, padding: '12px', borderRadius: '20px', border: '1px solid #ddd',
                        marginRight: '10px', fontSize: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff', outline: 'none',
                    }}
                />
                <button onClick={sendMessage} style={{
                    padding: '12px 24px', borderRadius: '20px',
                    backgroundColor: '#3498db', color: '#fff', cursor: 'pointer',
                    fontWeight: 'bold', fontSize: '16px', border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                >Send</button>
            </div>
        </main>
    );
}

export default App;
