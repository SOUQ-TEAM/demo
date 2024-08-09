'use client';

import { useState } from 'react';
import { queryChromaDB } from '@/utils/chroma';

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, input]);
  
      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', prompt: input }),
        });
  
        const data = await response.json();
        const chatbotResponse = data.text;
  
        // Query ChromaDB based on user input
        const chromaDBResponse = await queryChromaDB(input, 1);
  
        if (Array.isArray(chromaDBResponse) && chromaDBResponse.length > 0) {
          const firstChromaDBDocument = (chromaDBResponse[0] as { document: string })?.document;
          const combinedResponse = `${firstChromaDBDocument} ${chatbotResponse}`;
          setMessages([...messages, combinedResponse]);
        } else {
          console.warn('No results found in ChromaDB.');
        }
      } catch (error) {
        console.error('Error handling in handleSendMessage:', error);
      }
  
      setInput('');
    }
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ...other components */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white text-black mr-2 p-1 rounded-md"
        />
        <button className="bg-black text-white p-1 rounded-md border-dotted border border-gray-300" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </main>
  );
}
