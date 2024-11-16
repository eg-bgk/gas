import { Token } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function TokenAvatar({ token, className }: { token: Token; className?: string }) {
  if (token.imageUri.startsWith("http")) {
    return (
      <Avatar className={cn("size-14", className)}>
        <AvatarImage alt="avatar" src={token.imageUri} className="object-cover" />
        <AvatarFallback>ML</AvatarFallback>
      </Avatar>
    );
  }

  const hue = hashString(token.name) % 360; // Get a consistent hue between 0-360

  return (
    <div
      className={cn("size-14 rounded-full", className)}
      style={{
        backgroundColor: `hsl(${hue}, 80%, 60%)`,
      }}
    />
  );
}
