import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-chat'),
    prompt,
    system: '首先重复一遍我给出的句子: "语句分析:xxxx",然后根据给出的句子,你需要分析其中的语法结构.'
  });

  return result.toDataStreamResponse();
}