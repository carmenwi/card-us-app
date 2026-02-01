"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const prompt = `
Analyze this image to generate a trading card. 
Your persona is a "Gen Z Aura Judge": Sarcastic, chronically online, dry humor, and brutally honest but funny.

**TASK:**
Return a JSON object with RPG stats and a description IN ENGLISH based on the visual "vibe" of the photo.

**STYLE GUIDE (CRITICAL):**
1.  **NO FORCED SLANG:** Do NOT use outdated words like "Yeet", "YOLO", "Swag", "On Fleek", or "Lit". That is cringe.
2.  **VIBE:** Use current internet humor (Twitter/TikTok comment style). Focus on "Aura points", "Main Character Energy", "NPC energy", "Bro really thought...", "Imagine...", or "POV:".
3.  **TONE:** Can be a light roast (teasing) or hyping the user up, depending on how cool or funny the photo is.
4.  **FORMAT:** Keep the description SHORT (under 120 characters). Lowercase aesthetic is allowed but optional.

**OUTPUT FORMAT (JSON ONLY):**
{
  "title": "A short, punchy, RPG-style class name (e.g., 'The Midnight Snacker', 'Gym NPC', 'Chaos Creator')",
  "stats": {
    "charisma": (0-100, based on confidence),
    "style": (0-100, based on outfit/aesthetic),
    "nature": (0-100, based on environment),
    "aura": (-5000 to +5000, can be negative if the pic is embarrassing/cringe)
  },
  "description": "The witty comment. Examples: 'Bro is fighting demons in the mirror.', 'Aura +1000 for the messy room.', 'This goes hard. Feel free to screenshot.', 'Pov: you just woke up and chose violence.'",
  "rarity": "('Common', 'Rare', 'Special', 'Legendary' - give Legendary only if the pic is truly epic or hilarious)"
}
`;

export interface CardStatsResult {
  stats: { charisma: number; style: number; nature: number; aura: number };
  title: string;
  description: string;
  rarity: string;
}

const DEFAULT_CARD_STATS: CardStatsResult = {
  title: "Aura Offline",
  description: "Default mode: aura still loading.",
  rarity: "Common",
  stats: {
    charisma: 50,
    style: 50,
    nature: 50,
    aura: 250,
  },
};

function buildDefaultCardStats(customTitle?: string): CardStatsResult {
  return {
    ...DEFAULT_CARD_STATS,
    title: customTitle?.trim() || DEFAULT_CARD_STATS.title,
  };
}

function parseJsonFromResponse(text: string): CardStatsResult {
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  return JSON.parse(cleaned) as CardStatsResult;
}

export async function generateCardStats(
  imageBase64: string,
  userContext?: string,
  customTitle?: string
): Promise<CardStatsResult> {
  const apiKeys = [
    process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY_2,
    process.env.GOOGLE_API_KEY_3,
  ].filter((key): key is string => Boolean(key));

  if (apiKeys.length === 0) {
    return buildDefaultCardStats(customTitle);
  }

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  // Build dynamic prompt based on provided parameters
  let finalPrompt = prompt;

  if (userContext) {
    finalPrompt += `\n\n**USER CONTEXT:** ${userContext}\nConsider this context when analyzing the image.`;
  }

  if (customTitle) {
    finalPrompt += `\n\n**IMPORTANT:** Use exactly this title: "${customTitle}" (do not generate a different title).`;
  }

  const modelId = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

  for (const apiKey of apiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // gemini-2.0-flash has limit 0 on free tier; use model with free quota
      const model = genAI.getGenerativeModel({ model: modelId });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        { text: finalPrompt },
      ]);

      const response = result.response;
      if (!response?.text) {
        throw new Error("No text in Gemini response.");
      }

      return parseJsonFromResponse(response.text());
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isQuotaError = /quota|rate|exceed|429|resource_exhausted/i.test(message);
      if (!isQuotaError) {
        continue;
      }
      continue;
    }
  }

  return buildDefaultCardStats(customTitle);
}

/** Card data used to simulate a battle (title, description, stats). */
export interface BattleCardData {
  title: string;
  description: string;
  stats: { charisma: number; style: number; nature: number; aura: number };
}

export interface BattleResult {
  winner: "1" | "2";
  commentary: string;
  critical_hit: boolean;
}

/**
 * Gen Z commentator: Gemini acts as battle referee between two cards.
 * Returns winner, commentary, and whether it was a critical hit.
 */
export async function simulateBattle(
  cardA: BattleCardData,
  cardB: BattleCardData
): Promise<BattleResult> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY in environment.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: { temperature: 1.1 },
  });

  const prompt = `
Act as a "Gen Z Battle Referee" for a trading card game based on vibes and aura.

**THE FIGHTERS:**
Fighter 1: "${cardA.title}" (Description: "${cardA.description}", Stats: ${JSON.stringify(cardA.stats)})
Fighter 2: "${cardB.title}" (Description: "${cardB.description}", Stats: ${JSON.stringify(cardB.stats)})

**TASK:**
Analyze the match-up. Who wins based on "Aura" and "Vibe"? Short and witty commentary.
(Example: A "Gym Bro" card might have high strength, but a "Sleeping Cat" card has infinite Aura and wins by doing nothing).

**OUTPUT JSON ONLY (no markdown, no \`\`\`):**
{
  "winner": "1" or "2",
  "commentary": "A short, witty, high-energy shoutcaster comment (max 1 sentence) IN ENGLISH. Roast the loser slightly and hype the winner. Use internet humor (e.g., 'Bro thought he could win...', 'Emotional damage'). NO CRINGE SLANG.",
  "critical_hit": true or false
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    if (!response?.text) {
      throw new Error("No text in Gemini response.");
    }
    const cleanedText = response.text().replace(/```json|```/g, "").trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : cleanedText;
    return JSON.parse(jsonStr) as BattleResult;
  } catch (error) {
    console.error("Battle error:", error);
    return {
      winner: "1",
      commentary:
        "The referee is blind (Server Error). Winner decided by coin flip.",
      critical_hit: false,
    };
  }
}
