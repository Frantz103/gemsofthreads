import { Heart, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Thread } from "@/types/threads";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in bg-card">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <img
            src={thread.avatar}
            alt={thread.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{thread.author}</p>
            <p className="text-sm text-muted-foreground truncate">@{thread.handle}</p>
          </div>
        </div>

        <p className="text-foreground leading-relaxed mb-4">{thread.content}</p>

        {thread.image && (
          <img
            src={thread.image}
            alt="Thread content"
            className="w-full rounded-lg mb-4 object-cover max-h-96"
          />
        )}

        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{thread.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            <span>{thread.replies.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ThreadCard;
