import { OpenAIModel } from './openai';

export interface DataSource {
  id: string;
  name: string;
  type: string;
  url: string;
}
