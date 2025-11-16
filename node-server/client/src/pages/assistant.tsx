import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatMessage } from "@shared/schema";

export default function Assistant() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/chat/messages", {
        message,
        sender: "user",
        timestamp: new Date().toISOString(),
      });
    },
    onMutate: async (message) => {
      await queryClient.cancelQueries({ queryKey: ["/api/chat/messages"] });
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(["/api/chat/messages"]);
      
      queryClient.setQueryData<ChatMessage[]>(["/api/chat/messages"], (old = []) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          userId: "user-1",
          message,
          sender: "user" as const,
          timestamp: new Date().toISOString(),
        },
      ]);
      
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["/api/chat/messages"], context.previousMessages);
      }
    },
    onSuccess: () => {
      setInput("");
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      }, 1500);
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(input);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="pb-6">
        <h1 className="text-3xl font-bold text-foreground">Virtual Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">Chat with your AI-powered health assistant</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {isLoading ? (
              <>
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-20 w-3/4 rounded-2xl" />
                </div>
              </>
            ) : (
              messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  data-testid={`message-${msg.id}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {msg.sender === "assistant" ? (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`flex flex-col gap-1 max-w-[70%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <CardContent className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
              data-testid="input-message"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="flex-shrink-0" 
              disabled={sendMessageMutation.isPending || !input.trim()}
              data-testid="button-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
