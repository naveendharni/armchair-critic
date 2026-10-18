import type { Entry } from "@/lib/types";

// My list. One object per title, in any order. Field notes are in src/lib/types.ts.
// Find an ID with: npm run find -- "title"
//
// DRAFTS (2026-10-16): Naveen asked for these six to be filled in from the internet
// for now, to be replaced with Naveen's own ratings and points later.
// Rating = MyAnimeList score, rounded to one decimal. Points = common praise and
// criticism from reviews, kept free of spoilers. No year, since the watch year is unknown.
export const entries: Entry[] = [
  {
    type: "anime",
    id: 21, // One Piece
    rating: 8.7,
    strong: [
      "The world keeps growing, and every island has its own look and story.",
      "The crew's bond makes the big emotional moments hit hard.",
      "The best arcs build up for dozens of episodes and then pay off.",
    ],
    weak: [
      "Slow pacing, with recaps and stretched out episodes.",
      "Over 1,000 episodes is a huge time commitment.",
      "The early episodes look dated next to the newer ones.",
    ],
    note: "A long trip that pays off if you have the time.",
  },
  {
    type: "anime",
    id: 113415, // Jujutsu Kaisen, season 1
    rating: 8.5,
    strong: [
      "Some of the best fight animation in recent years.",
      "Yuji, Megumi and Nobara are easy to root for, and Gojo steals every scene.",
      "The power system makes fights feel smart, not just loud.",
    ],
    weak: [
      "Fights often pause so someone can explain how their power works.",
      "Season one sets up a lot and resolves little.",
    ],
    note: "Worth it for the fights alone.",
  },
  {
    type: "anime",
    id: 101922, // Demon Slayer, season 1
    rating: 8.4,
    strong: [
      "Stunning animation, with episode 19 as the standout.",
      "Tanjiro is a kind hero in a dark world.",
      "The music lifts every big fight.",
    ],
    weak: [
      "A simple story that rarely surprises.",
      "Zenitsu's screaming gets old fast.",
      "Villains often get their backstory only as they die.",
    ],
    note: "It looks amazing, even when the story is thin.",
  },
  {
    type: "anime",
    id: 1535, // Death Note
    rating: 8.6,
    strong: [
      "Light and L's battle of wits keeps every episode tense.",
      "Dark music and bold direction match the mood.",
      "It asks real questions about justice and power.",
    ],
    weak: ["The second half loses steam.", "The later rivals never match L."],
    note: "The first half is close to perfect.",
  },
  {
    type: "anime",
    id: 20, // Naruto (2002)
    rating: 8,
    strong: [
      "Naruto and Sasuke's rivalry carries the whole series.",
      "The Chunin Exams arc is a classic.",
      "A story about loneliness and earning respect that still lands.",
    ],
    weak: ["Long filler stretches, especially near the end.", "Fights get dragged out with flashbacks."],
    note: "Skip the filler and it holds up.",
  },
  {
    type: "anime",
    id: 5114, // Fullmetal Alchemist: Brotherhood
    rating: 9.1,
    strong: [
      "The story was planned from start to finish, and the ending pays it all off.",
      "Big ideas about sacrifice and the cost of power, without slowing the action.",
      "A large cast where even the villains have real motives.",
    ],
    weak: [
      "The first dozen episodes rush through story the 2003 series already told.",
      "Jokes sometimes cut into serious scenes.",
    ],
    note: "One of the few long series that sticks the landing.",
  },
];
