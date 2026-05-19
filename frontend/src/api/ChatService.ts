// ─────────────────────────────────────────────────────────────────────────────
// chatService.ts
// Thin service layer that wraps the /chat backend endpoint.
// Mirrors the exact request/response contract of the aiChat controller.
// ─────────────────────────────────────────────────────────────────────────────

import { API_URL } from "../api/api";

// ── Request / Response types ──────────────────────────────────────────────────

/** Single turn in the conversation history sent to the backend */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Payload sent to POST /chat */
export interface ChatRequest {
  messages: ChatMessage[];
}

/** Shape returned by the backend on success */
export interface ChatSuccessResponse {
  reply: string;
}

/** Shape returned by the backend on failure (500 / 503) */
export interface ChatErrorResponse {
  error: string;
}

/** Union of both outcomes, discriminated by the presence of `reply` */
export type ChatResponse = ChatSuccessResponse | ChatErrorResponse;

// ── Type guard ────────────────────────────────────────────────────────────────

export function isChatError(res: ChatResponse): res is ChatErrorResponse {
  return "error" in res;
}

// ── Friendly error messages ───────────────────────────────────────────────────

const NETWORK_ERROR =
  "Unable to connect. Please check your internet connection.";
const SERVICE_UNAVAILABLE =
  "AI service is temporarily unavailable. Please try again in a moment.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Sends the conversation history to the backend and returns the assistant reply.
 *
 * @param messages - Full conversation history (user + assistant turns so far).
 *                   The backend extracts the last message as the active prompt.
 * @returns         The assistant's reply string.
 * @throws          An `Error` with a user-facing message on any failure.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const payload: ChatRequest = { messages };

  let response: Response;

  try {
    response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // fetch() itself threw — network unreachable, DNS failure, CORS hard-block, etc.
    throw new Error(NETWORK_ERROR);
  }

  const data: ChatResponse = await response.json().catch(() => ({
    error: GENERIC_ERROR,
  }));

  // The backend returned a non-2xx status
  if (!response.ok) {
    if (isChatError(data)) {
      // 503 already has a friendly message from the backend; surface it directly
      throw new Error(
        response.status === 503 ? SERVICE_UNAVAILABLE : data.error
      );
    }
    throw new Error(`API error ${response.status}`);
  }

  if (isChatError(data)) {
    throw new Error(data.error || GENERIC_ERROR);
  }

  return data.reply;
}