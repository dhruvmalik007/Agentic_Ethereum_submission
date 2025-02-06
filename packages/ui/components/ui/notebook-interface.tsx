import React from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Input } from './input';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

interface NotebookInterfaceProps {
  onQuerySubmit?: (query: string) => void;
}

export function NotebookInterface({ onQuerySubmit }: NotebookInterfaceProps) {
  const [query, setQuery] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'user',
        content: query.trim()
      };
      setMessages([...messages, newMessage]);
      onQuerySubmit?.(query);
      setQuery('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Query History */}
        <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <Card className="bg-muted">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  No queries yet. Start by asking a question about your resources.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <Card className={`max-w-[80%] ${
                  message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <CardContent className="p-3 flex gap-2 items-start">
                    {message.type === 'assistant' ? (
                      <Bot className="h-5 w-5 mt-1" />
                    ) : (
                      <User className="h-5 w-5 mt-1" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your resources..."
            className="flex-1"
          />
          <Button type="submit" disabled={!query.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
