import { useEffect, useState } from "react";
import { database } from "../services/firebaseConnection";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type QuestionType = {
  content: string;
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
  hasLiked: boolean;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();

      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions || {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, question]) => {
          return {
            id: key,
            content: question.content,
            author: question.author,
            isHighlighted: question.isHighlighted,
            isAnswered: question.isAnswered,
            likeCount: Object.values(question.likes || {}).length,
            likeId: Object.entries(question.likes || {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
            hasLiked: Object.values(question.likes || {}).some(
              (like) => like.authorId === user?.id
            ),
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
