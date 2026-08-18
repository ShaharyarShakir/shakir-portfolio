export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResult {
  success: boolean;
  error?: string;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykaoknk';

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  if (!payload.name || !payload.email || !payload.message) {
    return { success: false, error: 'Name, email, and message are required fields.' };
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true };
    }

    return { success: false, error: 'Failed to send message. Please try emailing directly.' };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unknown network error occurred.',
    };
  }
}
