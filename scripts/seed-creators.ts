// Seed script for the 50 creator list
// Run with: npx tsx scripts/seed-creators.ts
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const creators = [
  { name: "Alex Hormozi", tiktok_handle: "hormozi", instagram_handle: "hormozi", youtube_channel_id: "UCPr7L-CmPMHJIGEj_kyGnCw", niche_tags: ["business", "personal_brand", "marketing"] },
  { name: "Codie Sanchez", tiktok_handle: "codiesanchez", instagram_handle: "codiesanchez", youtube_channel_id: "UCps1KSZG4ZSEFsPveSPaYjg", niche_tags: ["business", "investing", "personal_brand"] },
  { name: "Gary Vee", tiktok_handle: "garyvee", instagram_handle: "garyvee", youtube_channel_id: "UCctXZhXmQk4DAMBhnEAUPeg", niche_tags: ["marketing", "personal_brand", "crypto"] },
  { name: "Sahil Bloom", tiktok_handle: "sahilbloom", instagram_handle: "sahilbloom", youtube_channel_id: "UC4MLhIsY6SaqXdSUx0q8nig", niche_tags: ["personal_brand", "business", "marketing"] },
  { name: "Dan Koe", tiktok_handle: "dankoe", instagram_handle: "dankoe", youtube_channel_id: "UCPCYgVbDFUzUb7o9ijb2cBQ", niche_tags: ["personal_brand", "business", "crypto"] },
  { name: "Ali Abdaal", tiktok_handle: "aliabdaal", instagram_handle: "aliabdaal", youtube_channel_id: "UCoOae5nYA7VqaXzerajD0lg", niche_tags: ["productivity", "personal_brand", "business"] },
  { name: "Justin Welsh", tiktok_handle: "justinwelsh", instagram_handle: "justinwelsh", youtube_channel_id: null, niche_tags: ["personal_brand", "marketing", "solopreneur"] },
  { name: "Iman Gadzhi", tiktok_handle: "imangadzhi", instagram_handle: "imangadzhi", youtube_channel_id: "UCljd0ZzJJu-ExOZ7iOaKlwQ", niche_tags: ["business", "marketing", "personal_brand"] },
  { name: "Nicolas Cole", tiktok_handle: "nicolascole77", instagram_handle: "nicolascole77", youtube_channel_id: null, niche_tags: ["writing", "personal_brand", "content"] },
  { name: "Leila Hormozi", tiktok_handle: "leilahormozi", instagram_handle: "leilahormozi", youtube_channel_id: "UCWyQ_Fxc1QsqymvIrJz6C1A", niche_tags: ["business", "personal_brand", "marketing"] },
  { name: "Naval Ravikant", tiktok_handle: null, instagram_handle: "naval", youtube_channel_id: null, niche_tags: ["philosophy", "crypto", "investing"] },
  { name: "Chris Do", tiktok_handle: "thechrisdo", instagram_handle: "thechrisdo", youtube_channel_id: "UCnmGIG8eLMOjg1Lmkgti51g", niche_tags: ["design", "personal_brand", "business"] },
  { name: "Vanessa Lau", tiktok_handle: "vanessalau.co", instagram_handle: "vanessalau.co", youtube_channel_id: "UCbEKLXFrPx-cq3akIw9JA1w", niche_tags: ["content", "personal_brand", "marketing"] },
  { name: "Pat Flynn", tiktok_handle: "patflynn", instagram_handle: "patflynn", youtube_channel_id: "UCGk1LnaSGlvsRFLnQfKJdcA", niche_tags: ["business", "personal_brand", "marketing"] },
  { name: "Dickie Bush", tiktok_handle: "dickiebush", instagram_handle: "dickiebush", youtube_channel_id: null, niche_tags: ["writing", "personal_brand", "content"] },
  { name: "Shaan Puri", tiktok_handle: "shaanpuri", instagram_handle: "shaanvp", youtube_channel_id: null, niche_tags: ["business", "crypto", "personal_brand"] },
  { name: "Sam Parr", tiktok_handle: null, instagram_handle: "thesamparr", youtube_channel_id: null, niche_tags: ["business", "media", "personal_brand"] },
  { name: "Mr Beast", tiktok_handle: "mrbeast", instagram_handle: "mrbeast", youtube_channel_id: "UCX6OQ3DkcsbYNE6H8uQQuVA", niche_tags: ["content", "business", "personal_brand"] },
  { name: "Steven Bartlett", tiktok_handle: "stevenbartlett", instagram_handle: "steven", youtube_channel_id: "UCHnHWAi9URF38v0l-uOAR7w", niche_tags: ["business", "personal_brand", "marketing"] },
  { name: "Tim Ferriss", tiktok_handle: null, instagram_handle: "timferriss", youtube_channel_id: "UCznv7Vf9nBdJYvBagFdAHWw", niche_tags: ["productivity", "business", "personal_brand"] },
  { name: "Noah Kagan", tiktok_handle: "noahkagan", instagram_handle: "noahkagan", youtube_channel_id: "UCx5UiKnbOBSqaRcABLKfFIA", niche_tags: ["business", "marketing", "personal_brand"] },
  { name: "Hormozi (Gym Launch)", tiktok_handle: "gymlaunch", instagram_handle: "gymlaunch", youtube_channel_id: null, niche_tags: ["fitness", "business", "marketing"] },
  { name: "Ed Mylett", tiktok_handle: "edmylett", instagram_handle: "edmylett", youtube_channel_id: "UCp3v0nGm7I6OSpRwgr8QCog", niche_tags: ["motivation", "business", "personal_brand"] },
  { name: "Russell Brunson", tiktok_handle: "russellbrunson", instagram_handle: "russellbrunson", youtube_channel_id: "UCww7ov9cP1MNfpLFKW49VBw", niche_tags: ["marketing", "business", "personal_brand"] },
  { name: "Grant Cardone", tiktok_handle: "grantcardone", instagram_handle: "grantcardone", youtube_channel_id: "UCJXmf9RQMB9Ei6CwTz7Umhg", niche_tags: ["real_estate", "business", "personal_brand"] },
  { name: "Gary Tan", tiktok_handle: "garrytan", instagram_handle: "garrytan", youtube_channel_id: null, niche_tags: ["crypto", "business", "investing"] },
  { name: "Balaji", tiktok_handle: null, instagram_handle: "balaborhood", youtube_channel_id: null, niche_tags: ["crypto", "technology", "investing"] },
  { name: "Raoul Pal", tiktok_handle: null, instagram_handle: "raoulgmi", youtube_channel_id: "UCvjzlD-Y36x_CrZQi3s-Oug", niche_tags: ["crypto", "finance", "personal_brand"] },
  { name: "Anthony Pompliano", tiktok_handle: "anthonypompliano", instagram_handle: "apompliano", youtube_channel_id: "UCpyQ1wGA-E7VRoSjYYqfSxw", niche_tags: ["crypto", "investing", "personal_brand"] },
  { name: "Layah Heilpern", tiktok_handle: "layahheilpern", instagram_handle: "layahheilpern", youtube_channel_id: null, niche_tags: ["crypto", "personal_brand", "content"] },
  { name: "Ben Armstrong (BitBoy)", tiktok_handle: "bitboy_crypto", instagram_handle: "bitboycrypto", youtube_channel_id: null, niche_tags: ["crypto", "personal_brand", "content"] },
  { name: "Coin Bureau (Guy)", tiktok_handle: "coinbureau", instagram_handle: "coinbureau", youtube_channel_id: "UCqK_GSMbpiV8spgD3ZGloSw", niche_tags: ["crypto", "education", "personal_brand"] },
  { name: "Lark Davis", tiktok_handle: "thecryptolark", instagram_handle: "thecryptolark", youtube_channel_id: "UCl2oCaw8hdR_kbqyqd2klIA", niche_tags: ["crypto", "personal_brand", "content"] },
  { name: "Ran Neuner", tiktok_handle: null, instagram_handle: "cryptomanran", youtube_channel_id: null, niche_tags: ["crypto", "finance", "personal_brand"] },
  { name: "Scott Galloway", tiktok_handle: null, instagram_handle: "profgalloway", youtube_channel_id: null, niche_tags: ["business", "marketing", "personal_brand"] },
  { name: "Morning Brew Team", tiktok_handle: "morningbrew", instagram_handle: "morningbrew", youtube_channel_id: null, niche_tags: ["media", "business", "content"] },
  { name: "Austin Rief", tiktok_handle: null, instagram_handle: "austin_rief", youtube_channel_id: null, niche_tags: ["media", "business", "personal_brand"] },
  { name: "Jack Butcher", tiktok_handle: null, instagram_handle: "jackbutcher", youtube_channel_id: null, niche_tags: ["design", "crypto", "personal_brand"] },
  { name: "David Perell", tiktok_handle: null, instagram_handle: "davidperell", youtube_channel_id: null, niche_tags: ["writing", "personal_brand", "content"] },
  { name: "Tina Huang", tiktok_handle: "tinahuang1", instagram_handle: "tinahuang1", youtube_channel_id: "UC2UXDak6o7rBm23k3Vv5dww", niche_tags: ["tech", "personal_brand", "content"] },
  { name: "Mark Tilbury", tiktok_handle: "marktilbury", instagram_handle: "marktilbury", youtube_channel_id: "UCzIXh4fzOfEaDhauD6eGZdA", niche_tags: ["finance", "personal_brand", "content"] },
  { name: "Graham Stephan", tiktok_handle: "grahamstephan", instagram_handle: "grahamstephan", youtube_channel_id: "UCV6KDgJskWaEckne5aPA0aQ", niche_tags: ["finance", "personal_brand", "content"] },
  { name: "Andrei Jikh", tiktok_handle: "andreijikh", instagram_handle: "andreijikh", youtube_channel_id: "UCGy7SkBjcIAgTiwkXEtPnYg", niche_tags: ["finance", "crypto", "personal_brand"] },
  { name: "Jaspreet Singh", tiktok_handle: "minoritymindset", instagram_handle: "minoritymindset", youtube_channel_id: "UCT3EznhW_HN3aOBUKrMEcdw", niche_tags: ["finance", "personal_brand", "content"] },
  { name: "Meet Kevin", tiktok_handle: "meetkevin", instagram_handle: "meetkevin", youtube_channel_id: "UCUvvj5lwue7PspotMDjk5UA", niche_tags: ["finance", "crypto", "personal_brand"] },
  { name: "Tom Bilyeu", tiktok_handle: "tombilyeu", instagram_handle: "tombilyeu", youtube_channel_id: "UCnYMOamNKLGVlJgRUbamveA", niche_tags: ["motivation", "business", "personal_brand"] },
  { name: "Lewis Howes", tiktok_handle: "lewishowes", instagram_handle: "lewishowes", youtube_channel_id: "UCKEfKoJ5qwYl6GjW6JQD7mQ", niche_tags: ["motivation", "business", "personal_brand"] },
  { name: "Jay Shetty", tiktok_handle: "jayshetty", instagram_handle: "jayshetty", youtube_channel_id: "UCbV60AGIHBmyFbKdgMal0Cg", niche_tags: ["motivation", "personal_brand", "content"] },
  { name: "Ryan Pineda", tiktok_handle: "ryanpineda", instagram_handle: "ryanpineda", youtube_channel_id: "UC7CNVPh-H4bO0I4aK4kj4QQ", niche_tags: ["real_estate", "business", "personal_brand"] },
  { name: "Kris Krohn", tiktok_handle: "kriskrohn", instagram_handle: "kriskrohn", youtube_channel_id: "UCE87VN09uT2lzJJJ_Y2QLYA", niche_tags: ["real_estate", "business", "personal_brand"] },
  { name: "Matt Gray", tiktok_handle: "realmattgray", instagram_handle: "realmattgray", youtube_channel_id: "UChYHKRass0kZvBkVKQuZElQ", niche_tags: ["business", "personal_brand", "solopreneur"] },
  { name: "Alex Garcia", tiktok_handle: null, instagram_handle: "alexgarcia", youtube_channel_id: "UCnGOF8GmTnJu-7VsjX1IOHQ", niche_tags: ["marketing", "business", "personal_brand"] },
  { name: "Oren Meets World", tiktok_handle: "orenmeetsworld", instagram_handle: "orenmeetsworld", youtube_channel_id: "UC_tSQ6UQy2pROm-I0J7UBoA", niche_tags: ["personal_brand", "content", "business"] },
  { name: "Tom Noske", tiktok_handle: "tomnoske", instagram_handle: "tomnoske", youtube_channel_id: "UC0tNbnCRYniecs_n3d7-8dA", niche_tags: ["personal_brand", "content", "business"] },
  { name: "Caleb Ralston", tiktok_handle: "calebralston", instagram_handle: "calebralston", youtube_channel_id: "UCbc7A6bNtpyybJbGvIi0PNQ", niche_tags: ["personal_brand", "content", "business"] },
  { name: "The Futur", tiktok_handle: "thefutur", instagram_handle: "thefutur", youtube_channel_id: "UC-b3c7kxa5vU-bnmaROgvog", niche_tags: ["design", "business", "marketing"] },
  { name: "Jun Yuh", tiktok_handle: "jun_yuh", instagram_handle: "jun_yuh", youtube_channel_id: "UClDcKhHgT3x88I0q7BOT0ow", niche_tags: ["personal_brand", "content", "business"] },
  { name: "Dan Koe Talks", tiktok_handle: null, instagram_handle: null, youtube_channel_id: "UCWXYDYv5STLk-zoxMP2I1Lw", niche_tags: ["personal_brand", "business", "content"] },
  { name: "Kallaway", tiktok_handle: "kallawaymarketing", instagram_handle: "kallawaymarketing", youtube_channel_id: "UCg5WjzrwxRRUUDf7WHKPzsA", niche_tags: ["marketing", "personal_brand", "content"] },
  { name: "Neil Patel", tiktok_handle: "neilpatel", instagram_handle: "neilpatel", youtube_channel_id: "UCl-Zrl0QhF66lu1aGXaTbfw", niche_tags: ["marketing", "business", "seo"] },
  { name: "Sweat Equity Podcast", tiktok_handle: null, instagram_handle: "sweatequitypod", youtube_channel_id: "UC3c6jXLSMhDH6XlcoKXGryA", niche_tags: ["business", "personal_brand", "content"] },
];

async function seed() {
  console.log(`Seeding ${creators.length} creators...`);

  const { error } = await supabase.from("creators").upsert(
    creators.map((c) => ({
      name: c.name,
      tiktok_handle: c.tiktok_handle,
      instagram_handle: c.instagram_handle,
      youtube_channel_id: c.youtube_channel_id,
      niche_tags: c.niche_tags,
    })),
    { onConflict: "name" }
  );

  if (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${creators.length} creators.`);
}

seed();
