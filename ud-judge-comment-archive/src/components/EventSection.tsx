import { ChevronDown, ChevronUp } from "lucide-react";
import type { Event } from "../types";
import TweetEmbed from "./TweetEmbed";

interface EventSectionProps {
  event: Event;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function EventSection({ event, isExpanded, onToggle }: EventSectionProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 first:border-t-0">
      <h3 className="sticky top-[calc(var(--topbar-height)+3.5rem)] z-10 bg-white dark:bg-gray-900">
        <button
          type="button"
          onClick={() => onToggle(event.id)}
          aria-expanded={isExpanded}
          className="flex h-12 w-full items-center justify-between text-left text-lg font-medium text-gray-800 dark:text-gray-200"
        >
          <span>{event.label}</span>
          <span className="inline-block w-5 shrink-0 text-center">
            {isExpanded ? (
              <ChevronUp className="inline size-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="inline size-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {isExpanded && (
        <div className="flex flex-wrap gap-4 pb-4">
          {event.tweets.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              まだコメントが登録されていません。
            </p>
          ) : (
            event.tweets.map((tweetId) => (
              <TweetEmbed key={tweetId} tweetId={tweetId} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default EventSection;
