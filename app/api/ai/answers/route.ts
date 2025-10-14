import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
      userAnswer,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    function sanitizeMarkdown(markdown: string): string {
      // Normalize line endings
      markdown = markdown.replace(/\r\n/g, "\n");

      // Escape nested backticks inside code blocks
      markdown = markdown.replace(/```([\s\S]*?)```/g, (match, code) => {
        const safeCode = code.replace(/```/g, "ʼʼʼ"); // visually similar, prevents MDX parsing issues
        return `\`\`\`txt\n${safeCode.trim()}\n\`\`\``;
      });

      // Ensure all code blocks have a language identifier
      markdown = markdown.replace(/```(\s*\n)/g, "```txt$1");

      // Close unbalanced ```
      const openCount = (markdown.match(/```/g) || []).length;
      if (openCount % 2 !== 0) markdown += "\n```";

      // Remove zero-width & BOM chars (can break MDX parse)
      markdown = markdown.replace(/[\u200B-\u200D\uFEFF]/g, "");

      // MDX doesn't like JSX-like tags in markdown if unescaped
      markdown = markdown.replace(/<([^>]+)>/g, "&lt;$1&gt;");

      return markdown.trim();
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate a markdown-formatted response to the following question: "${question}".

      Consider the provided context:
      **Context:** ${content}
      
      Also, prioritize and incorporate the user's answer when formulating your response:
      **User's Answer:** ${userAnswer}

      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
      Provide the final answer in markdown format.`,
      system: `You are a helpful assistant that provides informative responses in markdown format.
- Always close code blocks with triple backticks.
- Always specify a language after opening code fences (e.g. \`\`\`js, \`\`\`py, \`\`\`ts, \`\`\`html, or use \`\`\`txt if unknown).
- Never leave dangling or empty code fences.
- Avoid returning structures that may cause JSON parsing or markdown rendering errors.`,
    });

    const sanitized = sanitizeMarkdown(text);

    return NextResponse.json(
      { success: true, data: sanitized },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
