
"use client";

import { useState, useRef, useEffect } from "react";
import { streamChat } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  role: "user" | "bot";
  content: string;
};

export function ChatPopover() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if(scrollableView) {
            scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  

  const handleNewMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    
    try {
        const result = await streamChat({ userMessage: currentInput });
        const botMessage: Message = { role: "bot", content: result.answer };
        setMessages(prev => [...prev, botMessage]);
    } catch(e) {
        const errorMessage: Message = { role: "bot", content: `Error: Could not get a response.` };
        setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive" size="icon" className="rounded-full h-14 w-14 shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 border-0" align="end">
        <Card className="h-[60vh] flex flex-col shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot /> AI Financial Assistant
            </CardTitle>
            <CardDescription>Ask me anything about your finances!</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>Hello! How can I help you manage your finances today?</p>
                    </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "bot" && (
                      <Avatar className="h-8 w-8 bg-secondary">
                        <AvatarFallback><Bot size={20} className="text-secondary-foreground"/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs rounded-lg p-3 text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {message.content}
                    </div>
                     {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-muted">
                        <AvatarFallback><User size={20} className="text-muted-foreground"/></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewMessage()}
              />
              <Button type="submit" size="icon" onClick={handleNewMessage} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
