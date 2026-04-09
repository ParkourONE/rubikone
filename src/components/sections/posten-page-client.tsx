"use client";

import { PostenPage } from "./posten-page";
import { useContent } from "@/hooks/useContent";
import {
  POSTEN_CHECK_IN,
  POSTEN_ABC,
  POSTEN_BALANCE,
  POSTEN_SPRUNGKRAFT,
  POSTEN_STABILITAET,
  POSTEN_PASSEMENT,
  POSTEN_QUADRUPEDIE,
  POSTEN_CHECK_OUT,
  FOKUS_CONTENT,
} from "@/lib/constants";

type PostenKey =
  | "POSTEN_CHECK_IN"
  | "POSTEN_ABC"
  | "POSTEN_BALANCE"
  | "POSTEN_SPRUNGKRAFT"
  | "POSTEN_STABILITAET"
  | "POSTEN_PASSEMENT"
  | "POSTEN_QUADRUPEDIE"
  | "POSTEN_CHECK_OUT"
  | "FOKUS_CONTENT";

const DEFAULTS: Record<PostenKey, unknown> = {
  POSTEN_CHECK_IN,
  POSTEN_ABC,
  POSTEN_BALANCE,
  POSTEN_SPRUNGKRAFT,
  POSTEN_STABILITAET,
  POSTEN_PASSEMENT,
  POSTEN_QUADRUPEDIE,
  POSTEN_CHECK_OUT,
  FOKUS_CONTENT,
};

interface Props {
  contentKey: PostenKey;
  prevPosten?: { slug: string; title: string };
  nextPosten?: { slug: string; title: string };
}

export function PostenPageClient({ contentKey, prevPosten, nextPosten }: Props) {
  const data = useContent(contentKey, DEFAULTS[contentKey]) as {
    number: string;
    title: string;
    intro: string;
    heroImage?: string;
    exercises: Array<{ title: string; reps: string; description: string; image?: string }>;
    furtherExercises?: Array<{ title: string; description: string }>;
    tagescheck: string;
    potenzial: { title: string; content: string };
  };

  return (
    <PostenPage
      number={data.number}
      title={data.title}
      intro={data.intro}
      heroImage={data.heroImage}
      exercises={data.exercises ?? []}
      furtherExercises={data.furtherExercises ?? []}
      tagescheck={data.tagescheck}
      potenzial={data.potenzial}
      prevPosten={prevPosten}
      nextPosten={nextPosten}
      editPathPrefix={contentKey}
    />
  );
}
