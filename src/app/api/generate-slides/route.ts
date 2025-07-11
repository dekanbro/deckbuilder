import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  apiKey: string;
  keyPoints: string;
  resources: string;
  presentationStyle: string;
  targetAudience: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { apiKey, keyPoints, resources, presentationStyle, targetAudience } = body;

    // Use server-side API key if available, otherwise require user-provided key
    const useApiKey = process.env.OPENAI_API_KEY || apiKey;
    
    if (!useApiKey || !keyPoints) {
      return NextResponse.json(
        { error: 'API key and key points are required' },
        { status: 400 }
      );
    }

    // Read the sample deck and README for context
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const sampleDeckResponse = await fetch(`${baseUrl}/deck.md`);
    const sampleDeck = await sampleDeckResponse.text();

    // Create the prompt for OpenAI
    const prompt = `You are an expert presentation designer. Create a slide deck in markdown format based on the user's requirements.

CONTEXT:
- Target Audience: ${targetAudience}
- Presentation Style: ${presentationStyle}
- User's Key Points: ${keyPoints}
${resources ? `- Additional Resources: ${resources}` : ''}

FORMATTING REQUIREMENTS:
1. Use the DeckBuilder markdown format with slides separated by "---"
2. Include slide options as HTML comments for styling (e.g., <!-- center bg=#222 color=#fff -->)
3. Use appropriate slide transitions, backgrounds, and text sizes
4. Follow the sample structure and styling options shown below
5. OUTPUT ONLY THE RAW MARKDOWN - DO NOT wrap in code blocks or backticks

SAMPLE DECKBUILDER FORMAT:
\`\`\`
${sampleDeck.substring(0, 1000)}...
\`\`\`

AVAILABLE STYLING OPTIONS:
- center: centers content
- bg=<color>: background color (hex, rgb, rgba, or named colors)
- color=<color>: text color
- font=<fontname>: Google font name (e.g., Roboto, Lora, Pacifico)
- size=<size>: heading size (medium, large, huge, massive)
- body=<size>: body text size (small, medium, large)
- transition=<type>: slide transition (fade, slide, zoom, none)

GUIDELINES:
- Create 5-8 slides that effectively communicate the key points
- Use visual hierarchy with appropriate text sizes
- Include a compelling title slide
- Add slide transitions that match the presentation style
- Use appropriate colors and backgrounds for the target audience
- Include a conclusion/call-to-action slide
- Make slides concise but impactful
- OUTPUT ONLY RAW MARKDOWN without any code block wrapping

Generate a complete slide deck now (raw markdown only):`;

    // Make request to OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert presentation designer who creates slide decks in markdown format using the DeckBuilder syntax.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const openaiData = await openaiResponse.json();
    let generatedMarkdown = openaiData.choices[0]?.message?.content;

    if (!generatedMarkdown) {
      throw new Error('No content generated from OpenAI');
    }

    // Clean up the generated markdown - remove code block wrapping if present
    generatedMarkdown = generatedMarkdown
      .replace(/^```markdown\s*/i, '')  // Remove opening ```markdown
      .replace(/^```\s*/m, '')          // Remove opening ``` 
      .replace(/\s*```\s*$/, '')        // Remove closing ```
      .trim();

    return NextResponse.json({
      markdown: generatedMarkdown,
      success: true
    });

  } catch (error) {
    console.error('Error generating slides:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate slides',
        success: false 
      },
      { status: 500 }
    );
  }
}
